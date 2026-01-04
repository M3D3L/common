export default defineNuxtPlugin((nuxtApp) => {
  const { $i18n } = nuxtApp;
  let isSpanishDomain: boolean;

  if (process.server) {
    const req = useRequestEvent();
    const host =
      req?.node?.req?.headers["x-forwarded-host"] ||
      req?.node?.req?.headers?.host ||
      "";
    const hostname = host.split(":")[0];

    isSpanishDomain = hostname.includes("vivirensancarlos.com");

    // CRITICAL: Set the locale on the server immediately
    if (isSpanishDomain) {
      $i18n.setLocale("es");
    } else {
      $i18n.setLocale("en");
    }

    nuxtApp.payload.isSpanishDomain = isSpanishDomain;
  } else {
    isSpanishDomain = nuxtApp.payload.isSpanishDomain ?? false;
  }

  return {
    provide: { isSpanishDomain },
  };
});
