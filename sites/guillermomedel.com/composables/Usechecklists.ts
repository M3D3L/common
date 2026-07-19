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
import { todayISO } from "~/utils/comandas";
import {
  progress,
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

// UN solo registro guarda TODO: plantillas + completadas, en el campo `data`.
//   data = { version, lists:[...], runs: { [bizDate]: { [checklistId]: run } } }
const COLLECTION = "checklists";
const FIELD = "data"; // ⚠️ nombre del campo JSON

// Los ticks rápidos se agrupan antes de escribir a la BD.
const SAVE_DEBOUNCE_MS = 600;

/**
 * Fuente única de verdad de Checklists, ahora en UN solo registro.
 *  - `lists` -> plantillas.
 *  - `runs`  -> ticks/resultados, anidados por día operativo (bizDate). Sirve
 *    como historial y se "resetea" solo (cada día es una llave distinta).
 *  - EN VIVO con realtime del registro; se rehidrata al refrescar.
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

  /* ===== Estado ===== */
  const view = ref<"index" | "run" | "history">("index");
  const recordId = ref<string | null>(null);
  const version = ref(1);
  const templates = ref<ChecklistTemplate[]>([]);
  // runsByDate[bizDate][checklistId] = run  (se conserva completo para no
  // perder historial de otros días al reescribir el registro).
  const runsByDate = reactive<RunsByDate>({});
  const activeId = ref<string | null>(null);

  const loading = ref(true);
  const isRefreshing = ref(false);
  const live = ref(false);
  const toastMsg = ref("");

  /* ===== Acceso a los runs de HOY ===== */
  function today(): Record<string, ChecklistRun> {
    const d = todayISO();
    if (!runsByDate[d]) runsByDate[d] = {};
    return runsByDate[d];
  }
  const runFor = (id: string): ChecklistRun | undefined =>
    runsByDate[todayISO()]?.[id];
  const runs = computed(() => runsByDate[todayISO()] ?? {});

  /* ===== Computed ===== */
  const prettyDate = computed(() => {
    const d = new Date().toLocaleDateString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    return d.charAt(0).toUpperCase() + d.slice(1);
  });

  const activeTemplates = computed(() =>
    templates.value.filter((t) => t.active !== false),
  );
  const templatesEmpty = computed(() => templates.value.length === 0);

  const current = computed<ChecklistTemplate | null>(() =>
    activeId.value
      ? (templates.value.find((t) => t.id === activeId.value) ?? null)
      : null,
  );
  const currentRun = computed<ChecklistRun | null>(() =>
    activeId.value ? (runFor(activeId.value) ?? null) : null,
  );
  const canComplete = computed(() =>
    current.value
      ? progress(current.value, currentRun.value ?? undefined).requiredMet
      : false,
  );
  const completedCount = computed(
    () =>
      activeTemplates.value.filter((t) => statusFor(t.id) === "done").length,
  );

  /* ===== Evaluadores con estado ===== */
  const progressFor = (id: string) => {
    const t = templates.value.find((x) => x.id === id);
    return t
      ? progress(t, runFor(id))
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

  /* ===== Runs ===== */
  function blankRun(checklistId: string): ChecklistRun {
    return {
      checklistId,
      bizDate: todayISO(),
      startedAt: Date.now(),
      by: me,
      status: "in_progress",
      results: {},
    };
  }
  function ensureRun(id: string): ChecklistRun {
    const map = today();
    if (!map[id]) map[id] = blankRun(id);
    return map[id];
  }

  /* ===== Ensamblar / aplicar el objeto `data` ===== */
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
      version: 1,
      lists: [],
    };
    version.value = data.version ?? 1;
    templates.value = (data.lists ?? [])
      .slice()
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    // Reemplaza runsByDate con lo del servidor (incluye todos los días).
    Object.keys(runsByDate).forEach((k) => delete runsByDate[k]);
    Object.assign(runsByDate, data.runs ?? {});
  }

  /* ===== Cargar ===== */
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
      // Offline: se conserva el cache local.
    } finally {
      loading.value = false;
    }
  }

  /* ===== Guardar (optimista + debounce; escribe TODO el registro) ===== */
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
      console.error("No se pudo guardar checklists", e);
      // Queda en cache local; se reintenta al próximo cambio o en resync.
    }
  }

  /* ===== Realtime + rehidratar al refrescar ===== */
  let unsub: (() => void) | null = null;

  function onEvent(e: { action: string; record: RecordModel }) {
    if (e.action === "delete") return;
    // Si hay un guardado local pendiente, nuestro flush debe ganar.
    if (saveTimer) return;
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

  /* ===== Cache local ===== */
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
      version.value = s.version ?? 1;
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

  /* ===== Acciones ===== */
  function open(id: string) {
    activeId.value = id;
    view.value = "run";
  }
  function back() {
    view.value = "index";
    activeId.value = null;
  }

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
    await flushSave();
    toast("Checklist completada ✅");
    if (view.value === "run") back();
  }

  async function reopenChecklist(id: string) {
    const run = runFor(id);
    if (!run) return;
    run.status = "in_progress";
    run.completedAt = undefined;
    await flushSave();
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
    // estado
    view,
    templates,
    runs,
    activeId,
    loading,
    isRefreshing,
    live,
    toastMsg,
    // computed
    prettyDate,
    activeTemplates,
    templatesEmpty,
    current,
    currentRun,
    canComplete,
    completedCount,
    // evaluadores
    progressFor,
    statusFor,
    resultFor,
    runFor,
    // acciones
    open,
    back,
    toggleItem,
    setValue,
    completeChecklist,
    reopenChecklist,
    refreshNow: resync,
  };
}

export type ChecklistsStore = ReturnType<typeof createChecklistsStore>;

const CHECKLISTS_KEY: InjectionKey<ChecklistsStore> = Symbol("checklists");

/** Se llama UNA vez, en la página. Crea el store y lo comparte con las vistas. */
export function provideChecklists() {
  const store = createChecklistsStore();
  provide(CHECKLISTS_KEY, store);
  return store;
}

/** Lo usan las vistas hijas para leer el mismo store. */
export function useChecklists() {
  const store = inject(CHECKLISTS_KEY);
  if (!store) {
    throw new Error(
      "useChecklists() debe usarse dentro de la página que llama a provideChecklists().",
    );
  }
  return store;
}
