<template>
  <main class="mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:py-8">
    <header class="border-b border-border pb-5">
      <p class="text-xs font-bold uppercase text-primary">Administración</p>
      <h1 class="mt-1 font-heading text-3xl font-extrabold">Nómina</h1>
      <p class="mt-1 max-w-2xl text-sm text-muted-foreground">
        Registra el pago y recaba la firma del empleado como comprobante de
        recibido.
      </p>
    </header>

    <Alert v-if="loadError" variant="destructive" class="mt-6">
      <CircleAlert :size="18" />
      <AlertTitle>No se pudo cargar nómina</AlertTitle>
      <AlertDescription>{{ loadError }}</AlertDescription>
    </Alert>

    <form class="mt-7 space-y-8" @submit.prevent="save">
      <section>
        <div class="mb-4 flex items-center gap-3">
          <h2 class="font-heading text-lg font-bold">Datos del pago</h2>
          <Separator class="flex-1" />
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-1.5 md:col-span-2">
            <Label>Empleado</Label>
            <Select v-model="form.employee" required>
              <SelectTrigger
                ><SelectValue placeholder="Selecciona un empleado"
              /></SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="person in employees"
                  :key="person.id"
                  :value="person.id"
                >
                  {{ employeeName(person) }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-1.5">
            <Label for="period-start">Inicio del periodo</Label>
            <Input
              id="period-start"
              v-model="form.period_start"
              type="date"
              required
            />
          </div>
          <div class="space-y-1.5">
            <Label for="period-end">Fin del periodo</Label>
            <Input
              id="period-end"
              v-model="form.period_end"
              type="date"
              required
            />
          </div>
          <div class="space-y-1.5">
            <Label for="pay-date">Fecha de pago</Label>
            <Input id="pay-date" v-model="form.pay_date" type="date" required />
          </div>
          <div class="space-y-1.5">
            <Label>Método de pago</Label>
            <Select v-model="form.payment_method">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Efectivo</SelectItem>
                <SelectItem value="transfer">Transferencia</SelectItem>
                <SelectItem value="check">Cheque</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section>
        <div class="mb-4 flex items-center gap-3">
          <h2 class="font-heading text-lg font-bold">Cálculo</h2>
          <Separator class="flex-1" />
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div class="space-y-1.5">
            <Label for="regular-hours">Horas regulares</Label>
            <Input
              id="regular-hours"
              v-model.number="form.regular_hours"
              type="number"
              min="0"
              step="0.25"
              required
            />
          </div>
          <div class="space-y-1.5">
            <Label for="overtime-hours">Horas extra</Label>
            <Input
              id="overtime-hours"
              v-model.number="form.overtime_hours"
              type="number"
              min="0"
              step="0.25"
            />
          </div>
          <div class="space-y-1.5">
            <Label for="hourly-rate">Pago por hora</Label>
            <Input
              id="hourly-rate"
              v-model.number="form.hourly_rate"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div class="space-y-1.5">
            <Label for="gross-pay">Pago bruto</Label>
            <Input id="gross-pay" :model-value="money(grossPay)" readonly />
          </div>
          <div class="space-y-1.5">
            <Label for="deductions">Deducciones</Label>
            <Input
              id="deductions"
              v-model.number="form.deductions"
              type="number"
              min="0"
              step="0.01"
            />
          </div>
          <div class="space-y-1.5">
            <Label for="net-pay">Pago neto</Label>
            <Input
              id="net-pay"
              :model-value="money(netPay)"
              class="font-bold"
              readonly
            />
          </div>
          <div class="space-y-1.5 sm:col-span-2 lg:col-span-3">
            <Label for="payroll-notes">Notas</Label>
            <Textarea
              id="payroll-notes"
              v-model="form.notes"
              rows="3"
              placeholder="Bonos, deducciones u observaciones"
            />
          </div>
        </div>
      </section>

      <section>
        <div class="mb-4 flex items-center gap-3">
          <h2 class="font-heading text-lg font-bold">Recibo y firma</h2>
          <Separator class="flex-1" />
        </div>
        <div
          class="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"
        >
          <p class="font-bold">Confirmación de recibido</p>
          <p class="mt-1">{{ acknowledgement }}</p>
        </div>
        <div class="mt-4">
          <MoleculesSignaturePad ref="signaturePad" />
        </div>
        <div class="mt-4 flex items-start gap-3">
          <Checkbox id="acknowledged" v-model="acknowledged" />
          <Label for="acknowledged" class="cursor-pointer leading-5">
            El empleado confirma que leyó el mensaje y acepta firmar como
            constancia de recibido.
          </Label>
        </div>
      </section>

      <Alert v-if="saveError" variant="destructive">
        <CircleAlert :size="18" />
        <AlertTitle>No se pudo guardar</AlertTitle>
        <AlertDescription>{{ saveError }}</AlertDescription>
      </Alert>
      <Alert
        v-if="saved"
        class="border-emerald-300 bg-emerald-50 text-emerald-950"
      >
        <CircleCheck :size="18" />
        <AlertTitle>Pago registrado</AlertTitle>
        <AlertDescription
          >La nómina y firma se guardaron correctamente.</AlertDescription
        >
      </Alert>
      <Button type="submit" size="lg" :disabled="saving || !acknowledged">
        <Save :size="17" class="mr-2" />
        {{ saving ? "Guardando..." : "Guardar pago firmado" }}
      </Button>
    </form>

    <section class="mt-12 border-t border-border pt-7">
      <h2 class="font-heading text-lg font-bold">Pagos recientes</h2>
      <div v-if="loading" class="mt-4 space-y-2">
        <Skeleton v-for="index in 3" :key="index" class="h-16 w-full" />
      </div>
      <div
        v-else-if="recent.length"
        class="mt-4 divide-y divide-border border-y border-border"
      >
        <div
          v-for="entry in recent"
          :key="entry.id"
          class="grid gap-1 py-3 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6"
        >
          <div>
            <p class="font-semibold">
              {{ employeeName(entry.expand?.employee) }}
            </p>
            <p class="text-xs text-muted-foreground">
              {{ entry.period_start }} a {{ entry.period_end }}
            </p>
          </div>
          <p class="text-sm text-muted-foreground">
            {{ paymentMethodLabel(entry.payment_method) }}
          </p>
          <p class="font-bold tabular-nums">{{ money(entry.net_pay) }}</p>
        </div>
      </div>
      <p v-else class="mt-4 text-sm text-muted-foreground">
        Todavía no hay pagos registrados.
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@common/components/ui/alert";
import { Button } from "@common/components/ui/button";
import { Checkbox } from "@common/components/ui/checkbox";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@common/components/ui/select";
import { Separator } from "@common/components/ui/separator";
import { Skeleton } from "@common/components/ui/skeleton";
import { Textarea } from "@common/components/ui/textarea";
import { CircleAlert, CircleCheck, Save } from "lucide-vue-next";
import type { ScheduleStaff } from "~/types/staff-schedule";
import type {
  PayrollEntry,
  PayrollInput,
  PayrollPaymentMethod,
} from "~/types/payroll";
import { todayISO } from "~/utils/comandas";

definePageMeta({ layout: "staff", staffOnly: true, verifiedOnly: true });

interface SignaturePadApi {
  clear(): void;
  toFile(): Promise<File | null>;
}

const payroll = usePayroll();
const employees = ref<ScheduleStaff[]>([]);
const recent = ref<PayrollEntry[]>([]);
const loading = ref(true);
const saving = ref(false);
const acknowledged = ref(false);
const saved = ref(false);
const loadError = ref("");
const saveError = ref("");
const signaturePad = ref<SignaturePadApi>();
const form = reactive<PayrollInput>({
  employee: "",
  period_start: todayISO(),
  period_end: todayISO(),
  pay_date: todayISO(),
  regular_hours: 0,
  overtime_hours: 0,
  hourly_rate: 0,
  deductions: 0,
  payment_method: "cash",
  notes: "",
});

const grossPay = computed(
  () =>
    form.regular_hours * form.hourly_rate +
    form.overtime_hours * form.hourly_rate * 1.5,
);
const netPay = computed(() => Math.max(0, grossPay.value - form.deductions));
const acknowledgement = computed(
  () =>
    `Al firmar, confirmo que recibí de Breezy Meals la cantidad de ${money(netPay.value)} correspondiente al periodo del ${form.period_start || "____"} al ${form.period_end || "____"}, mediante ${paymentMethodLabel(form.payment_method).toLowerCase()}. Mi firma sirve como recibo y constancia de pago.`,
);

function employeeName(person?: ScheduleStaff) {
  return person?.name?.trim() || person?.username || "Empleado";
}

function paymentMethodLabel(method: PayrollPaymentMethod) {
  return {
    cash: "Efectivo",
    transfer: "Transferencia",
    check: "Cheque",
    other: "Otro método",
  }[method];
}

function money(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount || 0);
}

async function load() {
  loading.value = true;
  loadError.value = "";
  try {
    employees.value = await payroll.listEmployees();
    try {
      recent.value = await payroll.listRecent();
    } catch (error: any) {
      loadError.value =
        error?.status === 404
          ? "La colección payroll_entries aún no está instalada en PocketBase."
          : (error?.message ?? "No se pudo cargar el historial de nómina.");
    }
  } catch (error: any) {
    loadError.value = error?.message ?? "No se pudo cargar el personal.";
  } finally {
    loading.value = false;
  }
}

async function save() {
  saveError.value = "";
  saved.value = false;
  if (!acknowledged.value) {
    saveError.value = "El empleado debe confirmar el recibo antes de firmar.";
    return;
  }
  const signature = await signaturePad.value?.toFile();
  if (!signature) {
    saveError.value = "Solicita la firma del empleado antes de guardar.";
    return;
  }

  saving.value = true;
  try {
    await payroll.createEntry({ ...form }, signature, acknowledgement.value);
    saved.value = true;
    acknowledged.value = false;
    signaturePad.value?.clear();
    recent.value = await payroll.listRecent();
  } catch (error: any) {
    saveError.value =
      error?.status === 400
        ? "Ya existe un pago para este empleado y periodo, o falta un dato obligatorio."
        : (error?.message ?? "No se pudo guardar el pago.");
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>
