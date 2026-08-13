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

      // Check hover targets efficiently and only trigger state update when mode changes
      const target = e.target as HTMLElement | null;
      let nextMode: "default" | "hover" | "view" = "default";

      if (target && target.closest("[data-cursor='view']")) {
        nextMode = "view";
      } else if (
        target &&
        target.closest("a, button, input, textarea, [role='button'], [tabindex='0']")
      ) {
        nextMode = "hover";
      }

      if (modeRef.current !== nextMode) {
        modeRef.current = nextMode;
        setCursorMode(nextMode);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
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
          <div className="flex flex-col items-center justify-center text-center font-mono font-bold text-[12px] tracking-wider uppercase text-white select-none">
            <span>View</span>
            <span>Project</span>
          </div>
        )}
      </div>
    </>
  );
}
