export function resolveLocaleFromHost(host = ""): "es" | "en" {
  const h = host.toLowerCase();

  if (h.includes("vivirensancarlos.com") || h.includes("viviren")) {
    return "es";
  }

  return "en";
}
