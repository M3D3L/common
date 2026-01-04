export default defineNuxtPlugin((nuxtApp) => {
  const { $i18n } = nuxtApp;

  // 1. Safety Check: Are we building/prerendering?
  const isPrerendering = process.server && !!useNitroApp?.() === false;
  // If we are prerendering, we just default to English and skip logic
  if (isPrerendering) return;

  // 2. Detect Host
  const headers = useRequestHeaders(["host", "x-forwarded-host"]);
  const host = process.server
    ? headers["x-forwarded-host"] || headers["host"] || ""
    : window.location.host;

  // 3. Determine target language (Shared logic for both domains)
  // Spanish domain = Spanish, English domain (or anything else) = English
  const isSpanish = host.includes("vivirensancarlos.com");
  const targetLocale = isSpanish ? "es" : "en";

  // 4. Force the locale immediately
  if ($i18n) {
    $i18n.locale.value = targetLocale;
  }

  return {
    provide: {
      isSpanishDomain: isSpanish,
    },
  };
});
