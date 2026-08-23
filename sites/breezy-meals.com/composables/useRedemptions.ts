// composables/useRedemptions.ts
import type { Membership, Redemption } from "~/types/membership";

/**
 * useRedemptions — the append-only ledger and the ONLY place credits move.
 *
 * Every balance-affecting event is a row:
 *   - "meal":       staff served a plate. amount = 1. Bumps credits_used,
 *                   and (via updateMemberActivity) the member's activity cache.
 *   - "adjustment": a gift (+n) or a refund/claw-back (-n), with a reason.
 *                   This is how credits_total is corrected — never by typing a
 *                   new number directly, so the *why* is always preserved.
 *   - "topup_note": a zero-amount marker recording that a second payment
 *                   topped up the bucket (the actual credit change happens in
 *                   useMemberships.topUp; this just leaves a trace).
 *
 * credits_used on the membership is a cache kept in step here for instant
 * display; the ledger is authoritative. recalculate() rebuilds the cache from
 * the ledger if they ever drift.
 *
 * Nothing is deleted. Corrections set voided = true and reverse their effect.
 */
export default function useRedemptions() {
  const { fetchCollection, createItem, updateItem, fetchRecord } =
    usePocketBaseCore();
  const C = "redemptions";
  const M = "memberships";
  const MEMBERS = "members";

  // --- Internal: keep the member activity cache fresh ----------------------

  /** Bump last_active_at + total_orders on the member (cache for inactivity). */
  const touchMemberActivity = async (memberId: string, delta: number) => {
    try {
      const member = await fetchRecord(MEMBERS, memberId);
      const total = Math.max(0, ((member as any).total_orders ?? 0) + delta);
      await updateItem(MEMBERS, memberId, {
        total_orders: total,
        ...(delta > 0 ? { last_active_at: new Date().toISOString() } : {}),
      });
    } catch {
      // Activity cache is non-critical; never let it break a redemption.
    }
  };

  // --- Redeem a meal --------------------------------------------------------

  /**
   * Burn one credit. Ledger row first (source of truth), then the cached
   * counter. Guards against overdraw and expiry. Returns the new remaining.
   *
   * The caller should pass a *fresh* membership (read with ignoreCache) so the
   * guards see the real balance.
   */
  const redeem = async (
    m: Membership,
    opts: { staffId?: string; reason?: string } = {},
  ): Promise<{ redemption: Redemption; remaining: number }> => {
    if (m.credits_used >= m.credits_total)
      throw new Error("No credits remaining this month");
    if (new Date(m.expires_date) < new Date())
      throw new Error("Membership has expired for this month");

    // NOTE: never send "" for the redeemed_by relation — PocketBase rejects an
    // empty string on a relation field (wants a real id or the field omitted).
    const data: Record<string, any> = {
      membership: m.id,
      member: m.member,
      redeemed_at: new Date().toISOString(),
      kind: "meal",
      amount: 1,
      voided: false,
    };
    if (opts.staffId) data.redeemed_by = opts.staffId;
    if (opts.reason?.trim()) data.reason = opts.reason.trim();
    const redemption = (await createItem(C, data)) as Redemption;

    const used = m.credits_used + 1;
    await updateItem(M, m.id, {
      credits_used: used,
      status: used >= m.credits_total ? "exhausted" : "active",
    });
    await touchMemberActivity(m.member, +1);

    return { redemption, remaining: m.credits_total - used };
  };

  // --- Void a meal (correction) --------------------------------------------

  /**
   * Reverse a meal redemption that shouldn't have happened. Marks the row
   * voided (never deletes) and gives the credit back.
   */
  const voidRedemption = async (
    r: Redemption,
    m: Membership,
    reason: string,
  ): Promise<void> => {
    if (r.voided) return;
    await updateItem(C, r.id, { voided: true, void_reason: reason });
    if (r.kind === "meal") {
      const used = Math.max(0, m.credits_used - 1);
      await updateItem(M, m.id, { credits_used: used, status: "active" });
      await touchMemberActivity(m.member, -1);
    }
  };

  // --- Adjust credits (gift / refund) --------------------------------------

  /**
   * Change a member's available credits with a reason attached.
   *   gift a meal:      adjustCredits(m, +1, "Gift - loyalty")
   *   refund / remove:  adjustCredits(m, -1, "Refund - overcharged")
   *
   * Positive raises credits_total; negative lowers it (clamped so it can't go
   * below what's already been used). Writes an "adjustment" ledger row so the
   * change is auditable, then updates the cached total.
   */
  const adjustCredits = async (
    m: Membership,
    amount: number,
    reason: string,
    staffId?: string,
  ): Promise<{ redemption: Redemption; credits_total: number }> => {
    if (!amount || Number.isNaN(amount))
      throw new Error("Adjustment amount must be a non-zero number");
    if (!reason?.trim())
      throw new Error("A reason is required for a credit adjustment");

    // Can't remove credits that are already spent.
    const floor = m.credits_used;
    const nextTotal = Math.max(floor, m.credits_total + amount);
    const applied = nextTotal - m.credits_total; // may differ from `amount` if clamped

    const data: Record<string, any> = {
      membership: m.id,
      member: m.member,
      redeemed_at: new Date().toISOString(),
      kind: "adjustment",
      amount: applied,
      reason: reason.trim(),
      voided: false,
    };
    if (staffId) data.redeemed_by = staffId;
    const redemption = (await createItem(C, data)) as Redemption;

    await updateItem(M, m.id, {
      credits_total: nextTotal,
      status: nextTotal > m.credits_used ? "active" : "exhausted",
    });

    return { redemption, credits_total: nextTotal };
  };

  // --- Reconcile ------------------------------------------------------------

  /**
   * Rebuild credits_used on a membership from the ledger (non-voided meals).
   * Use if the cache and ledger ever disagree — the ledger always wins.
   */
  const recalculate = async (m: Membership): Promise<number> => {
    const r = await fetchCollection(
      C,
      1,
      1,
      `membership = "${m.id}" && kind = "meal" && voided = false`,
      "",
      null,
      null,
      true,
    );
    const used = r.totalItems;
    await updateItem(M, m.id, {
      credits_used: used,
      status: used >= m.credits_total ? "exhausted" : "active",
    });
    return used;
  };

  // --- History --------------------------------------------------------------

  /** Ledger for one member, newest first (admin history view). */
  const memberHistory = (memberId: string, page = 1, perPage = 20) =>
    fetchCollection(C, page, perPage, `member = "${memberId}"`, "-redeemed_at");

  /** Ledger for a single membership/bucket. */
  const membershipHistory = (membershipId: string, page = 1) =>
    fetchCollection(
      C,
      page,
      50,
      `membership = "${membershipId}"`,
      "-redeemed_at",
    );

  return {
    redeem,
    voidRedemption,
    adjustCredits,
    recalculate,
    memberHistory,
    membershipHistory,
  };
}
