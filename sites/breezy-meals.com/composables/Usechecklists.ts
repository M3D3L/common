import {
  ref,
  reactive,
  computed,
  provide,
  inject,
  onMounted,
  onBeforeUnmount,
  type InjectionKey,
} from "vue";
import {
  progress,
  isItemDone,
  isItemInRange,
  templateForDay,
  filterTemplatesByItemIds,
  listOnDay,
  weekdayOf,
  weekDates,
  dayNumber,
  isClosedDay,
  addDaysISO,
  todayISO,
  prettyDate as prettyOf,
  WEEKDAY_SHORT,
  type ChecklistTemplate,
  type ChecklistSection,
  type ChecklistItem,
  type ChecklistRun,
  type ItemResult,
  type RunStatus,
  type RunsByDate,
} from "~/utils/checklists";
import usePocketBase from "@common/composables/usePocketbase";
import type {
  ChecklistAssignment,
  ChecklistStaffUser,
  ChecklistTaskInput,
} from "~/composables/useNormalizedOperations";

/* ===== Config ===== */
const STORAGE_KEY = "checklists";
const RECURRING_ASSIGNMENT_DATE = "*";

// Rapid ticks are batched before writing to the DB.
const SAVE_DEBOUNCE_MS = 600;

/**
 * Single source of truth for Checklists.
 *  - Tasks are scheduled per weekday; the active view is one selectable date.
 *  - `runs` (ticks/results) are nested by date and double as history.
 *  - Kept LIVE via record realtime; rehydrates on refresh.
 */
function createChecklistsStore() {
  const { subscribe, unsubscribe, user } = usePocketBaseCore();
  const {
    loadChecklists,
    saveChecklistAssignment,
    deleteChecklistAssignment,
    createChecklistTask,
    updateChecklistTask,
    archiveChecklistTask,
    saveChecklistRun,
  } = useNormalizedOperations();
  const pb = usePocketBase();
  const currentUserId = ref("");
  const currentUserName = ref("");
  const isManager = ref(false);

  function syncAuth() {
    const model = pb.authStore.model ?? (user as any);
    currentUserId.value = model?.id ?? "";
    currentUserName.value =
      model?.name || model?.username || model?.email || model?.id || "";
    isManager.value = model?.verified === true;
  }
  syncAuth();

  const { formatChecklist, formatChecklistReopen, waLink } = useWhatsappOrder();

  /* ===== State ===== */
  const version = ref(2);
  const templates = ref<ChecklistTemplate[]>([]);
  const assignments = ref<ChecklistAssignment[]>([]);
  const staffUsers = ref<ChecklistStaffUser[]>([]);
  // runsByDate[date][checklistId] = run (kept in full so we never drop history).
  const runsByDate = reactive<RunsByDate>({});
  const selectedDate = ref<string>(todayISO());

  const loading = ref(true);
  const isRefreshing = ref(false);
  const live = ref(false);
  const toastMsg = ref("");

  /* ===== WhatsApp (DB first, then WhatsApp; pop-up-safe) ===== */
  function openBlankTab(): Window | null {
    return import.meta.client ? window.open("", "_blank") : null;
  }
  function sendToTab(tab: Window | null, text: string) {
    const url = waLink(text);
    if (tab) tab.location.href = url;
    else if (import.meta.client) window.open(url, "_blank");
  }
  function buildChecklistMessage(t: ChecklistTemplate, run?: ChecklistRun) {
    const sections = t.sections.map((s) => ({
      label: s.label,
      lines: s.items.map((it) => {
        const r = run?.results?.[it.id];
        const done = isItemDone(it, r);
        let detail: string | undefined;
        const kind = it.kind ?? "check";
        if (kind === "number" && typeof r?.value === "number") {
          const range = isItemInRange(it, r);
          const flag =
            range === false ? " ⚠️ fuera de rango" : range === true ? " ✓" : "";
          detail = `${r.value}${it.unit ?? ""}${flag}`;
        } else if (kind === "text" && typeof r?.value === "string") {
          detail = r.value;
        }
        return { label: it.label, done, detail, required: it.required };
      }),
    }));
    const p = progress(t, run);
    return {
      title: t.title,
      date: prettyOf(selectedDate.value),
      by: run?.by,
      sections,
      doneCount: p.done,
      totalCount: p.total,
      complete: p.complete,
    };
  }

  /* ===== Runs for the SELECTED date ===== */
  function dayMap(): Record<string, ChecklistRun> {
    const d = selectedDate.value;
    if (!runsByDate[d]) runsByDate[d] = {};
    return runsByDate[d];
  }
  const runFor = (id: string): ChecklistRun | undefined =>
    runsByDate[selectedDate.value]?.[id];

  function blankRun(checklistId: string): ChecklistRun {
    return {
      checklistId,
      bizDate: selectedDate.value,
      startedAt: Date.now(),
      by: currentUserName.value,
      status: "in_progress",
      results: {},
    };
  }
  function ensureRun(id: string): ChecklistRun {
    const map = dayMap();
    if (!map[id]) map[id] = blankRun(id);
    return map[id];
  }

  /* ===== Week strip + day view ===== */
  const selectedWeekday = computed(() => weekdayOf(selectedDate.value));
  const isSelectedClosed = computed(() => isClosedDay(selectedDate.value));
  const selectedPretty = computed(() => prettyOf(selectedDate.value));
  const isTodaySelected = computed(() => selectedDate.value === todayISO());

  const weekStrip = computed(() =>
    weekDates(selectedDate.value).map((date) => {
      const wd = weekdayOf(date);
      return {
        date,
        weekday: wd,
        short: WEEKDAY_SHORT[wd],
        num: dayNumber(date),
        isToday: date === todayISO(),
        isSelected: date === selectedDate.value,
        isClosed: wd === 0,
      };
    }),
  );

  const activeTemplates = computed(() =>
    templates.value.filter((t) => t.active !== false),
  );
  const templatesEmpty = computed(() => templates.value.length === 0);

  const selectedAssignments = computed(() => {
    const effectiveByItem = new Map<string, ChecklistAssignment>();
    assignments.value
      .filter(
        (assignment) => assignment.businessDate === RECURRING_ASSIGNMENT_DATE,
      )
      .forEach((assignment) =>
        effectiveByItem.set(assignment.itemRecordId, assignment),
      );
    assignments.value
      .filter((assignment) => assignment.businessDate === selectedDate.value)
      .forEach((assignment) =>
        effectiveByItem.set(assignment.itemRecordId, assignment),
      );
    return [...effectiveByItem.values()];
  });
  const assignmentFor = (itemRecordId?: string) =>
    itemRecordId
      ? selectedAssignments.value.find(
          (assignment) => assignment.itemRecordId === itemRecordId,
        )
      : undefined;

  const scheduledDayLists = computed(() =>
    activeTemplates.value
      .filter((t) => listOnDay(t, selectedWeekday.value))
      .map((t) => templateForDay(t, selectedWeekday.value)),
  );
  // PocketBase already limits assignment reads; this local filter keeps the
  // rendered task tree aligned with the signed-in employee.
  const dayLists = computed(() => {
    if (isManager.value) return scheduledDayLists.value;
    const assignedItemIds = new Set(
      selectedAssignments.value
        .filter((assignment) => assignment.assignedTo === currentUserId.value)
        .map((assignment) => assignment.itemRecordId),
    );
    return filterTemplatesByItemIds(scheduledDayLists.value, assignedItemIds);
  });

  const assignableUsers = computed(() =>
    staffUsers.value.filter(
      (staffUser) => staffUser.id !== currentUserId.value,
    ),
  );
  const staffName = (userId: string) =>
    staffUsers.value.find((staffUser) => staffUser.id === userId)?.name ||
    "Empleado";

  const dayTotal = computed(() => dayLists.value.length);
  const completedCount = computed(
    () => dayLists.value.filter((t) => statusFor(t.id) === "done").length,
  );

  /* ===== Stateful evaluators (all against the selected date) ===== */
  const progressFor = (id: string) => {
    const template = dayLists.value.find((item) => item.id === id);
    return template
      ? progress(template, runFor(id))
      : {
          done: 0,
          total: 0,
          reqTotal: 0,
          reqDone: 0,
          complete: false,
          requiredMet: true,
        };
  };
  const statusFor = (id: string): RunStatus | null =>
    runFor(id)?.status ?? null;
  const resultFor = (id: string, itemId: string): ItemResult | undefined =>
    runFor(id)?.results?.[itemId];

  function applyData(data: {
    templates: ChecklistTemplate[];
    runsByDate: RunsByDate;
    assignments: ChecklistAssignment[];
    staffUsers: ChecklistStaffUser[];
  }) {
    templates.value = data.templates;
    assignments.value = data.assignments;
    staffUsers.value = data.staffUsers;
    Object.keys(runsByDate).forEach((k) => delete runsByDate[k]);
    Object.assign(runsByDate, data.runsByDate);
  }

  /* ===== Load ===== */
  async function loadAll() {
    loading.value = true;
    try {
      applyData(await loadChecklists(isManager.value));
    } catch {
      // Offline: keep the local cache.
    } finally {
      loading.value = false;
    }
  }

  /* ===== Save (optimistic + debounce; writes only changed runs) ===== */
  let saveTimer: ReturnType<typeof setTimeout> | undefined;
  const dirtyRuns = new Set<string>();
  function scheduleSave(checklistId: string) {
    dirtyRuns.add(`${selectedDate.value}\u0000${checklistId}`);
    persistLocal();
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(flushSave, SAVE_DEBOUNCE_MS);
  }
  async function flushSave() {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = undefined;
    }
    const pending = [...dirtyRuns];
    dirtyRuns.clear();
    try {
      await Promise.all(
        pending.map(async (key) => {
          const [businessDate, checklistId] = key.split("\u0000");
          const run = runsByDate[businessDate]?.[checklistId];
          if (!run) return;
          await saveChecklistRun(
            businessDate,
            checklistId,
            JSON.parse(JSON.stringify(run)),
          );
        }),
      );
    } catch (e) {
      pending.forEach((key) => dirtyRuns.add(key));
      console.error("Could not save checklists", e);
    }
  }

  /* ===== Realtime + rehydrate ===== */
  const unsubs: (() => void)[] = [];
  function onEvent() {
    if (saveTimer) return; // pending local save wins
    void loadAll().then(persistLocal);
  }
  async function startLive() {
    if (!import.meta.client) return;
    try {
      unsubs.push(
        await subscribe("checklist_runs", onEvent, "*"),
        await subscribe("checklist_results", onEvent, "*"),
        await subscribe("checklist_assignments", onEvent, "*"),
      );
      live.value = true;
    } catch {
      live.value = false;
    }
  }
  async function stopLive() {
    try {
      if (unsubs.length) unsubs.splice(0).forEach((unsub) => unsub());
      else {
        await Promise.all([
          unsubscribe("checklist_runs"),
          unsubscribe("checklist_results"),
          unsubscribe("checklist_assignments"),
        ]);
      }
    } catch {
      /* noop */
    }
    live.value = false;
  }
  async function resync() {
    if (isRefreshing.value) return;
    isRefreshing.value = true;
    try {
      await loadAll();
    } finally {
      isRefreshing.value = false;
    }
  }
  function onVisibility() {
    if (import.meta.client && !document.hidden) resync();
  }

  /* ===== Local cache ===== */
  function persistLocal() {
    if (import.meta.server) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: version.value,
        templates: templates.value,
        runsByDate,
      }),
    );
  }
  function loadLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      version.value = s.version ?? 2;
      templates.value = s.templates ?? [];
      Object.assign(runsByDate, s.runsByDate ?? {});
    } catch {
      /* Fail-safe cache reset */
    }
  }

  /* ===== Toast ===== */
  let toastTimer: ReturnType<typeof setTimeout> | undefined;
  function toast(msg: string) {
    toastMsg.value = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMsg.value = "";
    }, 1800);
  }

  /* ===== Day navigation ===== */
  function selectDay(date: string) {
    selectedDate.value = date;
  }
  function goToday() {
    selectedDate.value = todayISO();
  }
  function prevWeek() {
    selectedDate.value = addDaysISO(selectedDate.value, -1);
  }
  function nextWeek() {
    selectedDate.value = addDaysISO(selectedDate.value, 1);
  }

  /* ===== Item actions (write to the selected date's run) ===== */
  function toggleItem(checklistId: string, itemId: string) {
    const run = ensureRun(checklistId);
    const done = !run.results[itemId]?.done;
    run.results = {
      ...run.results,
      [itemId]: { done, at: Date.now(), by: currentUserName.value },
    };
    scheduleSave(checklistId);
  }
  function setValue(
    checklistId: string,
    itemId: string,
    raw: number | string | null | undefined,
  ) {
    const run = ensureRun(checklistId);
    const empty =
      raw === "" ||
      raw === null ||
      raw === undefined ||
      (typeof raw === "number" && Number.isNaN(raw));
    run.results = {
      ...run.results,
      [itemId]: empty
        ? { done: false, at: Date.now(), by: currentUserName.value }
        : {
            done: true,
            value: raw,
            at: Date.now(),
            by: currentUserName.value,
          },
    };
    scheduleSave(checklistId);
  }

  async function completeChecklist(id: string) {
    const run = ensureRun(id);
    run.completedAt = Date.now();
    run.status = "done";
    run.by = run.by || currentUserName.value;

    const t = templates.value.find((x) => x.id === id);
    const dayT = t ? templateForDay(t, selectedWeekday.value) : null;
    const wa = openBlankTab();

    scheduleSave(id);
    await flushSave(); // DB first

    if (dayT) sendToTab(wa, formatChecklist(buildChecklistMessage(dayT, run)));
    else wa?.close();

    toast("Checklist completada ✅");
  }

  async function reopenChecklist(id: string) {
    const run = runFor(id);
    if (!run) return;
    run.status = "in_progress";
    run.completedAt = undefined;

    const t = templates.value.find((x) => x.id === id);
    const wa = openBlankTab();

    scheduleSave(id);
    await flushSave();

    if (t) sendToTab(wa, formatChecklistReopen(t.title, run.by));
    else wa?.close();

    toast("Checklist reabierta");
  }

  async function setItemAssignee(item: ChecklistItem, assignedTo: string) {
    if (!isManager.value || !item.recordId) return;
    const effectiveAssignment = assignmentFor(item.recordId);
    const datedAssignment = assignments.value.find(
      (assignment) =>
        assignment.itemRecordId === item.recordId &&
        assignment.businessDate === selectedDate.value,
    );
    try {
      if (!assignedTo) {
        if (effectiveAssignment) {
          await deleteChecklistAssignment(effectiveAssignment.id);
          assignments.value = assignments.value.filter(
            (entry) => entry.id !== effectiveAssignment.id,
          );
        }
        toast("Tarea sin asignar");
        return;
      }
      const saved = await saveChecklistAssignment({
        itemRecordId: item.recordId,
        businessDate: selectedDate.value,
        assignedTo,
        assignedBy: currentUserId.value,
      });
      assignments.value = datedAssignment
        ? assignments.value.map((entry) =>
            entry.id === datedAssignment.id ? saved : entry,
          )
        : [...assignments.value, saved];
      toast(`Asignada a ${staffName(assignedTo)}`);
    } catch (error) {
      console.error("Could not assign checklist item", error);
      toast("No se pudo asignar la tarea");
    }
  }

  async function createTask(
    section: ChecklistSection,
    input: ChecklistTaskInput,
  ) {
    if (!isManager.value || !section.recordId) return false;
    try {
      await createChecklistTask(
        section.recordId,
        input,
        section.items.length + 1,
      );
      await loadAll();
      toast("Tarea creada");
      return true;
    } catch (error) {
      console.error("Could not create checklist task", error);
      toast("No se pudo crear la tarea");
      return false;
    }
  }

  async function updateTask(item: ChecklistItem, input: ChecklistTaskInput) {
    if (!isManager.value || !item.recordId) return false;
    try {
      await updateChecklistTask(item.recordId, input);
      await loadAll();
      toast("Tarea actualizada");
      return true;
    } catch (error) {
      console.error("Could not update checklist task", error);
      toast("No se pudo actualizar la tarea");
      return false;
    }
  }

  async function archiveTask(item: ChecklistItem) {
    if (!isManager.value || !item.recordId) return false;
    try {
      await archiveChecklistTask(item.recordId);
      await loadAll();
      toast("Tarea archivada");
      return true;
    } catch (error) {
      console.error("Could not archive checklist task", error);
      toast("No se pudo archivar la tarea");
      return false;
    }
  }

  let stopAuthListener: (() => void) | undefined;
  onMounted(async () => {
    syncAuth();
    stopAuthListener = pb.authStore.onChange(() => {
      syncAuth();
      void loadAll();
    });
    loadLocal();
    await loadAll();
    await startLive();
    document.addEventListener("visibilitychange", onVisibility);
  });
  onBeforeUnmount(() => {
    if (import.meta.client) {
      document.removeEventListener("visibilitychange", onVisibility);
    }
    stopAuthListener?.();
    if (saveTimer) flushSave();
    stopLive();
  });

  return {
    // state
    templates,
    assignments,
    assignableUsers,
    currentUserId,
    isManager,
    selectedDate,
    loading,
    isRefreshing,
    live,
    toastMsg,
    // week + day view
    weekStrip,
    selectedWeekday,
    isSelectedClosed,
    selectedPretty,
    isTodaySelected,
    activeTemplates,
    templatesEmpty,
    dayLists,
    dayTotal,
    completedCount,
    // evaluators
    progressFor,
    statusFor,
    resultFor,
    runFor,
    assignmentFor,
    staffName,
    // navigation
    selectDay,
    goToday,
    prevWeek,
    nextWeek,
    // item actions
    toggleItem,
    setValue,
    completeChecklist,
    reopenChecklist,
    setItemAssignee,
    createTask,
    updateTask,
    archiveTask,
    refreshNow: resync,
  };
}

export type ChecklistsStore = ReturnType<typeof createChecklistsStore>;

const CHECKLISTS_KEY: InjectionKey<ChecklistsStore> = Symbol("checklists");

/** Called ONCE, on the page. Creates the store and shares it with the views. */
export function provideChecklists() {
  const store = createChecklistsStore();
  provide(CHECKLISTS_KEY, store);
  return store;
}

/** Used by child views to read the same store. */
export function useChecklists() {
  const store = inject(CHECKLISTS_KEY);
  if (!store) {
    throw new Error(
      "useChecklists() debe usarse dentro de la página que llama a provideChecklists().",
    );
  }
  return store;
}
