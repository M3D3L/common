import usePocketBase from "@common/composables/usePocketbase";
import type { ScheduleStaff } from "~/types/staff-schedule";
import type { PayrollEntry, PayrollInput } from "~/types/payroll";

const COLLECTION = "payroll_entries";

export function usePayroll() {
  const pb = usePocketBase();
  const canManage = computed(() => pb.authStore.record?.verified === true);

  async function listEmployees(): Promise<ScheduleStaff[]> {
    return (await pb.collection("users").getFullList({
      sort: "name,username",
      requestKey: null,
    })) as ScheduleStaff[];
  }

  async function listRecent(): Promise<PayrollEntry[]> {
    return (
      await pb.collection(COLLECTION).getList(1, 20, {
        sort: "-pay_date,-created",
        expand: "employee",
        requestKey: null,
      })
    ).items as PayrollEntry[];
  }

  async function createEntry(
    input: PayrollInput,
    signature: File,
    acknowledgement: string,
  ): Promise<PayrollEntry> {
    if (!canManage.value) {
      throw new Error("Solo usuarios verificados pueden registrar nómina.");
    }
    if (
      !input.employee ||
      !input.period_start ||
      !input.period_end ||
      !input.pay_date
    ) {
      throw new Error("Selecciona el empleado y completa todas las fechas.");
    }
    if (input.period_end < input.period_start) {
      throw new Error("El fin del periodo no puede ser anterior al inicio.");
    }
    if (
      input.regular_hours < 0 ||
      input.overtime_hours < 0 ||
      input.hourly_rate < 0 ||
      input.deductions < 0
    ) {
      throw new Error("Las horas y cantidades no pueden ser negativas.");
    }

    const grossPay =
      input.regular_hours * input.hourly_rate +
      input.overtime_hours * input.hourly_rate * 1.5;
    const netPay = Math.max(0, grossPay - input.deductions);
    const form = new FormData();
    form.set("employee", input.employee);
    form.set("period_start", input.period_start);
    form.set("period_end", input.period_end);
    form.set("pay_date", input.pay_date);
    form.set("regular_hours", String(input.regular_hours));
    form.set("overtime_hours", String(input.overtime_hours));
    form.set("hourly_rate", String(input.hourly_rate));
    form.set("gross_pay", grossPay.toFixed(2));
    form.set("deductions", String(input.deductions));
    form.set("net_pay", netPay.toFixed(2));
    form.set("payment_method", input.payment_method);
    form.set("status", "paid");
    form.set("notes", input.notes.trim());
    form.set("acknowledgement", acknowledgement);
    form.set("employee_signature", signature);
    form.set("created_by", pb.authStore.record?.id ?? "");

    return (await pb.collection(COLLECTION).create(form, {
      requestKey: null,
    })) as PayrollEntry;
  }

  return { canManage, listEmployees, listRecent, createEntry };
}
