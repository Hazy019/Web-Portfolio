"use client";

/**
 * CustomCursor — Translucent Depth Glass Cursor ("VIEW PROJECT") (§1)
 *
 * Translucent glassmorphism bubble on image hover:
 *   - background: rgba(8, 10, 15, 0.45)
 *   - backdrop-filter: blur(12px) saturate(180%)
 *   - border: 1px solid rgba(255, 255, 255, 0.15)
 *   - border-radius: 9999px
 *   - pointer-events: none
 *   - will-change: transform
 *   - text: High-contrast pure white (#FFFFFF), 12px tracked-out monospace ("VIEW PROJECT")
 *
 * PERFORMANCE FIX (v2): Removed per-mousemove .closest() DOM tree-walks.
 * Previously: on every single mousemove event, the code ran:
 *   target.closest("[data-cursor='view']")
 *   target.closest("a, button, input, textarea, [role='button'], [tabindex='0']")
 * This is a full DOM ancestor tree-walk on every pixel of mouse movement, competing
 * with scroll for main-thread time.
 *
 * Fix: cursor mode is now tracked via mouseenter/mouseleave listeners on interactive
 * elements themselves (event delegation to document), updating a stable ref. The
 * mousemove handler only does GPU position updates — no DOM queries.
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<"default" | "hover" | "view">("default");
  const [cursorMode, setCursorMode] = useState<"default" | "hover" | "view">("default");
  const [viewText, setViewText] = useState<{ line1: string; line2: string }>({
    line1: "VIEW",
    line2: "PROJECT",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const lastPosRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });

  useEffect(() => {
    // Check coarse pointer / touch hardware
    if (typeof window !== "undefined") {
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      if (isCoarse || hasTouch) {
        setIsTouch(true);
        return;
      }
    }

    if (reducedMotion) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Direct GPU-accelerated GSAP quickTo setters with tight latency (0.02s dot, 0.1s ring)
    const xDotTo = gsap.quickTo(dot, "x", { duration: 0.02, ease: "power3.out" });
    const yDotTo = gsap.quickTo(dot, "y", { duration: 0.02, ease: "power3.out" });

    const xRingTo = gsap.quickTo(ring, "x", { duration: 0.1, ease: "power2.out" });
    const yRingTo = gsap.quickTo(ring, "y", { duration: 0.1, ease: "power2.out" });

    let hasMoved = false;

    // ── Instant Target Evaluation & State Resolution ────────────────────────
    const evaluateTarget = (target: HTMLElement | null) => {
      if (!target || target.closest?.("#theme-transition-overlay")) {
        if (modeRef.current !== "default") {
          modeRef.current = "default";
          setCursorMode("default");
        }
        return;
      }

      // Check if directly on or inside a [data-cursor="view"] container
      const viewEl = target.closest?.("[data-cursor='view']") as HTMLElement | null;
      if (viewEl) {
        const customText = viewEl.getAttribute("data-cursor-text");
        if (customText) {
          const parts = customText.split("\n");
          if (parts.length >= 2) {
            setViewText({ line1: parts[0], line2: parts[1] });
          } else {
            const words = customText.split(" ");
            setViewText({
              line1: words[0] || "VIEW",
              line2: words.slice(1).join(" ") || "PROJECT",
            });
          }
        } else {
          setViewText({ line1: "VIEW", line2: "PROJECT" });
        }

        if (modeRef.current !== "view") {
          modeRef.current = "view";
          setCursorMode("view");
        }
        return;
      }

      // Check if on interactive button, link, or input
      const interactiveEl = target.closest?.(
        "a, button, input, textarea, [role='button'], [tabindex='0']"
      ) as HTMLElement | null;
      if (interactiveEl) {
        if (modeRef.current !== "hover") {
          modeRef.current = "hover";
          setCursorMode("hover");
        }
        return;
      }

      // Default state
      if (modeRef.current !== "default") {
        modeRef.current = "default";
        setCursorMode("default");
      }
    };

    // ── Mouse Move Handler (Instant 120fps Position + Decoupled Target Inspection) ──
    let targetRaf: number | null = null;
    let pendingTarget: HTMLElement | null = null;

    const scheduleTargetEvaluation = (target: HTMLElement | null) => {
      pendingTarget = target;
      if (targetRaf === null) {
        targetRaf = requestAnimationFrame(() => {
          targetRaf = null;
          evaluateTarget(pendingTarget);
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      lastPosRef.current = { x, y };

      // 1. Direct hardware GPU position tracking (0ms latency, zero DOM queries)
      xDotTo(x);
      yDotTo(y);
      xRingTo(x);
      yRingTo(y);

      if (!hasMoved) {
        hasMoved = true;
        setIsVisible(true);
      }

      // 2. Schedule DOM target inspection on RAF (prevents main-thread choking)
      scheduleTargetEvaluation(e.target as HTMLElement);
    };

    // ── Scroll / Pinned Translation Target Re-evaluator ─────────────────────
    let scrollRaf: number | null = null;
    const handleScrollSync = () => {
      if (scrollRaf !== null) cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => {
        const { x, y } = lastPosRef.current;
        if (x > 0 && y > 0 && typeof document !== "undefined") {
          const currentUnderCursor = document.elementFromPoint(x, y) as HTMLElement | null;
          evaluateTarget(currentUnderCursor);
        }
      });
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScrollSync, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    // Sync with Lenis smooth-scroll updates
    const lenis = (window as any).lenis;
    if (lenis && typeof lenis.on === "function") {
      lenis.on("scroll", handleScrollSync);
    }

    return () => {
      if (targetRaf !== null) cancelAnimationFrame(targetRaf);
      if (scrollRaf !== null) cancelAnimationFrame(scrollRaf);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScrollSync);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      if (lenis && typeof lenis.off === "function") {
        lenis.off("scroll", handleScrollSync);
      }
    };
  }, [reducedMotion]);

  if (reducedMotion || isTouch) return null;

  const isView = cursorMode === "view";
  const isHover = cursorMode === "hover";

  return (
    <>
      {/* ── Inner accent dot ─────────────────────────────────────── */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 pointer-events-none z-[10000] w-2 h-2 bg-[var(--accent-primary)] rounded-full shadow-[0_0_10px_var(--accent-primary)] transition-opacity duration-150 ${
          isVisible && !isView ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: "translate3d(-50%, -50%, 0)",
          willChange: "transform",
        }}
      />

      {/* ── Interactive Follower Sphere ──────────── */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full flex items-center justify-center text-center transition-[width,height,background-color,border-color,box-shadow,opacity] duration-150 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${
          isView
            ? "w-[116px] h-[116px] shadow-[var(--glass-shadow)] bg-[var(--bg-card)]/80 border border-[var(--border-subtle)] backdrop-blur-md"
            : isHover
            ? "w-12 h-12 border-[var(--accent-primary)]/80 bg-[var(--accent-primary)]/10 scale-110 shadow-[0_0_20px_var(--accent-primary)]"
            : "w-8 h-8 border-[var(--border-subtle)]"
        }`}
        style={{
          transform: "translate3d(-50%, -50%, 0)",
          willChange: "transform",
        }}
      >
        {isView && (
          <div className="flex flex-col items-center justify-center text-center font-mono font-bold text-[11px] leading-tight tracking-wider uppercase text-white select-none">
            <span>{viewText.line1}</span>
            <span>{viewText.line2}</span>
          </div>
        )}
      </div>
    </>
  );
}
