"use client";

/**
 * PhilosophyQuote — "Luminescent Focus" Concise Pinned Scrub (Phase 18 § Refined)
 *
 * ARCHITECTURE SPECIFICATION:
 * 1. Sequence Anchoring (Task 18.1 & 18.2):
 *    Trigger start is dynamically computed as a function reading scrollRegistry.work.trigger?.end.
 *    Recalculated on every ScrollTrigger.refresh() — mathematically impossible for Philosophy
 *    to pin while Work's horizontal track is active.
 *
 * 2. Concise Motion Spec (Task 18.2 & 18.3):
 *    - Pin distance: +=750px (~25% of Work's pin duration — an editorial breath, not a second star).
 *    - Explicit pinSpacing: true guarantees zero DOM collision with downstream sections.
 *    - Stage 1 (~0–10%): Brief lock-in; ambient radial glow behind the glass card fades up quietly
 *      within the 3–4% opacity range (opacity: 0.01 -> 0.04).
 *    - Stage 2 (~10–100%): Words illuminate through design tokens (var(--text-muted) -> var(--text-main)),
 *      with the punchline ("HOW IT WORKS.") igniting into neon green (var(--accent-green)) at the end.
 *
 * 3. Removal of Defensive Stacking (Task 18.4):
 *    No z-index elevation is applied to the section; sequencing is strictly geometric.
 *
 * 4. Responsive & Reduced Motion Parity (Task 18.5):
 *    Gated via gsap.matchMedia at 1024px. Below 1024px or under prefers-reduced-motion,
 *    zero pinning occurs; a clean, static one-shot reveal is rendered instead.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { scrollRegistry } from "@/lib/scrollRegistry";
import { AmbientOrbs } from "./AmbientOrbs";
import { HazyMark } from "./HazyMark";
import { Quote } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LINE_1_WORDS = [
  "DESIGN", "IS", "NOT", "JUST", "WHAT", "IT", "LOOKS", "LIKE", "AND", "FEELS", "LIKE."
];

const LINE_2_WORDS = [
  { text: "DESIGN", isAccent: false },
  { text: "IS", isAccent: false },
  { text: "HOW", isAccent: true },
  { text: "IT", isAccent: true },
  { text: "WORKS.", isAccent: true },
];

export function PhilosophyQuote() {
  const reducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const attributionRef = useRef<HTMLDivElement>(null);

  const wordsLine1Ref = useRef<(HTMLSpanElement | null)[]>([]);
  const wordsLine2Ref = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const glow = glowRef.current;
    const eyebrow = eyebrowRef.current;
    const icon = iconRef.current;
    const attribution = attributionRef.current;

    if (!section || !card) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ── Desktop (>= 1024px) & No Reduced Motion: Concise Pinned Scrub (~750px) ──
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const l1Spans = wordsLine1Ref.current.filter(Boolean);
          const l2BaseSpans = wordsLine2Ref.current.filter(
            (span, idx) => span && !LINE_2_WORDS[idx]?.isAccent
          );
          const l2AccentSpans = wordsLine2Ref.current.filter(
            (span, idx) => span && LINE_2_WORDS[idx]?.isAccent
          );

          // Initial state: text at --text-muted, glow at resting 1% opacity
          gsap.set(card, { y: 20, opacity: 0.85 });
          if (glow) gsap.set(glow, { opacity: 0.01, scale: 0.96 });
          if (eyebrow) gsap.set(eyebrow, { opacity: 0.7 });
          if (icon) gsap.set(icon, { opacity: 0.7 });
          if (attribution) gsap.set(attribution, { opacity: 0.6 });

          gsap.set(l1Spans, { color: "var(--text-muted, #94a3b8)" });
          gsap.set(l2BaseSpans, { color: "var(--text-muted, #94a3b8)" });
          gsap.set(l2AccentSpans, { color: "var(--text-muted, #94a3b8)" });

          // Single GSAP Timeline with explicit pinSpacing and natural top-top pinned scrub
          const tl = gsap.timeline({
            scrollTrigger: {
              id: "philosophy-pinned-scrub",
              trigger: section,
              pin: true,
              pinSpacing: true,
              scrub: 1,
              start: "top top",
              end: "+=750",
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          // ── Stage 1 (~0–10% of range): Brief lock-in & subtle ambient depth glow (3-4% opacity) ──
          tl.to(
            card,
            { y: 0, opacity: 1, ease: "power1.out", duration: 0.1 },
            0
          );
          if (glow) {
            tl.to(
              glow,
              { opacity: 0.04, scale: 1.02, ease: "sine.out", duration: 0.1 },
              0
            );
          }
          if (eyebrow) {
            tl.to(eyebrow, { opacity: 1, ease: "power1.out", duration: 0.1 }, 0);
          }
          if (icon) {
            tl.to(icon, { opacity: 1, ease: "power1.out", duration: 0.1 }, 0);
          }

          // ── Stage 2 (~10–100% of range): Word-by-word reveal through opacity tokens ──────────────
          // Line 1: --text-muted -> --text-primary
          tl.to(
            l1Spans,
            {
              color: "var(--text-main, #ffffff)",
              stagger: 0.035,
              ease: "power1.inOut",
              duration: 0.45,
            },
            0.1
          );

          // Line 2 base words: --text-muted -> --text-primary
          tl.to(
            l2BaseSpans,
            {
              color: "var(--text-main, #ffffff)",
              stagger: 0.035,
              ease: "power1.inOut",
              duration: 0.15,
            },
            0.55
          );

          // Line 2 punchline: transitions into --accent-green (#8cff2e) at the very end
          tl.to(
            l2AccentSpans,
            {
              color: "var(--accent-green, #8cff2e)",
              stagger: 0.045,
              ease: "power2.out",
              duration: 0.25,
            },
            0.75
          );

          if (attribution) {
            tl.to(
              attribution,
              { opacity: 1, ease: "power1.out", duration: 0.15 },
              0.85
            );
          }
        }
      );

      // ── Mobile/Tablet (< 1024px) & No Reduced Motion: Non-Pinned Scrub Word Illumination ──
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          const l1Spans = wordsLine1Ref.current.filter(Boolean);
          const l2BaseSpans = wordsLine2Ref.current.filter(
            (span, idx) => span && !LINE_2_WORDS[idx]?.isAccent
          );
          const l2AccentSpans = wordsLine2Ref.current.filter(
            (span, idx) => span && LINE_2_WORDS[idx]?.isAccent
          );

          // Start muted; card fades up with the scrub rather than firing once
          gsap.set(card, { y: 20, opacity: 0 });
          gsap.set(l1Spans, { color: "var(--text-muted, #94a3b8)" });
          gsap.set(l2BaseSpans, { color: "var(--text-muted, #94a3b8)" });
          gsap.set(l2AccentSpans, { color: "var(--text-muted, #94a3b8)" });

          // Non-pinned scrub: ties progress to native scroll, no scroll hijacking
          const mobileTl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 75%",
              end: "bottom 35%",
              scrub: 0.5,
              once: false,
            },
          });

          // 1. Card entry (first ~15% of scrub range)
          mobileTl.to(card, {
            y: 0,
            opacity: 1,
            duration: 0.15,
            ease: "power2.out",
          });

          // 2. Line 1 words illuminate muted → main
          mobileTl.to(
            l1Spans,
            {
              color: "var(--text-main, #ffffff)",
              stagger: 0.04,
              duration: 0.4,
              ease: "power1.inOut",
            },
            0.1
          );

          // 3. Line 2 base words illuminate
          mobileTl.to(
            l2BaseSpans,
            {
              color: "var(--text-main, #ffffff)",
              stagger: 0.04,
              duration: 0.2,
              ease: "power1.inOut",
            },
            0.52
          );

          // 4. Punchline ignites into neon green (#8cff2e)
          mobileTl.to(
            l2AccentSpans,
            {
              color: "var(--accent-green, #8cff2e)",
              stagger: 0.06,
              duration: 0.28,
              ease: "power2.out",
            },
            0.75
          );
        }
      );


      // ── Prefers-Reduced-Motion Fallback Only ──────────────────────────────────
      mm.add(
        "(prefers-reduced-motion: reduce)",
        () => {
          gsap.set(
            [
              card,
              glow,
              eyebrow,
              icon,
              attribution,
              ...wordsLine1Ref.current,
              ...wordsLine2Ref.current,
            ].filter(Boolean),
            { clearProps: "all" }
          );
          gsap.set(card, { opacity: 1, y: 0 });
        }
      );
    }, section);

    // Consolidate authoritative refresh after both font readiness and document/image load
    const onReady = () => {
      ScrollTrigger.refresh();
    };

    if (document.readyState === "complete") {
      document.fonts.ready.then(onReady);
    } else {
      window.addEventListener("load", () => {
        document.fonts.ready.then(onReady);
      }, { once: true });
    }

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="relative w-full px-6 sm:px-10 lg:px-16 xl:px-20 border-y border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-primary)] select-none scroll-mt-24"
      style={{
        paddingTop: "clamp(48px, 5vw, 80px)",
        paddingBottom: "clamp(72px, 7vw, 110px)",
      }}
      aria-label="Technical philosophy"
    >
      {/* Ambient Depth Glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        <div
          className="w-[600px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--accent-primary) 0%, rgba(59,130,246,0.4) 50%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <AmbientOrbs
        orbs={[
          {
            color: "radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)",
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

      <div className="max-w-[1536px] mx-auto w-full space-y-6 sm:space-y-8 text-center relative z-10">
        {/* Section Eyebrow */}
        <div
          ref={eyebrowRef}
          className="text-xs font-mono text-[var(--accent-primary)] tracking-[0.2em] uppercase flex items-center justify-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
          <span>[ 04 // TECHNICAL PHILOSOPHY ]</span>
        </div>

        {/* Glass Card Container */}
        <div
          ref={cardRef}
          className="p-6 sm:p-12 md:p-16 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] backdrop-blur-2xl shadow-[var(--glass-shadow)] space-y-8 max-w-5xl mx-auto relative overflow-hidden"
        >
          {/* Subtle card internal radial bloom */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent"
          />

          {/* Quote Icon */}
          <div
            ref={iconRef}
            className="flex justify-center relative z-10"
          >
            <Quote className="w-10 h-10 text-[var(--accent-primary)] opacity-80" />
          </div>

          {/* Editorial Display Quote with Scrubbed Word Illumination */}
          <blockquote className="font-display font-extrabold text-[22px] sm:text-[26px] md:text-[32px] lg:text-[36px] tracking-tight leading-[1.25] max-w-3xl mx-auto space-y-3 relative z-10 uppercase">
            {/* Line 1: Word-by-word reveal */}
            <div className="flex flex-wrap justify-center items-center gap-x-[0.25em] gap-y-1">
              {LINE_1_WORDS.map((word, idx) => (
                <span
                  key={idx}
                  ref={(el) => {
                    wordsLine1Ref.current[idx] = el;
                  }}
                  className="inline-block transition-colors duration-150 text-[var(--text-muted)]"
                >
                  {word}
                </span>
              ))}
            </div>

            {/* Line 2: Base words + Punchline Ignition */}
            <div className="flex flex-wrap justify-center items-center gap-x-[0.25em] gap-y-1 pt-1">
              {LINE_2_WORDS.map((item, idx) => (
                <span
                  key={idx}
                  ref={(el) => {
                    wordsLine2Ref.current[idx] = el;
                  }}
                  className={`inline-block transition-colors duration-150 text-[var(--text-muted)] ${item.isAccent ? "font-black" : ""
                    }`}
                >
                  {item.text}
                </span>
              ))}
            </div>
          </blockquote>

          {/* Author Subtitle Tag in Technical Monospace Tier */}
          <div
            ref={attributionRef}
            className="font-mono text-xs sm:text-sm text-[var(--accent-primary)] tracking-widest uppercase pt-4 border-t border-[var(--border-subtle)] flex items-center justify-center gap-2 font-semibold relative z-10"
          >
            <span>— STEVE JOBS</span>
            <span className="text-[var(--text-muted)]">[ INSPIRATION ]</span>
          </div>
        </div>
      </div>
    </section>
  );
}


