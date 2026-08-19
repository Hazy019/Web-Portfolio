/**
 * scrollRegistry — Cross-component GSAP ScrollTrigger coordination (v1)
 *
 * Problem this solves:
 * When the Work section's GSAP ScrollTrigger pins the horizontal carousel, it
 * creates a "pin-spacer" that adds thousands of virtual scroll pixels to the
 * document. Any downstream section that uses IntersectionObserver (like Framer
 * Motion's whileInView) has no awareness of this virtual scroll math. This causes
 * the Philosophy section to fire its reveal animation while Work is still pinned.
 *
 * Solution:
 * Work registers its ScrollTrigger instance here after creation. PhilosophyQuote
 * reads from this registry to anchor its own GSAP ScrollTrigger start AFTER Work's
 * pin fully releases — making it mathematically impossible for Philosophy to animate
 * while Work is still active.
 *
 * Usage:
 *   // In Work.tsx (after creating the ST):
 *   scrollRegistry.workPinEnd = anim.scrollTrigger;
 *
 *   // In PhilosophyQuote.tsx (when building ST):
 *   const workST = scrollRegistry.workPinEnd;
 *   const startOffset = workST ? workST.end + 50 : "top 85%";
 */

interface ScrollRegistry {
  /** The ScrollTrigger instance for the pinned Work carousel. Set by Work.tsx. */
  work: {
    trigger: globalThis.ScrollTrigger | null;
  };
  /** Legacy alias for work.trigger */
  workScrollTrigger: globalThis.ScrollTrigger | null;
}

export const scrollRegistry: ScrollRegistry = {
  work: {
    trigger: null,
  },
  get workScrollTrigger() {
    return this.work.trigger;
  },
  set workScrollTrigger(val) {
    this.work.trigger = val;
  },
};

