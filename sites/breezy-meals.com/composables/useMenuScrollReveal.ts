import { onBeforeUnmount, type Ref } from "vue";

type GsapRuntime = {
  gsap: any;
  ScrollTrigger: any;
};

/**
 * Lazily loads GSAP + ScrollTrigger and fades in `.js-reveal-item` /
 * `.js-reveal-section` nodes under `rootEl` as they enter the viewport.
 * Call `scheduleRevealRefresh()` whenever the visible content changes
 * (menu date, open/closed sections, new taquiza orders, etc).
 */
export function useMenuScrollReveal(rootEl: Ref<HTMLElement | null>) {
  let gsapRuntime: GsapRuntime | null = null;
  const revealTriggers: any[] = [];
  let revealRaf: number | null = null;

  async function getGsapRuntime(): Promise<GsapRuntime> {
    if (gsapRuntime) return gsapRuntime;

    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]);

    gsap.registerPlugin(ScrollTrigger);
    gsapRuntime = { gsap, ScrollTrigger };
    return gsapRuntime;
  }

  function motionReduced(): boolean {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  async function initScrollReveal() {
    if (!import.meta.client || !rootEl.value || motionReduced()) return;

    const { gsap, ScrollTrigger } = await getGsapRuntime();
    const nodes = rootEl.value.querySelectorAll<HTMLElement>(
      ".js-reveal-item, .js-reveal-section",
    );

    nodes.forEach((el) => {
      if (el.dataset.revealInit === "1") return;
      if (el.offsetParent === null) return;

      el.dataset.revealInit = "1";
      const tween = gsap.fromTo(
        el,
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.32,
          ease: "power1.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: el,
            start: "top 96%",
            once: true,
          },
        },
      );

      if (tween.scrollTrigger) revealTriggers.push(tween.scrollTrigger);
    });

    ScrollTrigger.refresh();
  }

  function scheduleRevealRefresh() {
    if (!import.meta.client) return;
    if (revealRaf) cancelAnimationFrame(revealRaf);
    revealRaf = requestAnimationFrame(() => {
      void initScrollReveal();
      revealRaf = null;
    });
  }

  onBeforeUnmount(() => {
    if (revealRaf) cancelAnimationFrame(revealRaf);
    revealTriggers.forEach((trigger) => trigger?.kill?.());
    revealTriggers.length = 0;
  });

  return { scheduleRevealRefresh };
}
