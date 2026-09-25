import type { RecordModel } from "pocketbase";
import type { ScheduleStaff } from "~/types/staff-schedule";

export type PayrollPaymentMethod = "cash" | "transfer" | "check" | "other";

export interface PayrollEntry extends RecordModel {
  employee: string;
  period_start: string;
  period_end: string;
  pay_date: string;
  regular_hours: number;
  overtime_hours: number;
  hourly_rate: number;
  gross_pay: number;
  deductions: number;
  net_pay: number;
  payment_method: PayrollPaymentMethod;
  status: "signed" | "paid";
  notes?: string;
  acknowledgement: string;
  employee_signature: string;
  created_by: string;
  expand?: { employee?: ScheduleStaff };
}

export interface PayrollInput {
  employee: string;
  period_start: string;
  period_end: string;
  pay_date: string;
  regular_hours: number;
  overtime_hours: number;
  hourly_rate: number;
  deductions: number;
  payment_method: PayrollPaymentMethod;
  notes: string;
}
