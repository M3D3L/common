export default defineNuxtPlugin((nuxtApp) => {
  const isSpanishDomain = ref(false);

  // 1. Host Detection
  let host = "";
  if (process.server) {
    const headers = useRequestHeaders(["host", "x-forwarded-host"]);
    host = headers["x-forwarded-host"] || headers["host"] || "";
  } else {
    host = window.location.host;
  }

  // 2. Set the reactive value
  isSpanishDomain.value = host.includes("vivirensancarlos.com");

  return {
    provide: {
      isSpanishDomain, // Accessible as {{ $isSpanishDomain }} in templates
    },
  };
});
