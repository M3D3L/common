export default defineNuxtPlugin(() => {
  const req = useRequestEvent();

  // Detect host safely
  const host = process.client
    ? window.location.hostname
    : req?.node?.req?.headers["x-forwarded-host"] ||
      req?.node?.req?.headers?.host ||
      "";

  const isSpanishDomain =
    host === "vivirensancarlos.com" || host.endsWith(".vivirensancarlos.com");

  return {
    provide: {
      // This is accessed via $isSpanishDomain
      isSpanishDomain,
    },
  };
});
