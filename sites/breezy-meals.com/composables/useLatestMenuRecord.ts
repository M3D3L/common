export function useLatestMenuRecord<T>(collection = "menu") {
  const { fetchCollection } = usePocketBaseCore();
  const normalizedMenu = useNormalizedMenuOperations();

  const record = ref<T | null>(null);
  const pending = ref(true);
  const loadError = ref(false);

  async function load(options: { silent?: boolean } = {}) {
    const silent = options.silent === true && record.value !== null;
    if (!silent) pending.value = true;
    if (!silent) loadError.value = false;
    try {
      const res = await fetchCollection(
        collection,
        1,
        1,
        "",
        "-created",
        null,
        null,
        true,
      );
      const legacy = (res.items[0] as unknown as T & { id: string }) ?? null;
      if (!legacy || collection !== "menu") {
        record.value = legacy;
        return;
      }
      try {
        record.value = (await normalizedMenu.loadMenu(legacy)) as T;
      } catch {
        record.value = legacy;
      }
    } catch {
      if (!silent) {
        loadError.value = true;
        record.value = null;
      }
    } finally {
      if (!silent) pending.value = false;
    }
  }

  return {
    record,
    pending,
    loadError,
    load,
  };
}
