export function parseDisplayDateQuery(value: unknown): {
  date: string | null;
  error: string | null;
} {
  if (value === undefined) return { date: null, error: null };

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(`${value}T00:00:00Z`);
    if (
      Number.isFinite(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    ) {
      return { date: value, error: null };
    }
  }

  return {
    date: null,
    error: "Fecha inválida (YYYY-MM-DD). Mostrando el menú de hoy.",
  };
}
