import type { RecordModel } from "pocketbase";

export interface ScheduleStaff extends RecordModel {
  name?: string;
  username?: string;
  title?: string;
  verified: boolean;
}

export interface StaffShift extends RecordModel {
  assigned_to: string;
  business_date: string;
  start_time: string;
  end_time: string;
  position?: string;
  notes?: string;
  assigned_by: string;
}

export interface StaffShiftInput {
  assigned_to: string;
  business_date: string;
  start_time: string;
  end_time: string;
  position?: string;
  notes?: string;
}
