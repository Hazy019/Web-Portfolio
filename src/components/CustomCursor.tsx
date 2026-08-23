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
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

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

    // Direct GPU-accelerated GSAP quickTo setters for 60-120fps tracking
    const xDotTo = gsap.quickTo(dot, "x", { duration: 0.05, ease: "power3.out" });
    const yDotTo = gsap.quickTo(dot, "y", { duration: 0.05, ease: "power3.out" });

    const xRingTo = gsap.quickTo(ring, "x", { duration: 0.18, ease: "power2.out" });
    const yRingTo = gsap.quickTo(ring, "y", { duration: 0.18, ease: "power2.out" });

    let hasMoved = false;

    // ── Optimized: mousemove ONLY does GPU position updates ─────────────────
    // Mode detection moved to mouseenter/mouseleave on elements (below).
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      xDotTo(x);
      yDotTo(y);
      xRingTo(x);
      yRingTo(y);

      if (!hasMoved) {
        hasMoved = true;
        setIsVisible(true);
      }
    };

    // ── Mode detection via event delegation ─────────────────────────────────
    // Listen on document for mouseenter/mouseleave on matching selectors.
    // This fires once per element boundary crossing, not on every pixel moved.
    const handleEnterView = () => {
      if (modeRef.current !== "view") {
        modeRef.current = "view";
        setCursorMode("view");
      }
    };
    const handleLeaveView = () => {
      if (modeRef.current === "view") {
        modeRef.current = "default";
        setCursorMode("default");
      }
    };
    const handleEnterInteractive = () => {
      if (modeRef.current === "default") {
        modeRef.current = "hover";
        setCursorMode("hover");
      }
    };
    const handleLeaveInteractive = (e: Event) => {
      // Only reset if the relatedTarget isn't another interactive element
      const related = (e as MouseEvent).relatedTarget as HTMLElement | null;
      if (modeRef.current === "hover") {
        const stillOnInteractive = related?.closest(
          "a, button, input, textarea, [role='button'], [tabindex='0']"
        );
        if (!stillOnInteractive) {
          modeRef.current = "default";
          setCursorMode("default");
        }
      }
    };

    // Attach delegated listeners to document using event capture
    // so they fire for all matching descendants automatically
    const attachDelegated = () => {
      // [data-cursor="view"] elements
      document.querySelectorAll<HTMLElement>("[data-cursor='view']").forEach((el) => {
        el.addEventListener("mouseenter", handleEnterView);
        el.addEventListener("mouseleave", handleLeaveView);
      });

      // Interactive elements
      document.querySelectorAll<HTMLElement>(
        "a, button, input, textarea, [role='button'], [tabindex='0']"
      ).forEach((el) => {
        el.addEventListener("mouseenter", handleEnterInteractive);
        el.addEventListener("mouseleave", handleLeaveInteractive);
      });
    };

    // Initial attach + re-attach after DOM changes via MutationObserver
    attachDelegated();
    const observer = new MutationObserver(() => attachDelegated());
    observer.observe(document.body, { childList: true, subtree: true });

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [reducedMotion]);

  if (reducedMotion || isTouch) return null;

  const isView = cursorMode === "view";
  const isHover = cursorMode === "hover";

  return (
    <>
      {/* ── Inner neon green dot ─────────────────────────────────────── */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 pointer-events-none z-[10000] w-2 h-2 bg-[#8cff2e] rounded-full shadow-[0_0_10px_#8cff2e] transition-opacity duration-300 ${
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
        className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full flex items-center justify-center text-center transition-all duration-300 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${
          isView
            ? "w-[116px] h-[116px] shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
            : isHover
            ? "w-12 h-12 border-[#8cff2e]/80 bg-[#8cff2e]/10 scale-110 shadow-[0_0_20px_rgba(140,255,46,0.2)]"
            : "w-8 h-8 border-white/20"
        }`}
        style={{
          transform: "translate3d(-50%, -50%, 0)",
          willChange: "transform",
          background: isView ? "rgba(8, 10, 15, 0.45)" : undefined,
          backdropFilter: isView ? "blur(12px) saturate(180%)" : undefined,
          WebkitBackdropFilter: isView ? "blur(12px) saturate(180%)" : undefined,
          border: isView ? "1px solid rgba(255, 255, 255, 0.15)" : undefined,
        }}
      >
        {isView && (
          <div className="flex flex-col items-center justify-center text-center font-mono font-bold text-[11px] leading-tight tracking-wider uppercase text-white select-none">
            <span>View</span>
            <span>Case Study</span>
          </div>
        )}
      </div>
    </>
  );
}
