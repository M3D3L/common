import usePocketBase from "@common/composables/usePocketbase";
import type {
  ScheduleStaff,
  StaffShift,
  StaffShiftInput,
} from "~/types/staff-schedule";

const SHIFTS = "staff_shifts";

export function useStaffSchedule() {
  const pb = usePocketBase();

  const canEdit = computed(() => pb.authStore.record?.verified === true);
  const currentUserId = computed(() => pb.authStore.record?.id ?? "");

  async function listStaff(): Promise<ScheduleStaff[]> {
    return (await pb.collection("users").getFullList({
      sort: "name,username",
      requestKey: null,
    })) as ScheduleStaff[];
  }

  async function listWeek(
    startDate: string,
    endDate: string,
  ): Promise<StaffShift[]> {
    return (await pb.collection(SHIFTS).getFullList({
      filter: `business_date >= "${startDate}" && business_date <= "${endDate}"`,
      sort: "business_date,start_time",
      requestKey: null,
    })) as StaffShift[];
  }

  async function saveShift(
    input: StaffShiftInput,
    shiftId?: string,
  ): Promise<StaffShift> {
    if (!canEdit.value)
      throw new Error("Solo usuarios verificados pueden editar horarios.");
    if (
      !input.assigned_to ||
      !/^\d{4}-\d{2}-\d{2}$/.test(input.business_date)
    ) {
      throw new Error("Selecciona un empleado y una fecha válida.");
    }
    if (
      !/^\d{2}:\d{2}$/.test(input.start_time) ||
      !/^\d{2}:\d{2}$/.test(input.end_time)
    ) {
      throw new Error("Ingresa una hora de entrada y salida válida.");
    }
    if (input.end_time <= input.start_time) {
      throw new Error("La hora de salida debe ser posterior a la entrada.");
    }

    const data = {
      ...input,
      position: input.position?.trim() ?? "",
      notes: input.notes?.trim() ?? "",
      assigned_by: currentUserId.value,
    };

    return (
      shiftId
        ? await pb
            .collection(SHIFTS)
            .update(shiftId, data, { requestKey: null })
        : await pb.collection(SHIFTS).create(data, { requestKey: null })
    ) as StaffShift;
  }

  async function removeShift(shiftId: string): Promise<void> {
    if (!canEdit.value)
      throw new Error("Solo usuarios verificados pueden editar horarios.");
    await pb.collection(SHIFTS).delete(shiftId, { requestKey: null });
  }

  return {
    canEdit,
    currentUserId,
    listStaff,
    listWeek,
    saveShift,
    removeShift,
  };
}
