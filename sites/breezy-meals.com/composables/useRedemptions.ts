// composables/useRedemptions.ts
import type { Membership, Redemption } from "~/types/membership";

export interface AdminRedemptionInput {
  memberId: string;
  membershipId: string;
  kind: Redemption["kind"];
  amount: number;
  redeemedAt: string;
  reason?: string;
  staffId?: string;
}

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
   * counter. Guards against overdraw. Returns the new remaining.
   *
   * The caller should pass a *fresh* membership (read with ignoreCache) so the
   * guards see the real balance.
   */
  const redeem = async (
    m: Membership,
    opts: { staffId?: string; reason?: string } = {},
  ): Promise<{ redemption: Redemption; remaining: number }> => {
    if (m.credits_used >= m.credits_total)
      throw new Error("No credits remaining");

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

  // --- Administrative corrections -----------------------------------------

  const getMembership = (id: string) =>
    fetchRecord(M, id, true) as Promise<Membership>;

  const applyAdjustmentDeltas = async (deltas: Map<string, number>) => {
    for (const [membershipId, delta] of deltas) {
      if (!delta) continue;
      const membership = await getMembership(membershipId);
      const creditsTotal = Math.max(
        membership.credits_used,
        membership.credits_total + delta,
      );
      await updateItem(M, membership.id, {
        credits_total: creditsTotal,
        status:
          membership.status === "cancelled"
            ? "cancelled"
            : creditsTotal > membership.credits_used
              ? "active"
              : "exhausted",
      });
    }
  };

  const recalculateMemberships = async (ids: Set<string>) => {
    for (const membershipId of ids) {
      await recalculate(await getMembership(membershipId));
    }
  };

  const adminData = (input: AdminRedemptionInput) => {
    const data: Record<string, unknown> = {
      membership: input.membershipId,
      member: input.memberId,
      redeemed_at: input.redeemedAt,
      kind: input.kind,
      amount:
        input.kind === "meal"
          ? 1
          : input.kind === "topup_note"
            ? 0
            : input.amount,
      reason: input.reason?.trim() ?? "",
    };
    if (input.staffId) data.redeemed_by = input.staffId;
    return data;
  };

  const createAdministrative = async (
    input: AdminRedemptionInput,
  ): Promise<Redemption> => {
    const redemption = (await createItem(C, {
      ...adminData(input),
      voided: false,
    })) as Redemption;

    if (input.kind === "meal") {
      await recalculateMemberships(new Set([input.membershipId]));
      await touchMemberActivity(input.memberId, +1);
    } else if (input.kind === "adjustment") {
      await applyAdjustmentDeltas(
        new Map([[input.membershipId, input.amount]]),
      );
    }
    return redemption;
  };

  const updateAdministrative = async (
    current: Redemption,
    input: AdminRedemptionInput,
  ): Promise<Redemption> => {
    const updated = (await updateItem(
      C,
      current.id,
      adminData(input),
    )) as Redemption;
    if (current.voided) return updated;

    const mealMemberships = new Set<string>();
    if (current.kind === "meal") mealMemberships.add(current.membership);
    if (input.kind === "meal") mealMemberships.add(input.membershipId);
    await recalculateMemberships(mealMemberships);

    const adjustmentDeltas = new Map<string, number>();
    if (current.kind === "adjustment") {
      adjustmentDeltas.set(current.membership, -current.amount);
    }
    if (input.kind === "adjustment") {
      adjustmentDeltas.set(
        input.membershipId,
        (adjustmentDeltas.get(input.membershipId) ?? 0) + input.amount,
      );
    }
    await applyAdjustmentDeltas(adjustmentDeltas);

    if (current.kind === "meal" && input.kind !== "meal") {
      await touchMemberActivity(current.member, -1);
    } else if (current.kind !== "meal" && input.kind === "meal") {
      await touchMemberActivity(input.memberId, +1);
    } else if (current.kind === "meal" && current.member !== input.memberId) {
      await touchMemberActivity(current.member, -1);
      await touchMemberActivity(input.memberId, +1);
    }
    return updated;
  };

  const voidAdministrative = async (
    redemption: Redemption,
    reason: string,
  ): Promise<void> => {
    if (redemption.voided) return;
    if (!reason.trim())
      throw new Error("A reason is required to void a redemption");
    if (redemption.kind === "meal") {
      await voidRedemption(
        redemption,
        await getMembership(redemption.membership),
        reason.trim(),
      );
      return;
    }
    await updateItem(C, redemption.id, {
      voided: true,
      void_reason: reason.trim(),
    });
    if (redemption.kind === "adjustment") {
      await applyAdjustmentDeltas(
        new Map([[redemption.membership, -redemption.amount]]),
      );
    }
  };

  const restoreAdministrative = async (
    redemption: Redemption,
  ): Promise<void> => {
    if (!redemption.voided) return;
    await updateItem(C, redemption.id, { voided: false, void_reason: "" });
    if (redemption.kind === "meal") {
      await recalculateMemberships(new Set([redemption.membership]));
      await touchMemberActivity(redemption.member, +1);
    } else if (redemption.kind === "adjustment") {
      await applyAdjustmentDeltas(
        new Map([[redemption.membership, redemption.amount]]),
      );
    }
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

  const listAdministrative = (page = 1, perPage = 200) =>
    fetchCollection(
      C,
      page,
      perPage,
      "",
      "-redeemed_at",
      "member,membership,redeemed_by",
      null,
      true,
    );

  return {
    redeem,
    voidRedemption,
    adjustCredits,
    recalculate,
    memberHistory,
    membershipHistory,
    listAdministrative,
    createAdministrative,
    updateAdministrative,
    voidAdministrative,
    restoreAdministrative,
  };
}
