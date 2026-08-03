// composables/useCheckIn.ts
import type { Member, Membership } from "~/types/membership";

/**
 * useCheckIn — the staff-side counter flow, for the /orders admin screen.
 *
 * Orchestrates the three smaller composables into one reactive `status` the UI
 * can switch on: look up a member (by PIN or name) -> evaluate their current
 * bucket -> confirm a redemption. Works for walk-ins with no online order, and
 * is fully decoupled from the comandas board.
 *
 * This is where a meal credit actually burns. The public /menu page only
 * validates; the real decrement happens here when a plate is served.
 */
export default function useCheckIn() {
  const members = useMembers();
  const memberships = useMemberships();
  const redemptions = useRedemptions();
  const { user } = usePocketBaseCore();

  const member = ref<Member | null>(null);
  const membership = ref<Membership | null>(null);
  const candidates = ref<Member[]>([]); // when a name search returns several
  const loading = ref(false);
  const working = ref(false); // during the redeem write

  type Status =
    | "idle"
    | "searching"
    | "choose" // multiple name matches, UI shows a picker
    | "no_membership" // member found but no grant this month
    | "expired"
    | "exhausted"
    | "ready";
  const status = ref<Status>("idle");

  const remaining = computed(() =>
    membership.value ? memberships.remaining(membership.value) : 0,
  );

  const evaluate = () => {
    const m = membership.value;
    if (!m) {
      status.value = "no_membership";
      return;
    }
    if (memberships.isExpired(m)) {
      status.value = "expired";
      return;
    }
    if (memberships.remaining(m) <= 0) {
      status.value = "exhausted";
      return;
    }
    status.value = "ready";
  };

  /** Load a specific member and their current bucket, then evaluate. */
  const select = async (m: Member | null) => {
    candidates.value = [];
    member.value = m;
    if (!m) {
      status.value = "idle";
      membership.value = null;
      return;
    }
    membership.value = await memberships.getActiveMembership(m.id);
    evaluate();
  };

  /** Exact-PIN entry (fast path). */
  const lookupByCode = async (code: string) => {
    loading.value = true;
    status.value = "searching";
    try {
      await select(await members.getMemberByCode(code));
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fuzzy entry by name/phone/PIN. One match -> loads it. Several -> exposes
   * `candidates` and sets status "choose" so the UI can show a picker.
   */
  const lookup = async (term: string) => {
    loading.value = true;
    status.value = "searching";
    try {
      const r = await members.searchMembers(term);
      const items = r.items as Member[];
      if (items.length === 1) {
        await select(items[0]);
      } else if (items.length === 0) {
        member.value = null;
        membership.value = null;
        candidates.value = [];
        status.value = "idle";
      } else {
        candidates.value = items;
        status.value = "choose";
      }
      return items;
    } finally {
      loading.value = false;
    }
  };

  /** Burn one credit for the loaded member. Only valid when status is "ready". */
  const confirmRedeem = async (): Promise<boolean> => {
    if (status.value !== "ready" || !membership.value) return false;
    working.value = true;
    try {
      // Re-read the bucket fresh so the guard sees the true balance even if
      // another device redeemed since we loaded.
      const fresh = await memberships.getActiveMembership(member.value!.id);
      if (!fresh || !memberships.isUsable(fresh)) {
        membership.value = fresh;
        evaluate();
        return false;
      }
      const { remaining: left } = await redemptions.redeem(fresh, {
        staffId: user?.id,
      });
      // reflect the burn locally
      membership.value = { ...fresh, credits_used: fresh.credits_used + 1 };
      evaluate();
      return left >= 0;
    } finally {
      working.value = false;
    }
  };

  /** Issue this month's grant for a member who has none (renewal / first grant). */
  const issueThisMonth = async (credits = 5) => {
    if (!member.value) return;
    working.value = true;
    try {
      membership.value = await memberships.issueMembership(member.value.id, {
        credits,
        issuedBy: user?.id,
      });
      evaluate();
    } finally {
      working.value = false;
    }
  };

  const reset = () => {
    member.value = null;
    membership.value = null;
    candidates.value = [];
    status.value = "idle";
    loading.value = false;
    working.value = false;
  };

  return {
    member,
    membership,
    candidates,
    status,
    loading,
    working,
    remaining,
    lookup,
    lookupByCode,
    select,
    confirmRedeem,
    issueThisMonth,
    reset,
  };
}
