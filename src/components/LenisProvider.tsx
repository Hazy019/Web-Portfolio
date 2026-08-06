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
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion — skip Lenis, leave native scroll
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    // ── Instantiate Lenis ─────────────────────────────────────────────────────
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // ── GSAP ticker drives Lenis RAF (frame-perfect sync) ────────────────────
    const gsapTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapTicker);
    gsap.ticker.lagSmoothing(0);

    // ── GSAP ScrollTrigger bridge ─────────────────────────────────────────────
    // ScrollTrigger.update() must be called on each Lenis scroll event
    lenis.on("scroll", ScrollTrigger.update);

    // ── Progress indicator ────────────────────────────────────────────────────
    lenis.on("scroll", (lenisSelf: Lenis) => {
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleY(${lenisSelf.progress})`;
      }
    });

    return () => {
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
