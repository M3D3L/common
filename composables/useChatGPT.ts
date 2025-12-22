export const useChatGPT = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const run = async (command: string, data: any) => {
    loading.value = true;
    error.value = null;

    try {
      // Ensure data is a string if it's an object
      const processedData =
        typeof data === "object" ? JSON.stringify(data) : data;

      const res = await $fetch<{ result: string }>(
        "https://chatgpt-proxy.guillermoantoniomedel.workers.dev",
        {
          method: "POST",
          body: { command, data: processedData },
        }
      );

      return res.result;
    } catch (err: any) {
      error.value = err?.data?.error || "Request failed";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { run, loading, error };
};
