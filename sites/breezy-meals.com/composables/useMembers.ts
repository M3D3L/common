// composables/useMembers.ts
import type { Member } from "~/types/membership";

/**
 * useMembers — everything about the person on file.
 *
 * Identity only: this composable never touches credits or the ledger.
 * The PIN (member_code, e.g. "GM1234") is generated here at creation,
 * is unique, and is treated as immutable — updateMember structurally
 * refuses to change it so a future edit form can't strip someone's code.
 */
export default function useMembers() {
  const { fetchCollection, fetchRecord, createItem, updateItem } =
    usePocketBaseCore();
  const C = "members";

  // --- PIN generation -------------------------------------------------------

  /** First letters of the first two name words, A–Z only, padded to 2. */
  const deriveInitials = (name: string): string => {
    const letters = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // strip accents so José -> J
      .toUpperCase()
      .split(/\s+/)
      .map((w) => w.replace(/[^A-Z]/g, "")[0])
      .filter(Boolean);
    const two = ((letters[0] ?? "X") + (letters[1] ?? "X")).slice(0, 2);
    return two;
  };

  /** 4 digits, no leading zero, so the code reads cleanly (1000–9999). */
  const randomFourDigits = () =>
    String(Math.floor(1000 + Math.random() * 9000));

  /** Is this exact code already taken? (ignoreCache: must be fresh.) */
  const codeExists = async (code: string): Promise<boolean> => {
    const r = await fetchCollection(
      C,
      1,
      1,
      `member_code = "${code}"`,
      "",
      null,
      null,
      true,
    );
    return r.totalItems > 0;
  };

  /**
   * Generate a unique GM1234-style code. Initials are cosmetic (staff
   * readability); the 4 digits carry the uniqueness. Retries on collision.
   */
  const generateCode = async (name: string): Promise<string> => {
    const initials = deriveInitials(name);
    for (let i = 0; i < 25; i++) {
      const code = `${initials}${randomFourDigits()}`;
      if (!(await codeExists(code))) return code;
    }
    // Astronomically unlikely with a healthy code space; fail loud, don't loop.
    throw new Error(
      "Could not generate a unique member code — check code space",
    );
  };

  // --- Search & lookup ------------------------------------------------------

  /** Basic filter-value escaping. Prefer pb.filter() if you expose it in core. */
  const esc = (s: string) => s.replace(/["\\]/g, "");

  /**
   * Staff search: matches name, phone, or exact PIN. Excludes archived by
   * default so the working list stays clean; pass includeArchived to widen.
   */
  const searchMembers = (term: string, page = 1, includeArchived = false) => {
    const t = esc(term.trim());
    const code = t.toUpperCase();
    const base = `(name ~ "${t}" || phone ~ "${t}" || member_code = "${code}")`;
    const filter = includeArchived ? base : `status != "archived" && ${base}`;
    return fetchCollection(C, page, 10, filter, "name");
  };

  /** Lists all non-archived members for staff-facing member pickers. */
  const listMembers = (page = 1, perPage = 100) =>
    fetchCollection(C, page, perPage, 'status != "archived"', "name");

  /** Exact-PIN lookup (staff-side; the public route is separate). */
  const getMemberByCode = async (code: string): Promise<Member | null> => {
    const r = await fetchCollection(
      C,
      1,
      1,
      `member_code = "${esc(code).toUpperCase()}"`,
      "",
      null,
      null,
      true,
    );
    return (r.items[0] as Member) ?? null;
  };

  const getMember = (id: string) => fetchRecord(C, id) as Promise<Member>;

  /** Inactivity sweep: active members whose last activity predates `before`. */
  const listInactive = (before: Date, page = 1) => {
    const iso = before.toISOString();
    const filter = `status = "active" && (last_active_at = "" || last_active_at < "${iso}")`;
    return fetchCollection(C, page, 50, filter, "last_active_at");
  };

  // --- Mutations ------------------------------------------------------------

  /**
   * Create a member with an auto-generated PIN. Name + phone required;
   * address optional. Does NOT issue a grant — useMemberships owns that so
   * the two concerns stay separate. The check-in/add flow calls both.
   */
  const createMember = async (data: {
    name: string;
    phone: string;
    address?: string;
    notes?: string;
  }): Promise<Member> => {
    if (!data.name?.trim()) throw new Error("Name is required");
    if (!data.phone?.trim()) throw new Error("Phone is required");
    const member_code = await generateCode(data.name);
    return createItem(C, {
      name: data.name.trim(),
      phone: data.phone.trim(),
      address: data.address?.trim() ?? "",
      notes: data.notes?.trim() ?? "",
      member_code,
      status: "active",
      total_orders: 0,
      last_active_at: null,
      joined_date: new Date().toISOString(),
    }) as Promise<Member>;
  };

  /**
   * Edit an existing member. member_code, caches, and joined_date are
   * stripped so this path can NEVER change a PIN or corrupt a counter,
   * no matter what a form hands it.
   */
  const updateMember = (
    id: string,
    data: Partial<
      Pick<Member, "name" | "phone" | "address" | "notes" | "status">
    >,
  ) => {
    // Allow-list only editable fields. This makes it structurally impossible
    // for member_code, the caches, or joined_date to be changed here — we
    // simply never copy them across, so a form can't sneak them in.
    const safe: Record<string, any> = {};
    for (const key of [
      "name",
      "phone",
      "address",
      "notes",
      "status",
    ] as const) {
      if (key in data && (data as any)[key] !== undefined) {
        safe[key] = (data as any)[key];
      }
    }
    return updateItem(C, id, safe) as Promise<Member>;
  };

  /** Soft-delete: archive (or mark dormant) instead of deleting. */
  const archiveMember = (id: string) =>
    updateItem(C, id, { status: "archived" }) as Promise<Member>;
  const setDormant = (id: string) =>
    updateItem(C, id, { status: "dormant" }) as Promise<Member>;
  const reactivate = (id: string) =>
    updateItem(C, id, { status: "active" }) as Promise<Member>;

  return {
    deriveInitials,
    generateCode,
    searchMembers,
    listMembers,
    getMemberByCode,
    getMember,
    listInactive,
    createMember,
    updateMember,
    archiveMember,
    setDormant,
    reactivate,
  };
}
