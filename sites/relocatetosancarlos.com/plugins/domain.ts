export default defineNuxtPlugin((nuxtApp) => {
  let isSpanishDomain: boolean;

  if (process.server) {
    const req = useRequestEvent();

    // Log ALL headers to see what we're getting
    console.log("SERVER - All headers:", req?.node?.req?.headers);

    const host =
      req?.node?.req?.headers["x-forwarded-host"] ||
      req?.node?.req?.headers?.host ||
      "";

    const hostname = host.split(":")[0];

    isSpanishDomain =
      hostname === "vivirensancarlos.com" ||
      hostname === "www.vivirensancarlos.com" ||
      hostname.endsWith(".vivirensancarlos.com");

    console.log("SERVER - hostname:", hostname, "isSpanish:", isSpanishDomain);
    nuxtApp.payload.isSpanishDomain = isSpanishDomain;
  } else {
    isSpanishDomain = nuxtApp.payload.isSpanishDomain ?? false;
    console.log("CLIENT - using value:", isSpanishDomain);
  }

  return {
    provide: {
      isSpanishDomain,
    },
  };
});
