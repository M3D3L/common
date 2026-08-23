// composables/useMemberships.ts
import type { Membership } from "~/types/membership";

/**
 * useMemberships — the monthly credit bucket.
 *
 * One active membership per (member, period). "Buying more" tops up the SAME
 * bucket (credits_total += n) rather than creating a second grant, so
 * getActiveMembership is always a single-row lookup. Grants are staff-issued
 * (there is no billing integration); creation is an explicit action.
 *
 * credits_used is a cache. The authoritative balance is derived from the
 * redemptions ledger (see useRedemptions.recalculate). Everything here that
 * touches balance at the counter reads with ignoreCache = true.
 */
export default function useMemberships() {
  const { fetchCollection, fetchRecord, createItem, updateItem } =
    usePocketBaseCore();
  const C = "memberships";

  // --- Period helpers -------------------------------------------------------

  /** Current month as "2026-08". */
  const currentPeriod = (d = new Date()) =>
    `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;

  /** Last instant of the given period's month (hard expiry point). */
  const endOfPeriodISO = (period = currentPeriod()): string => {
    const [y, m] = period.split("-").map(Number);
    // day 0 of the *next* month = last day of this month
    return new Date(Date.UTC(y, m, 0, 23, 59, 59, 999)).toISOString();
  };

  // --- Pure balance / validity helpers -------------------------------------

  const remaining = (m: Membership) =>
    Math.max(0, m.credits_total - m.credits_used);

  const isExpired = (m: Membership) => new Date(m.expires_date) < new Date();

  /** Usable right now: active, has credits, not past expiry. */
  const isUsable = (m: Membership) =>
    m.status === "active" && remaining(m) > 0 && !isExpired(m);

  // --- Lookups --------------------------------------------------------------

  /**
   * The member's bucket for the current period, if any. ignoreCache: balance
   * decisions must never be stale. Returns null if they have no grant this
   * month (lapsed / never issued) — identity persists, entitlement doesn't.
   */
  const getActiveMembership = async (
    memberId: string,
    period = currentPeriod(),
  ): Promise<Membership | null> => {
    const filter = `member = "${memberId}" && period = "${period}" && status != "cancelled"`;
    const r = await fetchCollection(
      C,
      1,
      1,
      filter,
      "-created",
      null,
      null,
      true,
    );
    return (r.items[0] as Membership) ?? null;
  };

  const getMembership = (id: string) =>
    fetchRecord(C, id) as Promise<Membership>;

  /** Full grant history for a member, newest first (for the admin view). */
  const listForMember = (memberId: string, page = 1) =>
    fetchCollection(C, page, 24, `member = "${memberId}"`, "-period");

  // --- Mutations ------------------------------------------------------------

  /**
   * Issue a fresh grant for a member for the given period. If one already
   * exists for that period, this TOPS IT UP instead of creating a duplicate,
   * preserving the one-bucket-per-month invariant. Returns the membership.
   */
  const issueMembership = async (
    memberId: string,
    opts: {
      credits?: number;
      period?: string;
      issuedBy?: string;
    } = {},
  ): Promise<Membership> => {
    const period = opts.period ?? currentPeriod();
    const credits = opts.credits ?? 5;

    const existing = await getActiveMembership(memberId, period);
    if (existing) {
      // Top-up path: same bucket grows.
      return updateItem(C, existing.id, {
        credits_total: existing.credits_total + credits,
        status: "active",
      }) as Promise<Membership>;
    }

    return createItem(C, {
      member: memberId,
      period,
      credits_total: credits,
      credits_used: 0,
      issued_date: new Date().toISOString(),
      expires_date: endOfPeriodISO(period),
      status: "active",
      issued_by: opts.issuedBy ?? "",
    }) as Promise<Membership>;
  };

  /** Explicit top-up (thin wrapper over issue's top-up path, for clarity). */
  const topUp = (memberId: string, credits: number, issuedBy?: string) =>
    issueMembership(memberId, { credits, issuedBy });

  /** Cancel a grant (rare; e.g. issued to the wrong member). Not a delete. */
  const cancelMembership = (id: string) =>
    updateItem(C, id, { status: "cancelled" }) as Promise<Membership>;

  return {
    currentPeriod,
    endOfPeriodISO,
    remaining,
    isExpired,
    isUsable,
    getActiveMembership,
    getMembership,
    listForMember,
    issueMembership,
    topUp,
    cancelMembership,
  };
}
