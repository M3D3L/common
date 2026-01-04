export default defineNuxtPlugin(async (nuxtApp) => {
  const { $i18n, $setLocale } = nuxtApp;
  const headers = useRequestHeaders(["host", "x-forwarded-host"]);
  const host = headers["x-forwarded-host"] || headers["host"] || "";

  const isSpanish = host.includes("vivirensancarlos.com");
  const targetLocale = isSpanish ? "es" : "en";

  // If the server thinks it should be English, force it to Spanish
  if ($i18n.locale.value !== targetLocale) {
    await $setLocale(targetLocale);
  }
});
