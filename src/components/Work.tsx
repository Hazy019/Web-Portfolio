"use client";

/**
 * Work — Project Showcase (Image 2 Architecture Standard & Pinned GSAP ScrollTrigger)
 *
 * Card Container: Glassmorphic dark card (#0d1017, border 1px solid rgba(255,255,255,0.08), radius 16px, padding 24px)
 * Left Column: ~60% width media frame (fixed 16:9 aspect ratio, data-cursor="view", status pill)
 * Right Column: System Specs ([ 03 ] ACADEMIC PLATFORM in #8CFF2E, white geometric display title, slate narrative, tech badges, View Full Specs CTA)
 * ScrollTrigger: Pin section (pin: true, scrub: 0.8, snap: 1 / (N - 1)), zero autoplay, zero infinite loop
 * Navigation Sync: Synchronized bottom arrows [ < ] [ > ] and status indicators (03 / 06)
 */

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS, ProjectData } from "@/lib/projectsData";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { AmbientOrbs } from "./AmbientOrbs";
import { ArrowUpRight, ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface WorkProps {
  onOpenDoc: (projectId: string) => void;
  onHoverProject?: (project: ProjectData | null) => void;
}

// ─── Mobile / Reduced-Motion Vertical Card Fallback ─────────────────────────
function WorkFallback({ onOpenDoc }: { onOpenDoc: (id: string) => void }) {
  return (
    <section id="projects" className="relative py-[80px] lg:py-[140px] overflow-hidden bg-[#07090E]">
      <AmbientOrbs
        orbs={[
          {
            color: "radial-gradient(circle, rgba(140,255,46,1) 0%, transparent 70%)",
            size: "500px",
            top: "-10%",
            right: "5%",
            opacity: 0.08,
          },
          {
            color: "radial-gradient(circle, rgba(59,130,246,1) 0%, transparent 70%)",
            size: "400px",
            bottom: "10%",
            left: "-5%",
            opacity: 0.06,
            delay: "-20s",
          },
        ]}
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 w-full space-y-12 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#8cff2e] uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#8cff2e] animate-pulse" />
            Selected Projects [ 02 ]
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            Selected <span className="text-white/80">Work.</span>
          </h2>
        </div>

        <div className="space-y-12">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="bg-[#0d1017] border border-white/[0.08] rounded-[16px] p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col gap-6"
            >
              {/* Left Column / Top: Media Frame ~60% */}
              <div
                className="relative aspect-[16/9] w-full rounded-[12px] overflow-hidden border border-white/[0.08] bg-[#07090E] cursor-pointer group"
                data-cursor="view"
                onClick={() => onOpenDoc(project.id)}
              >
                <Image
                  src={project.imageSrc}
                  alt={project.title}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090E]/60 via-transparent to-transparent opacity-70 group-hover:opacity-30 transition-opacity" />
                <div className="absolute top-4 right-4">
                  <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full border border-white/20 bg-[#07090E]/80 text-white backdrop-blur-md uppercase">
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Right Column / Bottom: System Specs ~40% */}
              <div className="flex flex-col gap-3">
                <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold text-[#8cff2e] uppercase tracking-wider">
                  [ {project.num} ] {project.ghostType || project.type}
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {project.title}
                </h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{project.narrative}</p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {project.stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-mono rounded-full border border-white/10 bg-white/5 text-slate-300 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/[0.08]">
                  <button
                    onClick={() => onOpenDoc(project.id)}
                    className="px-5 py-2.5 rounded-xl bg-white text-[#0d1017] font-mono font-bold text-xs hover:bg-[#8cff2e] transition-colors inline-flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    View Full Specs <ArrowUpRight className="w-4 h-4" />
                  </button>
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl border border-white/15 bg-transparent text-slate-300 hover:text-white hover:border-white/40 font-mono text-xs transition-colors inline-flex items-center gap-1.5"
                    >
                      <Github className="w-3.5 h-3.5" /> Repo
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl border border-white/15 bg-transparent text-slate-300 hover:text-white hover:border-white/40 font-mono text-xs transition-colors inline-flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Live
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Desktop Pinned Showcase (Image 2 Standard & Navigation Sync) ───────────
function WorkHorizontalTrack({ onOpenDoc }: { onOpenDoc: (id: string) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const totalProjects = PROJECTS.length;

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    const ctx = gsap.context(() => {
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
          snap: {
            snapTo: 1 / (totalProjects - 1),
            duration: { min: 0.25, max: 0.5 },
            delay: 0.05,
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            const idx = Math.min(
              totalProjects - 1,
              Math.max(0, Math.round(self.progress * (totalProjects - 1)))
            );
            setActiveIndex(idx);
          },
        },
      });

      triggerRef.current = anim.scrollTrigger || null;
    }, section);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [totalProjects]);

  const navigateToIndex = (targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= totalProjects) return;
    const st = triggerRef.current;
    if (!st) return;

    const start = st.start;
    const end = st.end;
    const targetScroll = start + (targetIdx / (totalProjects - 1)) * (end - start);

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden w-screen h-screen bg-[#07090E] select-none flex flex-col justify-between py-6 md:py-8"
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
      <div className="relative z-20 w-full max-w-[1240px] mx-auto px-6 md:px-12 flex items-end justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#8cff2e] uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#8cff2e] animate-pulse" />
            Selected Projects [ 04 ]
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#ffffff]">
            Selected <span className="text-white/80">Work.</span>
          </h2>
        </div>

        <div className="hidden sm:flex items-center gap-3 font-mono text-xs text-[#94A3B8]">
          <span className="w-2 h-2 rounded-full bg-[#8cff2e]" />
          <span>[ 01 / {String(totalProjects).padStart(2, "0")} START TO END ]</span>
        </div>
      </div>

      {/* Horizontal Cards Track (Image 2 Architecture Standard) */}
      <div
        ref={trackRef}
        id="project-track"
        className="flex flex-nowrap w-max h-auto items-center gap-8 lg:gap-12 px-6 md:px-16 lg:px-24 my-auto z-10"
      >
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            className="w-[88vw] max-w-[1100px] shrink-0 bg-[#0d1017] border border-white/[0.08] rounded-[16px] p-6 lg:p-8 backdrop-blur-xl shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Left Column (Media Frame ~60%) */}
              <div
                className="lg:col-span-7 relative aspect-[16/9] w-full rounded-[12px] overflow-hidden border border-white/[0.08] bg-[#07090E] cursor-pointer group"
                data-cursor="view"
                onClick={() => onOpenDoc(project.id)}
              >
                <Image
                  src={project.imageSrc}
                  alt={project.title}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090E]/60 via-transparent to-transparent opacity-70 group-hover:opacity-30 transition-opacity" />

                <div className="absolute top-4 right-4">
                  <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full border border-white/20 bg-[#07090E]/80 text-[#ffffff] backdrop-blur-md uppercase">
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Right Column (System Specs ~40%) */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 font-mono text-xs lg:text-sm font-bold text-[#8cff2e] uppercase tracking-wider">
                    [ {project.num} ] {project.ghostType || project.type}
                  </div>

                  <h3 className="font-display text-2xl lg:text-3xl font-extrabold text-[#ffffff] leading-tight">
                    {project.title}
                  </h3>

                  <p className="text-[#94A3B8] text-sm lg:text-base leading-relaxed line-clamp-3">
                    {project.narrative}
                  </p>
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-mono rounded-full border border-white/10 bg-white/5 text-slate-300 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/[0.08]">
                  <button
                    onClick={() => onOpenDoc(project.id)}
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
                      className="px-4 py-2.5 rounded-xl border border-white/15 bg-transparent text-slate-300 hover:text-white hover:border-white/40 font-mono text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Live
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Synchronized Navigation & Controls Bar */}
      <div className="relative z-20 w-full max-w-[1240px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Active Index & Status Indicator */}
        <div className="flex items-center gap-4 font-mono text-xs text-white">
          <span className="text-[#8cff2e] font-bold text-sm tracking-widest">
            {String(activeIndex + 1).padStart(2, "0")} / {String(totalProjects).padStart(2, "0")}
          </span>
          <div className="hidden sm:flex items-center gap-1.5">
            {PROJECTS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => navigateToIndex(idx)}
                aria-label={`Go to project ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === activeIndex
                  ? "w-6 bg-[#8cff2e]"
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

// ─── Root export ──────────────────────────────────────────────────────────────
export function Work({ onOpenDoc, onHoverProject }: WorkProps) {
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  void onHoverProject;

  if (reducedMotion || isMobile) return <WorkFallback onOpenDoc={onOpenDoc} />;
  return <WorkHorizontalTrack onOpenDoc={onOpenDoc} />;
}
