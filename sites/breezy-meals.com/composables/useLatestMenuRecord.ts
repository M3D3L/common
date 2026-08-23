export function useLatestMenuRecord<T>(collection = "menu") {
  const { fetchCollection } = usePocketBaseCore();

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
      record.value = (res.items[0] as unknown as T) ?? null;
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
