export default defineNuxtPlugin((nuxtApp) => {
  const isSpanishDomain = ref(false);

  // Use headers on server, window on client
  const host = process.server
    ? useRequestHeaders(["x-forwarded-host"])["x-forwarded-host"] ||
      useRequestHeaders(["host"])["host"] ||
      ""
    : window.location.host;

  isSpanishDomain.value = host.includes("vivirensancarlos.com");

  return {
    provide: {
      isSpanishDomain,
    },
  };
});
