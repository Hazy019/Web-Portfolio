"use client";

/**
 * PhilosophyQuote — Scroll-Triggered Reveal Quote (§1-2 v10)
 *
 * Architecture: Uses Framer Motion whileInView / IntersectionObserver (NO GSAP ScrollTrigger)
 * to avoid document-height math conflicts with the upstream pinned Projects carousel.
 * Card Container: Glass Surface (padding 48px md:64px, bg rgba(13,16,23,0.8), backdrop-blur-2xl, border 1px solid rgba(255,255,255,0.1)).
 * Motion Spec: 100ms stagger, 750ms duration, cubic-bezier(0.16, 1, 0.3, 1) easing.
 */

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { AmbientOrbs } from "./AmbientOrbs";
import { HazyMark } from "./HazyMark";
import { Quote } from "lucide-react";

const QUOTE_LINES = [
  { text: "DESIGN IS NOT JUST WHAT IT LOOKS LIKE AND FEELS LIKE.", accent: [] as string[] },
  { text: "DESIGN IS HOW IT WORKS.", accent: ["HOW", "WORKS."] },
];

export function PhilosophyQuote() {
  const reducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const eyebrowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const lineVariants = {
    hidden: { opacity: 0, y: "100%" },
    visible: {
      opacity: 1,
      y: "0%",
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const attributionVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="philosophy"
      className="relative w-full py-[80px] lg:py-[140px] px-6 lg:px-12 border-y border-white/10 overflow-hidden bg-slate-950/40 flex items-center justify-center select-none z-10 min-h-[60vh]"
      aria-label="Technical philosophy"
    >
      {/* Faint radial glow depth background (2-3% opacity) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        <div
          className="w-[600px] h-[400px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, rgba(140,255,46,1) 0%, rgba(59,130,246,0.5) 50%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <AmbientOrbs
        orbs={[
          {
            color: "radial-gradient(circle, rgba(140,255,46,1) 0%, transparent 70%)",
            size: "800px",
            top: "-30%",
            left: "50%",
            opacity: 0.09,
            delay: "-10s",
          },
          {
            color: "radial-gradient(circle, rgba(139,92,246,1) 0%, transparent 70%)",
            size: "500px",
            bottom: "-20%",
            right: "10%",
            opacity: 0.08,
            delay: "-35s",
          },
        ]}
      />

      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <HazyMark size={400} opacity={0.04} parallax={false} decorative={true} />
      </div>

      <motion.div
        variants={reducedMotion ? undefined : containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="max-w-[1100px] mx-auto px-6 md:px-12 w-full space-y-10 text-center relative z-10"
      >
        {/* Section Eyebrow */}
        <motion.div
          variants={reducedMotion ? undefined : eyebrowVariants}
          className="text-xs font-mono text-[#8cff2e] tracking-[0.3em] uppercase flex items-center justify-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#8cff2e] animate-pulse" />
          <span>[ 04 // TECHNICAL PHILOSOPHY ]</span>
        </motion.div>

        {/* Glass Card Container (Depth & Grain overlay) */}
        <motion.div
          variants={reducedMotion ? undefined : cardVariants}
          className="p-8 sm:p-12 md:p-16 rounded-2xl border border-white/10 bg-[#0d1017]/80 backdrop-blur-2xl shadow-2xl space-y-8 max-w-4xl mx-auto relative overflow-hidden"
        >
          {/* Subtle card internal radial glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent"
          />

          {/* Quote Icon */}
          <motion.div variants={reducedMotion ? undefined : iconVariants} className="flex justify-center relative z-10">
            <Quote className="w-10 h-10 text-[#8cff2e]/80" />
          </motion.div>

          {/* 24px–28px High-Contrast White Italic Quote with Masked Line Reveal */}
          <blockquote className="font-serif italic font-light text-[22px] sm:text-[25px] md:text-[28px] text-[#FFFFFF] tracking-tight leading-relaxed max-w-3xl mx-auto space-y-3 relative z-10">
            {QUOTE_LINES.map((lineObj, lineIdx) => (
              <div key={lineIdx} className="overflow-hidden py-1">
                <motion.div
                  variants={reducedMotion ? undefined : lineVariants}
                  className="inline-block"
                >
                  {lineObj.text.split(" ").map((word, wIdx) => {
                    const isAccent = lineObj.accent.includes(word);
                    return (
                      <span
                        key={wIdx}
                        className={`inline-block mr-[0.25em] ${
                          isAccent ? "text-[#8cff2e] not-italic font-sans font-extrabold" : "text-white"
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </motion.div>
              </div>
            ))}
          </blockquote>

          {/* Author Subtitle Tag in JetBrains Mono Neon Green */}
          <motion.div
            variants={reducedMotion ? undefined : attributionVariants}
            className="font-mono text-xs sm:text-sm text-[#8cff2e] tracking-widest uppercase pt-4 border-t border-white/10 flex items-center justify-center gap-2 font-semibold relative z-10"
          >
            <span>— STEVE JOBS</span>
            <span className="text-white/60">[ INSPIRATION ]</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

