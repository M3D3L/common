export default defineNuxtRouteMiddleware((to) => {
  const { $i18n } = useNuxtApp();
  let host = "";

  if (process.server) {
    const event = useRequestEvent();
    // Netlify specific priority: x-forwarded-host
    host =
      event?.node?.req?.headers["x-forwarded-host"] ||
      event?.node?.req?.headers?.host ||
      "";

    // Log this during development/build to see what Netlify is actually sending
    console.log("SSR Host Detection:", host);
  } else {
    host = window.location.host;
  }

  // Clean the host (remove ports if they exist)
  const hostname = host.split(":")[0];

  const isSpanish = hostname.includes("vivirensancarlos.com");
  const targetLocale = isSpanish ? "es" : "en";

  // Sync the i18n locale
  if ($i18n.locale.value !== targetLocale) {
    $i18n.setLocale(targetLocale);
  }
});
