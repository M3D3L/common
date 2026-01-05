import { resolveLocaleFromHost } from "~/utils/resolveLocale";

export default defineNuxtPlugin(() => {
  const event = useRequestEvent();
  const host =
    event?.node.req.headers["x-forwarded-host"] ??
    event?.node.req.headers.host ??
    "";

  const locale = resolveLocaleFromHost(host);

  // SSR-safe shared state
  useState("locale", () => locale);
});
