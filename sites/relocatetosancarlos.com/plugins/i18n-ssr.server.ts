export default defineNuxtPlugin((nuxtApp) => {
  const { $i18n } = nuxtApp;
  const headers = useRequestHeaders(["host", "x-forwarded-host"]);

  // Netlify specifically uses x-forwarded-host for the custom domain
  const host = headers["x-forwarded-host"] || headers["host"] || "";

  if (host.includes("vivirensancarlos.com")) {
    // This forces the server-side locale BEFORE the HTML is rendered
    $i18n.locale.value = "es";
  } else {
    $i18n.locale.value = "en";
  }
});
