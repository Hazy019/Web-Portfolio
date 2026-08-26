"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS, ProjectData } from "@/lib/projectsData";
import { scrollRegistry } from "@/lib/scrollRegistry";
import { AmbientOrbs } from "./AmbientOrbs";
import {
  ArrowUpRight,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Code2,
  Server,
  Database,
  Cloud,
  Zap,
  Layers,
  Activity,
  GitBranch,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export function TechIcon({ name }: { name: string }) {
  const lower = name.toLowerCase();
  if (lower.includes("python") || lower.includes("ink") || lower.includes("cli"))
    return <Terminal className="w-3.5 h-3.5 shrink-0 text-[#8cff2e]" />;
  if (lower.includes("react") || lower.includes("remotion") || lower.includes("docker"))
    return <Layers className="w-3.5 h-3.5 shrink-0 text-cyan-400" />;
  if (lower.includes("next") || lower.includes("vite"))
    return <Zap className="w-3.5 h-3.5 shrink-0 text-amber-400" />;
  if (lower.includes("node") || lower.includes("express") || lower.includes("flask") || lower.includes("fastapi"))
    return <Server className="w-3.5 h-3.5 shrink-0 text-emerald-400" />;
  if (lower.includes("sql") || lower.includes("prisma") || lower.includes("database") || lower.includes("supabase"))
    return <Database className="w-3.5 h-3.5 shrink-0 text-blue-400" />;
  if (lower.includes("aws") || lower.includes("lambda") || lower.includes("s3") || lower.includes("cloud"))
    return <Cloud className="w-3.5 h-3.5 shrink-0 text-amber-400" />;
  if (lower.includes("socket") || lower.includes("webhook") || lower.includes("edge"))
    return <Activity className="w-3.5 h-3.5 shrink-0 text-purple-400" />;
  if (lower.includes("git"))
    return <GitBranch className="w-3.5 h-3.5 shrink-0 text-rose-400" />;
  return <Code2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />;
}

interface WorkProps {
  onOpenDoc: (projectId: string) => void;
  onHoverProject?: (project: ProjectData | null) => void;
}

export function Work({ onOpenDoc }: WorkProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const isNavigatingRef = useRef(false);
  const navTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const totalProjects = PROJECTS.length;

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ── Desktop (>= 1024px) & No Reduced Motion: Pinned Horizontal Scrub Track ──
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const anim = gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 0.8,
              start: "top top",
              end: () => "+=" + (track.scrollWidth - window.innerWidth),
              invalidateOnRefresh: true,
              anticipatePin: 1,
              refreshPriority: 1,
              snap: {
                snapTo: 1 / (totalProjects - 1),
                directional: false,
                duration: { min: 0.2, max: 0.4 },
                delay: 0.15,
                ease: "power1.inOut",
              },
              onUpdate: (self) => {
                if (isNavigatingRef.current) return;
                const idx = Math.min(
                  totalProjects - 1,
                  Math.max(0, Math.round(self.progress * (totalProjects - 1)))
                );
                setActiveIndex(idx);
              },
            },
          });

          triggerRef.current = anim.scrollTrigger || null;

          // Register into scrollRegistry so PhilosophyQuote can anchor its
          // GSAP ScrollTrigger to start AFTER this pin fully releases.
          scrollRegistry.work.trigger = anim.scrollTrigger || null;

          ScrollTrigger.refresh();

          return () => {
            triggerRef.current = null;
            scrollRegistry.work.trigger = null;
          };
        }
      );

      // ── Mobile/Tablet (< 1024px) & No Reduced Motion: Non-Pinned Scrub Card Entrances ──
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          const cards = track.querySelectorAll(".project-card-item");
          cards.forEach((card) => {
            gsap.fromTo(
              card,
              { opacity: 0, y: 32, scale: 0.98 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                  end: "top 45%",
                  scrub: 0.5,
                },
              }
            );
          });
        }
      );
    }, section);

    // Refresh ScrollTrigger after font & document readiness
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

    return () => {
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
      scrollRegistry.work.trigger = null;
      ctx.revert();
    };
  }, [totalProjects]);

  const navigateToIndex = (targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= totalProjects) return;
    const st = triggerRef.current;
    if (!st) return;

    isNavigatingRef.current = true;
    if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    setActiveIndex(targetIdx);

    const start = st.start;
    const end = st.end;
    const targetScroll = start + (targetIdx / (totalProjects - 1)) * (end - start);

    const lenis = (window as any).lenis;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(targetScroll, {
        duration: 0.6,
        lock: false,
        onComplete: () => {
          isNavigatingRef.current = false;
        },
      });
      navTimeoutRef.current = setTimeout(() => {
        isNavigatingRef.current = false;
      }, 700);
    } else {
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
      navTimeoutRef.current = setTimeout(() => {
        isNavigatingRef.current = false;
      }, 700);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden w-full py-[80px] lg:py-8 lg:h-dvh bg-[#07090E] select-none flex flex-col justify-between scroll-mt-24"
      aria-label="Selected Projects — Showcase Track"
    >
      <AmbientOrbs
        orbs={[
          {
            color: "radial-gradient(circle, rgba(140,255,46,1) 0%, transparent 70%)",
            size: "700px",
            top: "-20%",
            right: "-10%",
            opacity: 0.08,
          },
          {
            color: "radial-gradient(circle, rgba(59,130,246,1) 0%, transparent 70%)",
            size: "500px",
            bottom: "-15%",
            left: "5%",
            opacity: 0.06,
            delay: "-25s",
          },
        ]}
      />

      {/* Section Header */}
      <div className="relative z-20 w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 mb-8 lg:mb-0 flex items-end justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#8cff2e] uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#8cff2e] animate-pulse" />
            Selected Projects [ 02 ]
          </div>
          <h2 className="font-display text-3xl lg:text-5xl font-extrabold text-[#ffffff]">
            Selected <span className="text-white/80">Work.</span>
          </h2>
        </div>

        <div className="hidden sm:flex items-center gap-3 font-mono text-xs text-[#94A3B8]">
          <span className="w-2 h-2 rounded-full bg-[#8cff2e]" />
          <span>[ 01 / {String(totalProjects).padStart(2, "0")} START TO END ]</span>
        </div>
      </div>

      {/* Persistent Project Track: Responsive Vertical Stack on Mobile/Tablet (<1024px), Pinned Horizontal Focus-Pull on Desktop (>=1024px) */}
      <div
        ref={trackRef}
        id="project-track"
        className="flex flex-col lg:flex-row lg:flex-nowrap w-full lg:w-max max-w-[1240px] lg:max-w-none mx-auto lg:mx-0 items-stretch lg:items-center gap-8 lg:gap-12 px-6 md:px-12 lg:px-24 my-auto z-10"
      >
        {PROJECTS.map((project, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={project.id}
              onClick={() => {
                if (!isActive && window.innerWidth >= 1024) navigateToIndex(idx);
              }}
              className={`project-card-item w-full lg:w-[88vw] lg:max-w-[1100px] shrink-0 bg-[#0d1017] rounded-[16px] p-6 lg:p-8 backdrop-blur-xl border border-white/[0.08] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive
                ? "opacity-100 scale-100 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-20 lg:hover:-translate-y-1"
                : "opacity-100 lg:opacity-40 scale-100 lg:scale-[0.92] lg:blur-[1px] lg:grayscale-[40%] cursor-pointer lg:hover:opacity-60 z-10"
                }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Media Frame (~60%) */}
                <div
                  className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9.5] w-full rounded-[14px] overflow-hidden border border-white/[0.12] cursor-pointer group flex items-center justify-center bg-[#07090e] shadow-2xl"
                  data-cursor="view"
                  data-cursor-text={project.liveUrl ? "VIEW\nPROJECT" : "VIEW\nCASE STUDY"}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (project.liveUrl) {
                      window.open(project.liveUrl, "_blank", "noopener,noreferrer");
                    } else {
                      onOpenDoc(project.id);
                    }
                  }}
                >
                  <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                    <Image
                      src={project.imageSrc}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 750px"
                      className="object-cover object-center scale-[1.04] group-hover:scale-[1.09] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      priority={idx === 0}
                    />
                  </div>

                  {/* Subtle bottom gradient to blend cleanly with card depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090E]/50 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-4 right-4 z-10">
                    <span
                      className="text-[11px] font-mono font-bold px-3 py-1 rounded-full border border-white/20 bg-[#07090E]/90 text-[#ffffff] backdrop-blur-md uppercase shadow-md"
                      style={{ borderColor: project.accentBorder }}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* System Specs (~40%) */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div
                      className="inline-flex items-center gap-2 font-mono text-xs lg:text-sm font-bold uppercase tracking-wider"
                      style={{ color: project.nativeAccent || "#8cff2e" }}
                    >
                      [ {project.num} ] {project.ghostType || project.type}
                    </div>

                    <h3 className="font-display text-2xl lg:text-3xl font-extrabold text-[#ffffff] leading-tight">
                      {project.title}
                    </h3>

                    <p className="text-[#94A3B8] text-sm lg:text-base leading-relaxed line-clamp-3">
                      {project.narrative}
                    </p>
                  </div>

                  {/* Tech Badges with Monochrome Icons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.stack.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full border border-white/10 bg-white/5 text-slate-300 font-medium"
                      >
                        <TechIcon name={tech} />
                        <span>{tech}</span>
                      </span>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/[0.08]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDoc(project.id);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-white text-[#0d1017] font-mono font-bold text-xs hover:bg-[#8cff2e] transition-colors inline-flex items-center gap-2 shadow-lg cursor-pointer"
                      aria-label={`View full specs for ${project.title}`}
                    >
                      View Full Specs
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2.5 rounded-xl border border-white/15 bg-transparent text-slate-300 hover:text-white hover:border-white/40 font-mono text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Github className="w-3.5 h-3.5" /> Repo
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2.5 rounded-xl border border-[#8cff2e]/50 bg-[#8cff2e]/10 text-[#8cff2e] hover:bg-[#8cff2e]/20 hover:border-[#8cff2e] font-mono text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(140,255,46,0.08)]"
                        aria-label={`View live demo for ${project.title}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8cff2e] animate-pulse shrink-0" />
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Synchronized Navigation & Controls Bar (Visible on Desktop) */}
      <div className="relative z-20 hidden lg:flex w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 items-center justify-between mt-4">
        {/* Active Index & Status Indicator */}
        <div className="flex items-center gap-4 font-mono text-xs text-white">
          <span className="text-[#8cff2e] font-bold text-sm tracking-widest">
            {String(activeIndex + 1).padStart(2, "0")} / {String(totalProjects).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-2">
            {PROJECTS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => navigateToIndex(idx)}
                aria-label={`Go to project ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === activeIndex
                  ? "w-7 bg-[#8cff2e] shadow-[0_0_10px_rgba(140,255,46,0.5)]"
                  : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Arrow Controls [ < ] [ > ] */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous project"
            className="w-10 h-10 rounded-xl border border-white/15 bg-[#0d1017]/90 text-white flex items-center justify-center hover:border-[#8cff2e] hover:text-[#8cff2e] disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white transition-all cursor-pointer font-mono text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateToIndex(activeIndex + 1)}
            disabled={activeIndex === totalProjects - 1}
            aria-label="Next project"
            className="w-10 h-10 rounded-xl border border-white/15 bg-[#0d1017]/90 text-[#ffffff] flex items-center justify-center hover:border-[#8cff2e] hover:text-[#8cff2e] disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white transition-all cursor-pointer font-mono text-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
