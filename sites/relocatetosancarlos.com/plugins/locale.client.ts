import { resolveLocaleFromHost } from "~/utils/resolveLocale";

export default defineNuxtPlugin(() => {
  const locale = useState<"es" | "en">("locale");

  if (!locale.value) {
    locale.value = resolveLocaleFromHost(window.location.host);
  }
});
