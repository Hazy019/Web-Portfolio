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

const CYCLING_TERMS = ["BUILD", "ARCHITECT", "SYSTEMS", "PRECISE"];

const CRITICAL_CACHE_ASSETS = [
  // ── Project Showcase Mockups (Track & Hero) ──
  "/Shortsautomation_mockup_preview.webp",
  "/Shortsautomation_phone_preview.webp",
  "/Shortsautomation_preview.webp",
  "/DTI_Queue_mockup_preview.webp",
  "/DTI_Queue_phone_preview.webp",
  "/DTI_Queue_preview.webp",
  "/Polycon_mockup_preview.webp",
  "/Polycon_phone_preview.webp",
  "/Polycon_preview.webp",
  "/IDEE-CLI_mockup_preview.webp",
  "/IDEE-CLI_phone_preview.webp",
  "/IDEE-CLI_preview.webp",
  "/SpellGate_mockup_preview.webp",
  "/SpellGate_phone_preview.webp",
  "/SpellGate_preview.webp",
  "/Sentinel_mockup_preview.webp",
  "/Sentinel_phone_preview.webp",
  "/Sentinel_preview.webp",
  "/ClientEcho_mockup_preview.webp",
  "/ClientEcho_phone_preview.webp",
  "/ClientEcho_preview.webp",

  // ── Project & Partner Logos (Light & Dark Variants) ──
  "/Shortsautomation_logo.png",
  "/DTI_Queue_logo.png",
  "/Polycon_logo.png",
  "/IDEE-CLI_logo.png",
  "/SpellGate_logo.png",
  "/SentinelView_logo.png",
  "/SentinelView_logo Dark.png",
  "/ClientEcho_logo.png",
  "/ClientEcho_logo Dark.png",
  "/logo.png",

  // ── Verified Certificates (About Section) ──
  "/Certificate/Foundation of Cybersecurity.png",
  "/Certificate/Play it Safe Mange Security Risks.png",
  "/Certificate/Foundation of User Experience (UX) Design.png",
  "/Certificate/Legacy Responsive Web Design V8.png",
];

interface LoaderProps {
  onComplete: () => void;
}

export function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // 1. Session check for returning users
    if (typeof window !== "undefined") {
      const visited = sessionStorage.getItem("hazy_visited");
      if (visited) {
        setIsHidden(true);
        onComplete();
        return;
      }
    }

    let loadedCount = 0;
    const totalAssets = CRITICAL_CACHE_ASSETS.length;
    let isCompleted = false;

    // 2. Pre-decode all assets into browser GPU memory
    if (typeof window !== "undefined") {
      CRITICAL_CACHE_ASSETS.forEach((src) => {
        const img = new window.Image();
        img.src = src;
        if (typeof img.decode === "function") {
          img
            .decode()
            .then(() => {
              loadedCount++;
            })
            .catch(() => {
              loadedCount++;
            });
        } else {
          img.onload = () => loadedCount++;
          img.onerror = () => loadedCount++;
        }
      });
    }

    const startTime = Date.now();
    const MIN_PACING_DURATION = 1200; // Smooth 1.2s aesthetic pacing

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const timeRatio = Math.min(1, elapsed / MIN_PACING_DURATION);
      const assetRatio = Math.min(1, loadedCount / totalAssets);

      // Progress advances with both time pacing and real asset decoding
      const currentPct = Math.min(
        100,
        Math.floor((timeRatio * 0.5 + assetRatio * 0.5) * 100)
      );

      setProgress((prev) => Math.max(prev, currentPct));

      if (timeRatio >= 1 && (assetRatio >= 0.85 || elapsed > 1600) && !isCompleted) {
        isCompleted = true;
        setProgress(100);
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

    // Hard safety fallback at 2.0s
    const fallbackTimer = setTimeout(() => {
      if (!isCompleted) {
        setProgress(100);
      }
    }, 2000);

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
      className="fixed inset-0 z-[9999] pointer-events-auto select-none overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]"
    >
      {/* ── 5-Column Vertical Slat Curtain Reveal Mask ─────────────────── */}
      <div className="absolute inset-0 grid grid-cols-5 z-0">
        {[0, 1, 2, 3, 4].map((colIndex) => (
          <div
            key={colIndex}
            className={`w-full h-full bg-[var(--bg-primary)] transition-transform duration-[1000ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
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
        className={`relative z-10 w-full h-full p-6 sm:p-8 md:p-12 lg:p-14 xl:p-16 flex flex-col justify-between transition-opacity duration-300 ${
          isExiting ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Top-Right: Minimalist Technical Percentage Counter */}
        <div className="self-end text-right">
          <div className="font-mono text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[5.75rem] 2xl:text-[6.25rem] font-extrabold text-[var(--text-primary)] tracking-tighter tabular-nums leading-none">
            {String(progress).padStart(3, "0")}
            <span className="text-[var(--accent-primary)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light ml-1 sm:ml-2">
              %
            </span>
          </div>
          <div className="text-[10px] sm:text-xs md:text-sm font-mono text-[var(--text-muted)] tracking-[0.2em] uppercase mt-2 sm:mt-3 font-medium">
            [ LOADING HAZY //{" "}
            <span className={progress >= 100 ? "text-[var(--accent-primary)] font-semibold" : "text-[var(--text-primary)]"}>
              {progress < 100 ? "IN_PROGRESS" : "COMPLETE"}
            </span>{" "}
            ]
          </div>
        </div>

        {/* Bottom-Left: Cycling Terms */}
        <div className="self-start space-y-2 sm:space-y-2.5">
          <div className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-mono text-[var(--accent-primary)] tracking-[0.2em] uppercase font-semibold">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)] animate-pulse" />
            <span>STATE: {CYCLING_TERMS[currentTermIndex]}</span>
          </div>
          <div className="overflow-hidden h-10 sm:h-14 md:h-18 lg:h-20 xl:h-24 flex items-center">
            <motion.div
              key={currentTermIndex}
              initial={{ y: 35, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -35, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.75rem] 2xl:text-[5.25rem] font-extrabold text-[var(--text-primary)] tracking-tight uppercase whitespace-nowrap leading-none"
            >
              {CYCLING_TERMS[currentTermIndex]}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
