import { computed, nextTick, ref, watch, type ComputedRef } from "vue";
import type { GroupKey } from "~/utils/comandas";

/**
 * Accordion/chip navigation for the menu groups: open/close state, cart
 * badge counts, and scroll-into-view when a chip is tapped. See menu.vue's
 * `<OrganismsMenuCategoryChips>` / `<OrganismsMenuGroupSection>` wiring.
 */
export function useMenuGroupAccordion(params: {
  menuGroups: ComputedRef<{ key: GroupKey; label: string }[]>;
  groupItems: (key: GroupKey) => { name: string }[];
  cart: Record<string, number>;
  dishesField: () => "dishes" | "store";
}) {
  const { menuGroups, groupItems, cart, dishesField } = params;

  /* ===== Chips + accordion sections =====
   * `openGroups` = the set of open groups. The chips and each section's header
   * share this state, so an "active" chip always corresponds to an open
   * section. On load we only open the first group with dishes, so we don't
   * overwhelm the user with the whole list expanded. */
  const openGroups = ref<Set<string>>(new Set());

  // Groups that actually have dishes today (the ones that show a chip).
  const visibleMenuGroups = computed(() =>
    menuGroups.value.filter((g) => groupItems(g.key).length > 0),
  );

  const isGroupOpen = (key: GroupKey) => openGroups.value.has(key);

  function toggleGroup(key: GroupKey) {
    const next = new Set(openGroups.value);
    next.has(key) ? next.delete(key) : next.add(key);
    openGroups.value = next;
  }

  const allGroupsOpen = computed(
    () =>
      visibleMenuGroups.value.length > 0 &&
      visibleMenuGroups.value.every((g) => openGroups.value.has(g.key)),
  );

  function toggleAllGroups() {
    openGroups.value = allGroupsOpen.value
      ? new Set()
      : new Set(visibleMenuGroups.value.map((g) => g.key));
  }

  // Cart count per group (chip badge and section header). Keeps track of the
  // order even while the section is closed.
  function groupCartCount(key: GroupKey) {
    return groupItems(key).reduce(
      (sum, item) => sum + (cart[item.name] ?? 0),
      0,
    );
  }

  // Refs for each <section> so we can scroll to them from the chip.
  const sectionEls: Record<string, HTMLElement> = {};
  function setSectionRef(key: string, el: unknown) {
    if (el instanceof HTMLElement) sectionEls[key] = el;
  }

  function getHeaderStackOffsetPx(): number {
    if (typeof window === "undefined") return 0;

    let offset = 0;
    const stackEls = document.querySelectorAll<HTMLElement>("[data-top-stack]");

    stackEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Count only visible top-stack elements currently attached near the top.
      if (rect.height <= 0) return;
      if (rect.bottom <= 0) return;
      if (rect.top >= 220) return;
      offset = Math.max(offset, rect.bottom);
    });

    return Math.ceil(offset);
  }

  function scrollGroupIntoView(key: GroupKey, behavior: ScrollBehavior) {
    if (typeof window === "undefined") return;
    const section = sectionEls[key];
    if (!section) return;

    const offset = getHeaderStackOffsetPx() + 20;
    const targetY = Math.max(
      0,
      window.scrollY + section.getBoundingClientRect().top - offset,
    );

    window.scrollTo({ top: targetY, behavior });
  }

  // Chip: opens the section (if it was closed) and smooth-scrolls to it.
  async function focusGroup(key: GroupKey) {
    if (!openGroups.value.has(key)) {
      const next = new Set(openGroups.value);
      next.add(key);
      openGroups.value = next;
    }

    await nextTick();
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );

    scrollGroupIntoView(key, "smooth");

    // Correct once more after layout settles to avoid the "second click" effect.
    window.setTimeout(() => {
      scrollGroupIntoView(key, "smooth");
    }, 140);
  }

  // Opens the first group with dishes the first time the menu loads.
  const didInitOpen = ref(false);
  watch(
    visibleMenuGroups,
    (groups) => {
      if (!didInitOpen.value && groups.length) {
        openGroups.value = new Set(
          dishesField() === "dishes"
            ? groups.map((group) => group.key)
            : [groups[0].key],
        );
        didInitOpen.value = true;
      }
    },
    { immediate: true },
  );

  return {
    openGroups,
    visibleMenuGroups,
    isGroupOpen,
    toggleGroup,
    allGroupsOpen,
    toggleAllGroups,
    groupCartCount,
    setSectionRef,
    focusGroup,
  };
}
