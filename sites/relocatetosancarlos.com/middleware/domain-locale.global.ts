export default defineNuxtRouteMiddleware((to) => {
  const { $i18n } = useNuxtApp();

  // 1. Get host
  let host = "";
  if (process.server) {
    const event = useRequestEvent();
    host = event?.node?.req?.headers?.host || "";
  } else {
    host = window.location.host;
  }

  // 2. Determine if it's Spanish domain
  const isSpanish = host.includes("vivirensancarlos.com");

  // 3. Force the i18n instance to match the domain
  const targetLocale = isSpanish ? "es" : "en";

  if ($i18n.locale.value !== targetLocale) {
    $i18n.setLocale(targetLocale);
  }
});
