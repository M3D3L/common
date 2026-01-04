// plugins/domain.js
export default defineNuxtPlugin((nuxtApp) => {
  const req = useRequestEvent();

  const host = process.client
    ? window.location.hostname
    : req?.node?.req?.headers["x-forwarded-host"] ||
      req?.node?.req?.headers?.host ||
      "";

  const isSpanishDomain =
    host === "vivirensancarlos.com" || host.endsWith(".vivirensancarlos.com");

  // Set a global variable BEFORE the plugin provides it
  // This allows synchronous access during module initialization
  if (process.server) {
    // Use process.env for server-side synchronous access
    process.env.NUXT_PUBLIC_IS_SPANISH_DOMAIN = isSpanishDomain
      ? "true"
      : "false";
  }

  if (process.client) {
    // Set on window for client-side synchronous access
    window.__NUXT_IS_SPANISH_DOMAIN = isSpanishDomain;
  }

  return {
    provide: {
      isSpanishDomain,
    },
  };
});
