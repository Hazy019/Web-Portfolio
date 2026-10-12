"use client";

/**
 * LenisProvider — Global smooth scroll + GSAP ScrollTrigger bridge (v10)
 *
 * Responsibilities:
 *   1. Instantiate Lenis with inertial ease physics.
 *   2. Feed Lenis scroll position into GSAP ScrollTrigger so every ST animation
 *      reads from Lenis's virtual scroll offset rather than the native window scroll.
 *   3. Drive a thin right-edge progress indicator as a scrollbar replacement.
 *   4. prefers-reduced-motion: skip Lenis entirely, leave native scroll in place.
 *
 * SCROLL-RESTORATION FIX (v10):
 *   The site's pinned horizontal-scroll Projects section inserts a large pin-spacer
 *   that only exists AFTER hydration + loader + ScrollTrigger creation. On reload,
 *   the browser's native scroll restoration fires against the short, pre-pin layout.
 *   Then pin-spacer grows the document, scroll offset stays the same, and the visitor
 *   is physically inside the Projects range. Scrollspy then overwrites the hash.
 *
 *   Fix:
 *   1. Set history.scrollRestoration = 'manual' at module scope.
 *   2. Poll for window.__hazyLoaded (set by Loader.onComplete).
 *   3. After loader done: await fonts.ready + ScrollTrigger.clearScrollMemory()
 *      + ScrollTrigger.refresh().
 *   4. Then scroll to hash element with Lenis, immediate, AFTER pin-spacers exist.
 *   5. Expose window.__hazyRestoring so scrollspy blocks hash writes during restore.
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

  // CRITICAL: Disable native scroll restoration at module scope (earliest possible
  // point) so the browser never restores a stale scrollY before our deterministic
  // hash-based restore runs post-pin-spacer-layout.
  history.scrollRestoration = "manual";
}

/** Nav height + buffer for hash-scroll offset (must match Navbar fixed top). */
const NAV_OFFSET = 80;

/**
 * Global coordination flags (set on window to allow cross-component access):
 *   window.lenis           — the Lenis instance
 *   window.__hazyLoaded    — set true by Loader.onComplete()
 *   window.__hazyRestoring — true while initial hash restore is in progress;
 *                            scrollspy must skip hash writes when this is true.
 */

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Redundant safety: also set in module scope above, but guard for SSR edge cases.
    if (typeof history !== "undefined") {
      history.scrollRestoration = "manual";
    }

    // Respect prefers-reduced-motion & mobile/tablet screens (< 1024px) — skip Lenis, drive progress bar via native scroll
    const isMobileOrTablet = typeof window !== "undefined" && window.innerWidth < 1024;
    const prefersReduced = typeof window !== "undefined" && window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced || isMobileOrTablet) {
      const handleNativeScroll = () => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll > 0 && progressRef.current) {
          progressRef.current.style.transform = `scaleY(${Math.min(1, Math.max(0, scrollY / maxScroll))})`;
        }
      };
      window.addEventListener("scroll", handleNativeScroll, { passive: true });
      handleNativeScroll();

      // On mobile/reduced-motion: simple hash restore after fonts settle.
      // No pin-spacers on mobile, so fonts.ready + one rAF is sufficient.
      (async () => {
        await document.fonts.ready;
        const rawHash = decodeURIComponent(window.location.hash.slice(1));
        if (rawHash) {
          const el = document.getElementById(rawHash);
          if (el) {
            requestAnimationFrame(() => {
              el.scrollIntoView({ behavior: "instant", block: "start" });
            });
          }
        }
      })();

      return () => window.removeEventListener("scroll", handleNativeScroll);
    }

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
      // Mark restoration in progress — scrollspy reads this before writing hash.
      (window as any).__hazyRestoring = true;
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

    // ── Deterministic Hash Restore ────────────────────────────────────────────
    //
    // Must wait for (in order):
    //   1. Loader done       → window.__hazyLoaded = true
    //   2. fonts.ready       → font-driven layout shift resolved
    //   3. ST.refresh()      → pin-spacer heights baked into scroll geometry
    //   4. one rAF           → ST settle frame
    //   → THEN scroll to hash element
    //
    let restoreAborted = false;

    (async () => {
      // Step 1: Poll for loader completion (Loader.onComplete sets __hazyLoaded)
      await new Promise<void>((resolve) => {
        if ((window as any).__hazyLoaded) { resolve(); return; }
        const poll = () => {
          if ((window as any).__hazyLoaded) { resolve(); }
          else { requestAnimationFrame(poll); }
        };
        poll();
      });

      if (restoreAborted) return;

      // Step 2: Fonts ready
      await document.fonts.ready;

      if (restoreAborted) return;

      // Step 3: Clear stale GSAP scroll memory, then force-refresh all STs
      // so pin-spacers are computed against the post-load document height.
      (ScrollTrigger as any).clearScrollMemory?.();
      ScrollTrigger.refresh();

      // Step 4: One rAF for ST to finish the refresh synchronously
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      if (restoreAborted) return;

      // Step 5: Restore hash AFTER layout is final
      const rawHash = decodeURIComponent(window.location.hash.slice(1));
      const el = rawHash ? document.getElementById(rawHash) : null;

      if (el) {
        lenis.scrollTo(el, { immediate: true, force: true, offset: -NAV_OFFSET });
      } else {
        // No hash — ensure we're at the top (browser may have cached a scroll pos)
        lenis.scrollTo(0, { immediate: true, force: true });
      }

      // Step 6: Unlock scrollspy hash writes
      (window as any).__hazyRestoring = false;
    })();

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
      restoreAborted = true;
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      lenis.destroy();
      gsap.ticker.remove(gsapTicker);
      if (typeof window !== "undefined") {
        delete (window as any).lenis;
        delete (window as any).__hazyRestoring;
        delete (window as any).__hazyLoaded;
      }
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
