export function useLatestMenuRecord<T>(collection = "menu") {
  const { fetchCollection } = usePocketBaseCore();
  const normalizedMenu = useNormalizedMenuOperations();

  const record = ref<T | null>(null);
  const pending = ref(true);
  const loadError = ref(false);

  async function load() {
    pending.value = true;
    loadError.value = false;
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
      loadError.value = true;
      record.value = null;
    } finally {
      pending.value = false;
    }
  }

  return {
    record,
    pending,
    loadError,
    load,
  };
}
