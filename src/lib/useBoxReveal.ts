/**
 * useBoxReveal — Shared clip-path "box sweep" reveal (§3 v6)
 *
 * Applied identically to two designated text blocks sitewide:
 *   1. PhilosophyQuote — the Steve Jobs quote (pinned, pin: true)
 *   2. About mission paragraph — no pin, enters on scroll
 *
 * Mechanism: a clip-path inset sweeps downward in sync with scroll.
 * Text ahead of the sweep sits at LOW_OPACITY; text the sweep has passed
 * rises to full opacity via a simultaneous tween.
 * This reads as one continuous "box" moving through the text, not word pops.
 *
 * Reduced motion: pass enabled=false and the hook is a no-op.
 * Full text renders at 100% opacity immediately, no clip-path applied.
 */

import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface BoxRevealOptions {
  /** Whether to pin the section while the reveal plays. Default: false */
  pin?: boolean;
  /**
   * ScrollTrigger start position string.
   * Default: "top top" if pin=true, else "top 80%"
   */
  start?: string;
  /**
   * ScrollTrigger end position string or "+=" offset.
   * Default: "+=150%" if pin=true, else "bottom 20%"
   */
  end?: string;
  /** Scrub amount passed to ScrollTrigger. Default: 1.2 */
  scrub?: number;
  /** Initial opacity of unrevealed text. Default: 0.35 */
  lowOpacity?: number;
  /** If false, hook is completely disabled (use for reduced motion). Default: true */
  enabled?: boolean;
}

/**
 * Attaches a clip-path box-reveal ScrollTrigger.
 * wrapperRef = the section/trigger container.
 * textRef    = the element that gets the clip-path mask applied.
 */
export function useBoxReveal(
  wrapperRef: RefObject<HTMLElement | null>,
  textRef: RefObject<HTMLElement | null>,
  options: BoxRevealOptions = {}
): void {
  const {
    pin = false,
    start,
    end,
    scrub = 1.2,
    lowOpacity = 0.35,
    enabled = true,
  } = options;

  const resolvedStart = start ?? (pin ? "top top" : "top 80%");
  const resolvedEnd   = end   ?? (pin ? "+=150%"  : "bottom 20%");

  useEffect(() => {
    if (!enabled) return;

    const wrapper = wrapperRef.current;
    const text    = textRef.current;
    if (!wrapper || !text) return;

    // ── Initial state ──────────────────────────────────────────────────────
    // Text starts dim and fully masked (clip covers bottom 100% = nothing visible)
    gsap.set(text, {
      opacity: lowOpacity,
      clipPath: "inset(0 0 100% 0)",
      webkitClipPath: "inset(0 0 100% 0)",
    });

    // ── Timeline ───────────────────────────────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: resolvedStart,
        end: resolvedEnd,
        scrub,
        pin,
        anticipatePin: pin ? 1 : 0,
      },
    });

    // Phase 1 — mask sweeps down (clip bottom shrinks from 100% → 0%)
    tl.to(
      text,
      {
        clipPath: "inset(0 0 0% 0)",
        webkitClipPath: "inset(0 0 0% 0)",
        ease: "none",
        duration: 1,
      },
      0
    );

    // Phase 2 — opacity climbs from lowOpacity → 1 in sync with the sweep
    tl.to(
      text,
      {
        opacity: 1,
        ease: "none",
        duration: 1,
      },
      0 // start at the same time as phase 1
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      // Reset to visible so content is readable if context is reverted
      gsap.set(text, {
        opacity: 1,
        clipPath: "none",
        webkitClipPath: "none",
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, pin, resolvedStart, resolvedEnd, scrub, lowOpacity]);
}
