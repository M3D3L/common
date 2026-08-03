// types/membership.ts
import type { RecordModel } from "pocketbase";

/**
 * A person on file. Identity + activity cache.
 * `member_code` (GM1234) is set once at creation and NEVER edited or reused.
 * `last_active_at` / `total_orders` are denormalized caches derived from the
 * redemptions ledger — the ledger is always the source of truth.
 */
export interface Member extends RecordModel {
  name: string;
  phone: string;
  member_code: string;
  address?: string;
  status: "active" | "dormant" | "archived";
  last_active_at?: string | null;
  total_orders: number;
  joined_date: string;
  notes?: string;
}

/**
 * One monthly bucket of meal credits for a member.
 * Exactly one active row per (member, period) — top-ups increment
 * `credits_total` on the same row rather than creating a second grant.
 * `credits_used` is a cache; authoritative balance is derived from the ledger.
 */
export interface Membership extends RecordModel {
  member: string;
  period: string; // "2026-08"
  credits_total: number;
  credits_used: number;
  issued_date: string;
  expires_date: string;
  status: "active" | "exhausted" | "expired" | "cancelled";
  issued_by?: string;
}

/**
 * The append-only ledger. Every balance-affecting event is a row here.
 *  - kind "meal":       a served meal (counts toward credits_used, +1 activity)
 *  - kind "adjustment": a signed correction (gift = +amount, refund/claw = -amount)
 *  - kind "topup_note": a marker that a second payment topped up the bucket
 * Rows are never deleted; corrections set `voided = true`.
 */
export interface Redemption extends RecordModel {
  membership: string;
  member: string;
  redeemed_at: string;
  redeemed_by?: string;
  kind: "meal" | "adjustment" | "topup_note";
  amount: number; // meal = 1, adjustment = signed, topup_note = 0
  reason?: string;
  voided: boolean;
  void_reason?: string;
}

/** Shape returned by the public /api/membership/check route. Minimal on purpose. */
export interface MembershipCheck {
  valid: boolean;
  name?: string;
  remaining?: number;
  period?: string;
  reason?: "not_found" | "expired" | "exhausted" | "rate_limited";
}

export type MemberStatus = Member["status"];
export type MembershipStatus = Membership["status"];
export type RedemptionKind = Redemption["kind"];
