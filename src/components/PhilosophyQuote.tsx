"use client";

/**
 * PhilosophyQuote — Upgraded Recommendation / Philosophy Card & Word-Scrub Reveal (§4)
 *
 * Section Padding: py-[80px] lg:py-[140px] (140px desktop / 80px mobile equity spacing).
 * Card Container: Glass Surface (padding 48px md:64px, bg rgba(13,16,23,0.7), backdrop-blur-xl, border 1px solid rgba(255,255,255,0.08)).
 * Typography: 24px-28px italic serif white (#FFFFFF), author info in JetBrains Mono neon green (#8CFF2E).
 * Motion Entrance: Quote icon scales in (scale: [0, 1]), words scrub/unmask gracefully.
 */

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { AmbientOrbs } from "./AmbientOrbs";
import { HazyMark } from "./HazyMark";
import { Quote } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const QUOTE_LINES = [
  { text: "DESIGN IS NOT JUST WHAT IT LOOKS LIKE AND FEELS LIKE.", accent: [] as string[] },
  { text: "DESIGN IS HOW IT WORKS.", accent: ["HOW", "WORKS."] },
];

export function PhilosophyQuote() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!section || !inner) return;

    const eyebrow = inner.querySelector<HTMLElement>("[data-pq-eyebrow]");
    const wordSpans = inner.querySelectorAll<HTMLElement>("[data-pq-word]");
    const attribution = inner.querySelector<HTMLElement>("[data-pq-attribution]");

    const allElements = [
      ...(eyebrow ? [eyebrow] : []),
      ...Array.from(wordSpans),
      ...(attribution ? [attribution] : []),
    ];

    gsap.set(allElements, { opacity: 0, y: 15 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=200vh",
          pin: true,
          anticipatePin: 1,
          scrub: 1.2,
        },
      });

      tl.to(allElements, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: {
          each: 0.12,
          ease: "power2.out",
        },
        ease: "power2.out",
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="relative py-[80px] lg:py-[140px] px-6 lg:px-12 border-y border-white/10 overflow-hidden bg-slate-950/40 min-h-[90vh] flex items-center justify-center"
      aria-label="Technical philosophy"
    >
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

      <div
        ref={innerRef}
        className="max-w-[1100px] mx-auto px-6 md:px-12 w-full space-y-10 text-center relative z-10"
      >
        {/* Section Eyebrow */}
        <div
          data-pq-eyebrow
          className="text-xs font-mono text-[#8cff2e] tracking-[0.3em] uppercase flex items-center justify-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#8cff2e] animate-pulse" />
          <span>[ 03 // TECHNICAL PHILOSOPHY ]</span>
        </div>

        {/* Glass Card Container (Padding: 48px md:64px, Glass backdrop) */}
        <div className="p-8 sm:p-12 md:p-16 rounded-2xl border border-white/10 bg-[#0d1017]/70 backdrop-blur-xl shadow-2xl space-y-8 max-w-4xl mx-auto relative overflow-hidden">
          {/* Quote Icon with Scale-in Animation */}
          <motion.div
            initial={reducedMotion ? undefined : { scale: 0, opacity: 0 }}
            whileInView={reducedMotion ? undefined : { scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center"
          >
            <Quote className="w-10 h-10 text-[#8cff2e]/80" />
          </motion.div>

          {/* 24px–28px High-Contrast White Italic Quote */}
          <blockquote className="font-serif italic font-light text-[22px] sm:text-[25px] md:text-[28px] text-[#FFFFFF] tracking-tight leading-relaxed max-w-3xl mx-auto space-y-2">
            {QUOTE_LINES.map((lineObj, lineIdx) => (
              <div key={lineIdx} className="block">
                {lineObj.text.split(" ").map((word, wIdx) => {
                  const isAccent = lineObj.accent.includes(word);
                  return (
                    <span
                      key={wIdx}
                      data-pq-word
                      className={`inline-block mr-[0.25em] ${
                        isAccent ? "text-[#8cff2e] not-italic font-sans font-extrabold" : "text-white"
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            ))}
          </blockquote>

          {/* Author Subtitle Tag in JetBrains Mono Neon Green */}
          <div
            data-pq-attribution
            className="font-mono text-xs sm:text-sm text-[#8cff2e] tracking-widest uppercase pt-4 border-t border-white/10 flex items-center justify-center gap-2 font-semibold"
          >
            <span>— STEVE JOBS</span>
            <span className="text-white/60">[ INSPIRATION ]</span>
          </div>
        </div>
      </div>
    </section>
  );
}
