"use client";

import React, { useEffect, useState, useRef } from "react";

export type Theme = "dark" | "light";

interface ThemeTransitionOverlayProps {
  targetTheme: Theme;
  scrollY: number;
  onComplete: () => void;
}

export function ThemeTransitionOverlay({
  targetTheme,
  scrollY,
  onComplete,
}: ThemeTransitionOverlayProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // 1. Lock smooth scroll during transition to eliminate micro-jitters
    const lenis = (window as any).lenis;
    if (lenis && typeof lenis.stop === "function") {
      lenis.stop();
    }

    // 2. Clone active DOM tree into each stationary slat mirror with 1-pass optimization
    const sourceMain = document.querySelector("main");
    if (sourceMain) {
      // Create master sanitized clone once
      const masterClone = sourceMain.cloneNode(true) as HTMLElement;
      masterClone
        .querySelectorAll(
          "#custom-cursor, #theme-transition-overlay, .loader-container, [data-overlay-ignore], iframe, video"
        )
        .forEach((el) => el.remove());

      masterClone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
      masterClone.removeAttribute("id");
      masterClone.setAttribute("aria-hidden", "true");
      masterClone.setAttribute("data-theme", targetTheme);

      masterClone.style.position = "absolute";
      masterClone.style.top = `-${scrollY}px`;
      masterClone.style.left = "0px";
      masterClone.style.width = "100vw";
      masterClone.style.pointerEvents = "none";
      masterClone.style.userSelect = "none";

      innerRefs.current.forEach((innerContainer, i) => {
        if (!innerContainer) return;
        const slatClone = (i === 0 ? masterClone : masterClone.cloneNode(true)) as HTMLElement;
        innerContainer.innerHTML = "";
        innerContainer.appendChild(slatClone);
      });
    }

    // 3. Trigger transition on next RAF frame
    const rafId = requestAnimationFrame(() => {
      setIsAnimating(true);
    });

    // 4. Stagger lifecycle: 850ms duration + 4 * 70ms stagger = 1130ms
    const fullSlatDuration = 850 + 4 * 70;
    const timer = setTimeout(() => {
      // Step A: Disable CSS transitions on base page to prevent 300ms color-fade jumps
      document.documentElement.classList.add("theme-instant-switch");

      // Step B: Update root data-theme behind the fully covered slats
      document.documentElement.setAttribute("data-theme", targetTheme);
      try {
        localStorage.setItem("hazy_theme", targetTheme);
      } catch {
        // Ignore
      }

      // Step C: Double RAF guarantees browser computes styles & repaints base DOM before removing overlay
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          onComplete();
          document.documentElement.classList.remove("theme-instant-switch");
          if (lenis && typeof lenis.start === "function") {
            lenis.start();
          }
        });
      });
    }, fullSlatDuration);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      document.documentElement.classList.remove("theme-instant-switch");
      if (lenis && typeof lenis.start === "function") {
        lenis.start();
      }
    };
  }, [scrollY, targetTheme, onComplete]);

  const isTargetLight = targetTheme === "light";

  // Motion dynamics:
  // Dark -> Light: Slats slide up from bottom to top (translate3d(0, 100%, 0) -> translate3d(0, 0%, 0))
  // Light -> Dark: Slats slide down from top to bottom (translate3d(0, -100%, 0) -> translate3d(0, 0%, 0))
  const outerInitial = isTargetLight ? "translate3d(0, 100%, 0)" : "translate3d(0, -100%, 0)";
  const innerInitial = isTargetLight ? "translate3d(0, -100%, 0)" : "translate3d(0, 100%, 0)";
  const outerFinal = "translate3d(0, 0%, 0)";
  const innerFinal = "translate3d(0, 0%, 0)";

  const laserColor = isTargetLight ? "#059669" : "#8cff2e";
  const glowShadow = isTargetLight
    ? "0 0 16px rgba(5, 150, 105, 0.6), 0 0 32px rgba(5, 150, 105, 0.3)"
    : "0 0 16px rgba(140, 255, 46, 0.6), 0 0 32px rgba(140, 255, 46, 0.3)";

  return (
    <div
      id="theme-transition-overlay"
      className="fixed inset-0 z-[9998] pointer-events-none select-none overflow-hidden"
      style={{ contain: "paint layout" }}
      aria-hidden="true"
    >
      <div className="grid grid-cols-5 w-full h-full">
        {[0, 1, 2, 3, 4].map((colIndex) => {
          const delayMs = colIndex * 70;
          return (
            <div
              key={colIndex}
              className="relative h-full overflow-hidden"
              style={{
                transform: isAnimating ? outerFinal : outerInitial,
                transition: `transform 850ms cubic-bezier(0.76, 0, 0.24, 1) ${delayMs}ms`,
                willChange: "transform",
                backfaceVisibility: "hidden",
                contain: "paint layout",
              }}
            >
              {/* 
                Stationary Inner Viewport Mirror:
                - Width is 100vw, shifted left by colIndex * 20vw to align with the screen.
                - Counter-translated to lock all cloned typography & layout elements to screen coordinates.
                - data-theme is set to targetTheme to render CSS variables in the destination palette.
              */}
              <div
                ref={(el) => {
                  innerRefs.current[colIndex] = el;
                }}
                data-theme={targetTheme}
                className="absolute top-0 h-screen w-screen bg-[var(--bg-primary)] text-[var(--text-primary)]"
                style={{
                  left: `-${colIndex * 20}vw`,
                  transform: isAnimating ? innerFinal : innerInitial,
                  transition: `transform 850ms cubic-bezier(0.76, 0, 0.24, 1) ${delayMs}ms`,
                  willChange: "transform",
                  backfaceVisibility: "hidden",
                  contain: "paint layout",
                }}
              />

              {/* Slat Leading Edge Laser Highlight */}
              <div
                className={`laser-edge absolute left-0 right-0 h-[2px] z-50 pointer-events-none ${
                  isTargetLight ? "top-0" : "bottom-0"
                }`}
                style={{
                  backgroundColor: laserColor,
                  color: laserColor,
                  boxShadow: glowShadow,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
