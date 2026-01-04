export default defineNuxtPlugin((nuxtApp) => {
  const { $i18n } = nuxtApp;

  // Get host from server headers or client window
  const headers = useRequestHeaders(["host", "x-forwarded-host"]);
  const host = process.server
    ? headers["x-forwarded-host"] || headers["host"] || ""
    : window.location.host;

  const isSpanish = host.includes("vivirensancarlos.com");
  const targetLocale = isSpanish ? "es" : "en";

  // 1. Set the i18n instance locale immediately
  $i18n.locale.value = targetLocale;

  // 2. Provide the helper for your components
  const isSpanishDomain = ref(isSpanish);

  return {
    provide: {
      isSpanishDomain,
    },
  };
});
