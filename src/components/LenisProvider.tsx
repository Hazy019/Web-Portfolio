"use client";

/**
 * LenisProvider — Global smooth scroll + GSAP ScrollTrigger bridge (§1–2 v8)
 *
 * Responsibilities:
 *   1. Instantiate Lenis with inertial ease physics.
 *   2. Feed Lenis scroll position into GSAP ScrollTrigger so every ST animation
 *      reads from Lenis's virtual scroll offset rather than the native window scroll.
 *   3. Drive a thin right-edge progress indicator as a scrollbar replacement.
 *   4. prefers-reduced-motion: skip Lenis entirely, leave native scroll in place.
 *
 * NOTE: Lenis 1.3 on('scroll') callback receives the full Lenis instance.
 *       GSAP ticker drives Lenis RAF for frame-perfect synchronization.
 */

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  ScrollTrigger.normalizeScroll(true);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion & mobile/tablet screens (< 1024px) — skip Lenis, leave native scroll
    const isMobileOrTablet = typeof window !== "undefined" && window.innerWidth < 1024;
    const prefersReduced = typeof window !== "undefined" && window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || isMobileOrTablet) return;

    // ── Instantiate Lenis ─────────────────────────────────────────────────────
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      smoothWheel: true,
      touchMultiplier: 0,
    });
    lenisRef.current = lenis;
    if (typeof window !== "undefined") {
      (window as any).lenis = lenis;
    }

    // ── GSAP ticker drives Lenis RAF (frame-perfect sync) ────────────────────
    const gsapTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapTicker);
    gsap.ticker.lagSmoothing(0);

    // ── GSAP ScrollTrigger bridge ─────────────────────────────────────────────
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Refresh ScrollTrigger after Lenis initialization to lock frame-accurate trigger offsets
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    // Debounced resize handler for orientation and viewport changes
    let resizeTimer: NodeJS.Timeout | null = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    // ── Progress indicator ────────────────────────────────────────────────────
    lenis.on("scroll", (lenisSelf: Lenis) => {
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleY(${lenisSelf.progress})`;
      }
    });

    return () => {
      clearTimeout(refreshTimer);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      lenis.destroy();
      gsap.ticker.remove(gsapTicker);
    };
  }, []);

  return (
    <>
      {/* Scroll progress indicator — replaces native scrollbar */}
      <div
        aria-hidden="true"
        className="lenis-progress-track"
      >
        <div
          ref={progressRef}
          className="lenis-progress-bar"
        />
      </div>
      {children}
    </>
  );
}
