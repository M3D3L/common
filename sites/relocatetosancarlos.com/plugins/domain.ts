export default defineNuxtPlugin((nuxtApp) => {
  let isSpanishDomain: boolean;

  if (process.server) {
    // Server-side: detect from headers
    const req = useRequestEvent();
    const host =
      req?.node?.req?.headers["x-forwarded-host"] ||
      req?.node?.req?.headers?.host ||
      "";

    const hostname = host.split(":")[0];

    isSpanishDomain =
      hostname === "vivirensancarlos.com" ||
      hostname === "www.vivirensancarlos.com" ||
      hostname.endsWith(".vivirensancarlos.com");
    // Store in payload for client hydration
    nuxtApp.payload.isSpanishDomain = isSpanishDomain;

    console.log("SERVER - after setting:", nuxtApp.payload.isSpanishDomain);
  } else {
    // MUST use the value from server payload for hydration
    isSpanishDomain = nuxtApp.payload.isSpanishDomain ?? false;
  }

  return {
    provide: {
      isSpanishDomain,
    },
  };
});
