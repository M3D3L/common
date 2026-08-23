import { ref } from "vue";

// ─── useExpiration ─────────────────────────────────────────────────────────────
// Encapsulates all expiration state and logic:
//   - preset selection (1w, 2w, 1m, …)
//   - custom DD/MM/AAAA input with live formatting
//   - validation

export function useExpiration() {
  const expirationPreset = ref<string>("");
  const expirationDate = ref<string>("");
  const expirationDateError = ref<string | null>(null);

  // ─── Date math ─────────────────────────────────────────────────────────────
  function addDays(n: number): Date {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d;
  }
  function addMonths(n: number): Date {
    const d = new Date();
    d.setMonth(d.getMonth() + n);
    return d;
  }
  function addYears(n: number): Date {
    const d = new Date();
    d.setFullYear(d.getFullYear() + n);
    return d;
  }
  function fmtDate(d: Date): string {
    return [
      String(d.getDate()).padStart(2, "0"),
      String(d.getMonth() + 1).padStart(2, "0"),
      d.getFullYear(),
    ].join("/");
  }

  const PRESET_MAP: Record<string, () => Date> = {
    "1w": () => addDays(7),
    "2w": () => addDays(14),
    "1m": () => addMonths(1),
    "3m": () => addMonths(3),
    "6m": () => addMonths(6),
    "1y": () => addYears(1),
  };

  // ─── Actions ───────────────────────────────────────────────────────────────
  function setPreset(value: string) {
    expirationPreset.value = value;
    expirationDate.value = "";
    expirationDateError.value = null;
    if (value in PRESET_MAP) {
      expirationDate.value = fmtDate(PRESET_MAP[value]());
    }
  }

  function clear() {
    expirationPreset.value = "";
    expirationDate.value = "";
    expirationDateError.value = null;
  }

  function formatInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, "").slice(0, 8);
    let formatted = digits;
    if (digits.length > 2)
      formatted = digits.slice(0, 2) + "/" + digits.slice(2);
    if (digits.length > 4)
      formatted = formatted.slice(0, 5) + "/" + formatted.slice(5);
    expirationDate.value = formatted;
    expirationDateError.value = null;
  }

  function validate(): boolean {
    const val = expirationDate.value.trim();
    if (!val) return true;

    const match = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) {
      expirationDateError.value = "Formato inválido. Usa DD/MM/AAAA.";
      return false;
    }

    const [, dd, mm, yyyy] = match;
    const date = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd)));
    if (
      isNaN(date.getTime()) ||
      date.getUTCDate() !== Number(dd) ||
      date.getUTCMonth() + 1 !== Number(mm)
    ) {
      expirationDateError.value = "Fecha inválida.";
      return false;
    }

    expirationDateError.value = null;
    return true;
  }

  function reset(storedValue?: string) {
    expirationDate.value = storedValue ?? "";
    expirationPreset.value = storedValue ? "custom" : "";
    expirationDateError.value = null;
  }

  return {
    expirationPreset,
    expirationDate,
    expirationDateError,
    setPreset,
    clear,
    formatInput,
    validate,
    reset,
  };
}
