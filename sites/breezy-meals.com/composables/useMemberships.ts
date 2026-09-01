// composables/useMemberships.ts
import type { Membership } from "~/types/membership";

/**
 * useMemberships — the member's persistent credit bucket.
 *
 * "Buying more" tops up the latest bucket (credits_total += n) rather than
 * creating a monthly grant. Existing monthly buckets remain valid, so unused
 * credits carry forward indefinitely.
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

  // --- Pure balance / validity helpers -------------------------------------

  const remaining = (m: Membership) =>
    Math.max(0, m.credits_total - m.credits_used);

  /** Usable right now: not cancelled and has credits. */
  const isUsable = (m: Membership) =>
    m.status !== "cancelled" && remaining(m) > 0;

  // --- Lookups --------------------------------------------------------------

  /**
   * The member's latest non-cancelled bucket, if any. Old monthly buckets are
   * intentionally eligible so their unused credits carry forward.
   */
  const getActiveMembership = async (
    memberId: string,
  ): Promise<Membership | null> => {
    const filter = `member = "${memberId}" && status != "cancelled"`;
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
   * Issue credits to a member. If a bucket already exists, top it up instead
   * of creating another one so its remaining balance carries forward.
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

    const existing = await getActiveMembership(memberId);
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
      // Kept for compatibility with the existing PocketBase date field.
      expires_date: "9999-12-31T23:59:59.999Z",
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
    remaining,
    isUsable,
    getActiveMembership,
    getMembership,
    listForMember,
    issueMembership,
    topUp,
    cancelMembership,
  };
}
