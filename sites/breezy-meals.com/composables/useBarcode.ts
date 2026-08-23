export function ean13CheckDigit(base12: string): number {
  const d = base12.replace(/\D/g, "");
  if (d.length !== 12) throw new Error("EAN-13 base must be 12 digits");
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const n = d.charCodeAt(i) - 48;
    // pos 1,3,.. ×1 ; pos 2,4,.. ×3
    sum += i % 2 === 0 ? n : n * 3;
  }
  return (10 - (sum % 10)) % 10;
}

// Restricted-circulation EAN-13 (prefix 2). id must be numeric, ≤ 11 digits.
export function internalEan13(id: number | string): string {
  const numeric = String(id).replace(/\D/g, "");
  if (!numeric) throw new Error("internalEan13 needs a numeric id");
  if (numeric.length > 11)
    throw new Error("id too long for EAN-13 (max 11 digits)");
  const base12 = "2" + numeric.padStart(11, "0");
  // 13 digits, scanner-valid
  return base12 + ean13CheckDigit(base12);
}
