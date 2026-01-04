export default defineNuxtPlugin((nuxtApp) => {
  const { $i18n } = nuxtApp;

  // 1. Detect Host (Server headers vs Client window)
  const headers = useRequestHeaders(["host", "x-forwarded-host"]);
  const host = process.server
    ? headers["x-forwarded-host"] || headers["host"] || ""
    : window.location.host;

  // 2. Determine target language
  const isSpanish = host.includes("vivirensancarlos.com");
  const targetLocale = isSpanish ? "es" : "en";

  // 3. Force the locale immediately
  // This updates the i18n instance before the page renders
  $i18n.locale.value = targetLocale;

  // 4. Provide the helper for your templates
  return {
    provide: {
      isSpanishDomain: isSpanish,
    },
  };
});
