export default defineNuxtPlugin((nuxtApp) => {
  const { $i18n } = nuxtApp;

  // 1. Initialize variables
  let host = "";
  let isSpanish = false;

  // 2. Environment-specific Detection
  if (process.server) {
    const headers = useRequestHeaders(["host", "x-forwarded-host"]);
    host = headers["x-forwarded-host"] || headers["host"] || "";
  } else {
    host = window.location.host;
  }

  // 3. Logic: Only run if we actually have a host (skips during prerender crash)
  if (host) {
    isSpanish = host.includes("vivirensancarlos.com");
    const targetLocale = isSpanish ? "es" : "en";

    // Update locale if it's different
    if ($i18n && $i18n.locale.value !== targetLocale) {
      $i18n.locale.value = targetLocale;
    }
  }

  // 4. Always return the helper so components don't break
  return {
    provide: {
      isSpanishDomain: isSpanish,
    },
  };
});
