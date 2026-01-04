export default defineNuxtRouteMiddleware(() => {
  const { $i18n } = useNuxtApp();
  const headers = useRequestHeaders(["host", "x-forwarded-host"]);

  const host = process.server
    ? headers["x-forwarded-host"] || headers["host"] || ""
    : window.location.host;

  const isSpanish = host.includes("vivirensancarlos.com");
  const targetLocale = isSpanish ? "es" : "en";

  // Force the locale immediately
  if ($i18n.locale.value !== targetLocale) {
    $i18n.setLocale(targetLocale);
  }
});
