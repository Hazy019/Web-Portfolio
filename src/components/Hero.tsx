"use client";

/**
 * Hero — Clipped One-Time Entrance Headline & Global Container Alignment (§1 & §3)
 *
 * Container: max-w-[1280px] mx-auto px-6 md:px-12 w-full
 * Headline Entrance: One-time kinetic clipped reveal (y: 100% -> 0%, opacity: 0 -> 1)
 * Cursor: Static green blinking terminal cursor (| / ▍ animate-pulse)
 * CTAs: Spring physics hover interactions
 */

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate, useInView } from "framer-motion";
import { gsap } from "gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ArrowRight, Github, Code2, FolderGit2, ShieldCheck } from "lucide-react";
import { FitText } from "./FitText";

interface CounterProps {
  target: number;
  label: string;
  sublabel?: string;
  showPlus?: boolean;
  icon?: React.ReactNode;
}

function Counter({ target, label, sublabel, showPlus = true, icon }: CounterProps) {
  const count = useMotionValue(0);
  // Write directly to a DOM ref inside the animation loop to bypass React re-renders.
  // Previously: setState(Math.round(latest)) on every RAF tick = ~240 React updates/sec
  // per counter, 4 counters = ~480 React updates/sec clogging the reconciler during scroll.
  const displayRef = useRef<HTMLSpanElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView || target === 0) return;
    if (reducedMotion) {
      if (displayRef.current) displayRef.current.textContent = String(target);
      return;
    }

    const controls = animate(count, [0, target], {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1] as const,
      onUpdate: (latest) => {
        // Direct DOM mutation — no React state, no reconciliation, no re-renders
        if (displayRef.current) {
          displayRef.current.textContent = String(Math.round(latest));
        }
      },
    });

    return () => controls.stop();
  }, [count, isInView, target, reducedMotion]);

  return (
    <div
      ref={ref}
      className="p-4 sm:p-6 rounded-2xl bg-[#12151E] border border-white/5 hover:border-white/20 transition-all duration-300 backdrop-blur-md group shadow-xl"
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <span className="text-[11px] sm:text-xs font-mono text-[#94A3B8] group-hover:text-white transition-colors truncate">
          {label}
        </span>
        {icon && <div className="text-slate-500 group-hover:text-[#8cff2e] transition-colors shrink-0">{icon}</div>}
      </div>

      <div className="font-display text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-mono tracking-tight flex items-baseline gap-1">
        {/* Initial value shown server-side; JS overwrites via ref after animation starts */}
        <span ref={displayRef}>{reducedMotion ? target : 0}</span>
        {showPlus && <span className="text-[#8cff2e] text-xl sm:text-2xl font-light">+</span>}
      </div>

      {sublabel && (
        <div className="text-[10px] sm:text-[11px] font-mono text-slate-400 mt-1 tracking-wide uppercase truncate">
          {sublabel}
        </div>
      )}
    </div>
  );
}

interface GitHubUserData {
  public_repos: number;
  created_year: number;
  total_commits: number;
}

export function Hero() {
  const reducedMotion = useReducedMotion();
  const [githubStats, setGithubStats] = useState<GitHubUserData>({
    public_repos: 12,
    created_year: 2024,
    total_commits: 250,
  });

  const word1Ref = useRef<HTMLDivElement>(null);
  const word2Ref = useRef<HTMLDivElement>(null);
  const word3Ref = useRef<HTMLDivElement>(null);
  const valuePropRef = useRef<HTMLDivElement>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);

  // Fetch Live GitHub API Stats
  // Note: { cache: "no-cache" } removed — browser HTTP cache is now respected.
  // The server-side ISR (revalidate: 86400) in /api/github/route.ts ensures
  // data is fresh from the CDN edge on cache hits in <15ms.
  useEffect(() => {
    async function fetchGitHubData() {
      try {
        const res = await fetch("/api/github");
        if (res.ok) {
          const data = await res.json();
          setGithubStats({
            public_repos: data.public_repos || 12,
            created_year: data.created_year || 2024,
            total_commits: data.total_commits || 250,
          });
        }
      } catch {
        // Fallback default values already set in useState initial state
      }
    }
    fetchGitHubData();
  }, []);

  // One-time kinetic entrance reveal for clipped headline words (y: 100% -> 0%, opacity: 0 -> 1)
  useEffect(() => {
    if (reducedMotion) return;

    const wordEls = [word1Ref.current, word2Ref.current, word3Ref.current];
    const supportingEls = [valuePropRef.current, statsContainerRef.current];

    gsap.set(wordEls, { opacity: 0, y: "100%" });
    gsap.set(supportingEls, { opacity: 0, y: 24 });

    gsap.to(wordEls, {
      opacity: 1,
      y: "0%",
      duration: 0.85,
      stagger: 0.12,
      ease: "power3.out",
      delay: 0.15,
    });

    gsap.to(supportingEls, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      stagger: 0.15,
      ease: "power2.out",
      delay: 0.55,
    });
  }, [reducedMotion]);

  return (
    <section
      id="intro"
      className="relative min-h-[90vh] flex flex-col justify-center py-24 sm:py-32 overflow-hidden bg-[#07090E] select-none scroll-mt-24"
    >
      {/* Static subtle radial background bloom behind headline (opacity: 0.15) */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 65%)",
          filter: "blur(70px)",
        }}
      />

      {/* Strict Global Container Wrapper */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 w-full space-y-12">
        {/* Status Telemetry Header (§35) */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-xs font-mono text-[#8cff2e] tracking-widest uppercase flex items-center gap-2">
            <span>[ STATUS // OPEN TO OPPORTUNITIES ]</span>
          </div>
          <span className="text-xs font-mono text-[#94A3B8] hidden sm:inline">
            // Philippines · UTC+8
          </span>
        </div>

        {/* Primary Headline with Clipped Word Entrance & Auto-Fitting Kinetic Typography */}
        <div
          className="space-y-2 font-display text-5xl sm:text-7xl md:text-8xl lg:text-[6.8rem] font-extrabold tracking-tight leading-[0.94] text-white"
        >
          {/* Clipped Line 1 */}
          <FitText containerClassName="overflow-hidden" minFontSize={18}>
            <div ref={word1Ref}>Building</div>
          </FitText>

          {/* Clipped Line 2 */}
          <FitText containerClassName="overflow-hidden" minFontSize={18}>
            <div ref={word2Ref} className="text-white/90 italic">Systems</div>
          </FitText>

          {/* Clipped Line 3 + Static Blinking Terminal Cursor */}
          <FitText containerClassName="overflow-hidden" minFontSize={16}>
            <div ref={word3Ref} className="flex items-center">
              <span>Thoughtfully.</span>
              <span className="text-[#8cff2e] animate-pulse ml-2 sm:ml-3 font-normal text-[0.85em]">▍</span>
            </div>
          </FitText>
        </div>

        {/* 2-Line Value Proposition & Sleek CTA Button Pair */}
        <div
          ref={valuePropRef}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end pt-2"
        >
          <p className="md:col-span-8 text-slate-400 text-sm sm:text-base md:text-lg leading-[1.65] font-normal">
            I build systems the way architects design buildings —{""}            
            <strong className="text-white/80 font-medium border-b border-white/20 pb-0.5">
              failure modes first
            </strong>
            , elegance second. Fresh CS graduate with production deployments in government infrastructure, automation pipelines, and security-first web apps.
          </p>

          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3">
            {/* Sleek CTA Button with Spring Physics Hover */}
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="px-8 py-4 rounded-xl bg-white text-[#07090E] font-mono font-bold text-base transition-all shadow-xl hover:bg-[#8cff2e] text-center flex items-center justify-center gap-2 group"
            >
              <span>Explore Work</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="px-8 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono font-semibold text-sm transition-all text-center hover:border-white/30"
            >
              [ Let&apos;s Talk ]
            </motion.a>
          </div>
        </div>

        {/* Live GitHub & Systems Stats Quartet */}
        <div
          ref={statsContainerRef}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t border-white/10"
        >
          <Counter
            target={githubStats.public_repos}
            label="PUBLIC REPOS"
            sublabel="FETCHED VIA GITHUB API"
            icon={<FolderGit2 className="w-4 h-4" />}
          />
          <Counter
            target={6}
            label="CORE PROJECTS"
            sublabel="CURATED SHIPPED TOTAL"
            icon={<Code2 className="w-4 h-4" />}
          />
          <Counter
            target={githubStats.created_year}
            label="CODING SINCE"
            sublabel="GITHUB ACCOUNT CREATED"
            showPlus={false}
            icon={<Github className="w-4 h-4" />}
          />
          <Counter
            target={githubStats.total_commits}
            label="PUBLIC COMMITS"
            sublabel="FETCHED VIA GITHUB API"
            icon={<ShieldCheck className="w-4 h-4" />}
          />
        </div>

        {/* Scroll Nudge Prompt (§7) */}
        <div className="pt-6 font-mono text-[11px] text-[#94A3B8]/60 uppercase tracking-widest flex items-center justify-center gap-2">
          <span>[</span>
          <span className="animate-pulse">scroll to continue</span>
          <span>]</span>
        </div>
      </div>
    </section>
  );
}
