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
      className="p-4 sm:p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 transition-all duration-300 backdrop-blur-md group shadow-[var(--glass-shadow)]"
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <span className="text-[11px] sm:text-xs font-mono text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors truncate">
          {label}
        </span>
        {icon && <div className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors shrink-0">{icon}</div>}
      </div>

      <div className="font-display text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] font-mono tracking-tight flex items-baseline gap-1">
        {/* Initial value shown server-side; JS overwrites via ref after animation starts */}
        <span ref={displayRef}>{reducedMotion ? target : 0}</span>
        {showPlus && <span className="text-[var(--accent-primary)] text-xl sm:text-2xl font-light">+</span>}
      </div>

      {sublabel && (
        <div className="text-[10px] sm:text-[11px] font-mono text-[var(--text-muted)] mt-1 tracking-wide uppercase truncate">
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

  // Fetch Live GitHub API Stats with clean abort on unmount/re-render
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchGitHubData() {
      try {
        const res = await fetch("/api/github", { signal: controller.signal });
        if (res.ok && isMounted) {
          const data = await res.json();
          setGithubStats({
            public_repos: data.public_repos || 12,
            created_year: data.created_year || 2024,
            total_commits: data.total_commits || 250,
          });
        }
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          // Fallback default values already set in useState initial state
        }
      }
    }
    fetchGitHubData();

    return () => {
      isMounted = false;
      controller.abort();
    };
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
      className="relative min-h-[90vh] flex flex-col justify-center py-24 sm:py-32 overflow-hidden bg-[var(--bg-primary)] select-none scroll-mt-24"
    >
      {/* Strict Global Container Wrapper */}
      <div className="relative z-10 max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 w-full space-y-12">
        {/* Eyebrow Index Anchor */}
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: -10 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 text-xs font-mono text-[var(--accent-primary)] uppercase tracking-[0.2em]"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)] animate-pulse" />
          <span>[ 01 // KYRELL SANTILLAN — SYSTEMS ARCHITECT & DEVELOPER ]</span>
        </motion.div>

        {/* Primary Headline: The Undisputed Focal Point */}
        <div
          className="space-y-1 sm:space-y-2 font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.8rem] xl:text-[6.4rem] font-extrabold tracking-tight leading-[0.94] text-[var(--text-primary)]"
        >
          {/* Clipped Line 1 */}
          <div className="overflow-hidden">
            <div ref={word1Ref}>Building</div>
          </div>

          {/* Clipped Line 2 */}
          <div className="overflow-hidden">
            <div ref={word2Ref} className="italic opacity-90">Systems</div>
          </div>

          {/* Clipped Line 3 + Static Blinking Terminal Cursor */}
          <div className="overflow-hidden">
            <div ref={word3Ref} className="flex items-center">
              <span>Precise.</span>
              <span className="text-[var(--accent-primary)] animate-pulse ml-2 sm:ml-3 font-normal text-[0.85em]">▍</span>
            </div>
          </div>
        </div>

        {/* Human Narrative & Value Proposition Grid */}
        <div
          ref={valuePropRef}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-end pt-2"
        >
          <div className="md:col-span-8 space-y-3 sm:space-y-4">
            <p className="text-[var(--text-secondary)] text-base sm:text-lg md:text-xl lg:text-[1.35rem] leading-[1.65] font-normal">
              I&apos;m <strong className="text-[var(--text-primary)] font-semibold">Kyrell Santillan</strong> — a Computer Science graduate and software engineer from the Philippines. I build digital architectures the way architects engineer buildings:{" "}
              <strong className="text-[var(--text-primary)] font-medium border-b border-[var(--accent-primary)]/40 pb-0.5">
                failure modes first, elegance second
              </strong>
              . Specializing in high-throughput cloud automations, serverless infrastructure, resilient distributed tools, and interactive WebGL experiences.
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3">
            {/* Sleek CTA Button with Spring Physics Hover */}
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="px-8 py-4 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent-primary)] hover:text-white font-mono font-bold text-base transition-all shadow-xl text-center flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Explore Work</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="px-8 py-3.5 rounded-xl border border-[var(--border-subtle)] bg-white/5 hover:bg-white/10 text-[var(--text-primary)] font-mono font-semibold text-sm transition-all text-center hover:border-[var(--accent-primary)]/40 cursor-pointer"
            >
              [ Let&apos;s Talk ]
            </motion.a>
          </div>
        </div>

        {/* Live GitHub & Systems Stats Quartet */}
        <div
          ref={statsContainerRef}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t border-[var(--border-subtle)]"
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

        {/* Scroll Nudge Prompt */}
        <div className="pt-6 font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-widest flex items-center justify-center gap-2">
          <span>[</span>
          <span className="animate-pulse">scroll to continue</span>
          <span>]</span>
        </div>
      </div>
    </section>
  );
}
