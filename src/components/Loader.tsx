"use client";

/**
 * Loader — 5-Column Slat Curtain Reveal & Paced Counter (§2)
 *
 * Pacing: Smooth deterministic counter 0% -> 100% (max 1.5s fallback).
 * Exit Curtain Reveal: 5 vertical column slats slide up sequentially from left to right.
 * Duration: 1.0s per slat (cubic-bezier(0.76, 0, 0.24, 1)), staggered by 80ms per column.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CYCLING_TERMS = ["BUILD", "ARCHITECT", "SYSTEMS", "THOUGHTFULLY"];

interface LoaderProps {
  onComplete: () => void;
}

export function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Check session storage flag for repeat visits
    if (typeof window !== "undefined") {
      const visited = sessionStorage.getItem("hazy_visited");
      if (visited) {
        setIsHidden(true);
        onComplete();
        return;
      }
    }

    const startTime = Date.now();
    const DURATION = 1200; // 1.2s counter progression

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / DURATION) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsExiting(true);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("hazy_visited", "true");
          }
          // 1000ms duration + 4 * 80ms stagger = 1320ms exit curtain animation
          setTimeout(() => {
            setIsHidden(true);
            onComplete();
          }, 1350);
        }, 200);
      }
    }, 25);

    // Hard fallback safety timer at 1.5s max
    const fallbackTimer = setTimeout(() => {
      setProgress(100);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(fallbackTimer);
    };
  }, [onComplete]);

  if (isHidden) return null;

  const currentTermIndex = Math.min(
    Math.floor((progress / 100) * CYCLING_TERMS.length),
    CYCLING_TERMS.length - 1
  );

  return (
    <div
      id="loader"
      className="fixed inset-0 z-[9999] pointer-events-auto select-none overflow-hidden"
    >
      {/* ── 5-Column Vertical Slat Curtain Reveal Mask ─────────────────── */}
      <div className="absolute inset-0 grid grid-cols-5">
        {[0, 1, 2, 3, 4].map((colIndex) => (
          <div
            key={colIndex}
            className={`w-full h-full bg-[#07090E] transition-transform duration-[1000ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
              isExiting ? "-translate-y-full" : "translate-y-0"
            }`}
            style={{
              transitionDelay: isExiting ? `${colIndex * 80}ms` : "0ms",
            }}
          />
        ))}
      </div>

      {/* ── Loader Content Overlay (Top-Right Counter & Bottom-Left Terms) ──── */}
      <div
        className={`relative z-10 w-full h-full max-w-[1280px] mx-auto px-6 md:px-12 py-12 sm:py-16 flex flex-col justify-between transition-opacity duration-300 ${
          isExiting ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Top-Right: Minimalist Percentage Counter */}
        <div className="self-end text-right">
          <div className="font-mono text-5xl sm:text-7xl font-extrabold text-white tracking-tighter tabular-nums">
            {String(progress).padStart(3, "0")}
            <span className="text-[#8cff2e] text-3xl sm:text-5xl font-light ml-1">%</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 tracking-widest uppercase mt-1">
            [ LOADING HAZY // {progress < 100 ? "IN_PROGRESS" : "COMPLETE"} ]
          </div>
        </div>

        {/* Bottom-Left: Cycling Terms */}
        <div className="self-start space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8cff2e] tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8cff2e] animate-pulse" />
            <span>STATE: {CYCLING_TERMS[currentTermIndex]}</span>
          </div>
          <div className="overflow-hidden h-12 sm:h-16">
            <motion.div
              key={currentTermIndex}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase"
            >
              {CYCLING_TERMS[currentTermIndex]}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
