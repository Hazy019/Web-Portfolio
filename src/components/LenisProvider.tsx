"use client";

/**
 * LenisProvider — Global smooth scroll + GSAP ScrollTrigger bridge (§1–2 v9)
 *
 * Responsibilities:
 *   1. Instantiate Lenis with inertial ease physics.
 *   2. Feed Lenis scroll position into GSAP ScrollTrigger so every ST animation
 *      reads from Lenis's virtual scroll offset rather than the native window scroll.
 *   3. Drive a thin right-edge progress indicator as a scrollbar replacement.
 *   4. prefers-reduced-motion: skip Lenis entirely, leave native scroll in place.
 *
 * HYDRATION FIX (v9): ScrollTrigger.normalizeScroll(true) was removed from module
 * scope. It caused a hydration mismatch by injecting `touch-action: pan-x` on
 * <html>/<body> synchronously before React's hydration match-check. Lenis already
 * manages smooth scroll — normalizeScroll was redundant and conflicting with it.
 * GSAP plugin registration is kept in module scope but without DOM-mutating calls.
 *
 * NOTE: Lenis 1.3 on('scroll') callback receives the full Lenis instance.
 *       GSAP ticker drives Lenis RAF for frame-perfect synchronization.
 */

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Safe to register plugins at module scope — this only registers the plugin
// class with GSAP's internal registry, it does NOT touch the DOM.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  // NOTE: ScrollTrigger.normalizeScroll(true) intentionally removed.
  // It mutated document.documentElement.style.touchAction synchronously,
  // causing a React hydration mismatch (touch-action: pan-x on <html>/<body>).
  // Lenis handles smooth scroll; this call was redundant and harmful.
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
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          lenis.scrollTo(target as HTMLElement, { offset: -40, immediate: true });
        }
      }
    }, 250);

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
