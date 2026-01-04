export default defineNuxtRouteMiddleware((to) => {
  const { $i18n } = useNuxtApp();

  let host = "";
  if (process.server) {
    const event = useRequestEvent();
    // Check various headers depending on your hosting provider
    host =
      event?.node?.req?.headers["x-forwarded-host"] ||
      event?.node?.req?.headers?.host ||
      "";
  } else {
    host = window.location.host;
  }

  const isSpanish = host.includes("vivirensancarlos.com");
  const targetLocale = isSpanish ? "es" : "en";

  // Force i18n to the correct locale immediately
  if ($i18n.locale.value !== targetLocale) {
    $i18n.setLocale(targetLocale);
  }
});
