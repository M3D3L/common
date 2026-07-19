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
  type ChecklistsData,
  type ChecklistsRecord,
  type ChecklistRun,
  type ItemResult,
  type RunStatus,
  type RunsByDate,
} from "~/utils/checklists";
import type { RecordModel } from "pocketbase";

/* ===== Config ===== */
const STORAGE_KEY = "checklists";

// A SINGLE record stores EVERYTHING in `data`:
//   { version, lists:[...], runs: { [date]: { [checklistId]: run } } }
const COLLECTION = "checklists";
const FIELD = "data"; // ⚠️ JSON field name

// Rapid ticks are batched before writing to the DB.
const SAVE_DEBOUNCE_MS = 600;

/**
 * Single source of truth for Checklists.
 *  - Tasks are scheduled per weekday; the active view is one selectable date.
 *  - `runs` (ticks/results) are nested by date and double as history.
 *  - Kept LIVE via record realtime; rehydrates on refresh.
 */
function createChecklistsStore() {
  const {
    fetchCollection,
    createItem,
    updateItem,
    subscribe,
    unsubscribe,
    user,
  } = usePocketBaseCore();

  const me: string =
    (user as any)?.name || (user as any)?.email || (user as any)?.id || "";

  const { formatChecklist, formatChecklistReopen, waLink } = useWhatsappOrder();

  /* ===== State ===== */
  const recordId = ref<string | null>(null);
  const version = ref(2);
  const templates = ref<ChecklistTemplate[]>([]);
  // runsByDate[date][checklistId] = run (kept in full so we never drop history).
  const runsByDate = reactive<RunsByDate>({});
  // The date currently being viewed/edited (defaults to today).
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
      by: me,
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

  // Templates that have tasks for the selected day, filtered down to that day.
  const dayLists = computed(() =>
    activeTemplates.value
      .filter((t) => listOnDay(t, selectedWeekday.value))
      .map((t) => templateForDay(t, selectedWeekday.value)),
  );

  const dayTotal = computed(() => dayLists.value.length);
  const completedCount = computed(
    () => dayLists.value.filter((t) => statusFor(t.id) === "done").length,
  );

  /* ===== Stateful evaluators (all against the selected date) ===== */
  const progressFor = (id: string) => {
    const t = templates.value.find((x) => x.id === id);
    return t
      ? progress(templateForDay(t, selectedWeekday.value), runFor(id))
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

  /* ===== Assemble / apply the `data` object ===== */
  function buildData(): ChecklistsData {
    return {
      version: version.value,
      lists: templates.value,
      runs: JSON.parse(JSON.stringify(runsByDate)),
    };
  }
  function applyData(rec: ChecklistsRecord) {
    recordId.value = rec.id;
    const data = ((rec as any)[FIELD] as ChecklistsData) ?? {
      version: 2,
      lists: [],
    };
    version.value = data.version ?? 2;
    templates.value = (data.lists ?? [])
      .slice()
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    Object.keys(runsByDate).forEach((k) => delete runsByDate[k]);
    Object.assign(runsByDate, data.runs ?? {});
  }

  /* ===== Load ===== */
  async function loadAll() {
    loading.value = true;
    try {
      const res = await fetchCollection(
        COLLECTION,
        1,
        1,
        "",
        "-created",
        null,
        null,
        true,
      );
      const rec = res.items[0] as unknown as ChecklistsRecord | undefined;
      if (rec) applyData(rec);
      else {
        recordId.value = null;
        templates.value = [];
      }
    } catch {
      // Offline: keep the local cache.
    } finally {
      loading.value = false;
    }
  }

  /* ===== Save (optimistic + debounce; writes the WHOLE record) ===== */
  let saveTimer: ReturnType<typeof setTimeout> | undefined;
  function scheduleSave() {
    persistLocal();
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(flushSave, SAVE_DEBOUNCE_MS);
  }
  async function flushSave() {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = undefined;
    }
    const data = buildData();
    try {
      if (recordId.value) {
        await updateItem(COLLECTION, recordId.value, { [FIELD]: data });
      } else {
        const rec = await createItem(COLLECTION, { [FIELD]: data });
        recordId.value = rec.id;
      }
    } catch (e) {
      console.error("Could not save checklists", e);
    }
  }

  /* ===== Realtime + rehydrate ===== */
  let unsub: (() => void) | null = null;
  function onEvent(e: { action: string; record: RecordModel }) {
    if (e.action === "delete") return;
    if (saveTimer) return; // pending local save wins
    applyData(e.record as unknown as ChecklistsRecord);
    persistLocal();
  }
  async function startLive() {
    if (!import.meta.client) return;
    try {
      unsub = await subscribe(COLLECTION, onEvent, "*");
      live.value = true;
    } catch {
      live.value = false;
    }
  }
  async function stopLive() {
    try {
      if (unsub) unsub();
      else await unsubscribe(COLLECTION);
    } catch {
      /* noop */
    }
    unsub = null;
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
        recordId: recordId.value,
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
      recordId.value = s.recordId ?? null;
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
    selectedDate.value = addDaysISO(selectedDate.value, -7);
  }
  function nextWeek() {
    selectedDate.value = addDaysISO(selectedDate.value, 7);
  }

  /* ===== Item actions (write to the selected date's run) ===== */
  function toggleItem(checklistId: string, itemId: string) {
    const run = ensureRun(checklistId);
    const done = !run.results[itemId]?.done;
    run.results = {
      ...run.results,
      [itemId]: { done, at: Date.now(), by: me },
    };
    scheduleSave();
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
        ? { done: false, at: Date.now(), by: me }
        : { done: true, value: raw, at: Date.now(), by: me },
    };
    scheduleSave();
  }

  async function completeChecklist(id: string) {
    const run = ensureRun(id);
    run.completedAt = Date.now();
    run.status = "done";
    run.by = run.by || me;

    const t = templates.value.find((x) => x.id === id);
    const dayT = t ? templateForDay(t, selectedWeekday.value) : null;
    const wa = openBlankTab();

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

    await flushSave();

    if (t) sendToTab(wa, formatChecklistReopen(t.title, run.by));
    else wa?.close();

    toast("Checklist reabierta");
  }

  onMounted(async () => {
    loadLocal();
    await loadAll();
    await startLive();
    document.addEventListener("visibilitychange", onVisibility);
  });
  onBeforeUnmount(() => {
    if (import.meta.client) {
      document.removeEventListener("visibilitychange", onVisibility);
    }
    if (saveTimer) flushSave();
    stopLive();
  });

  return {
    // state
    templates,
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
