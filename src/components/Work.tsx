"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS, ProjectData } from "@/lib/projectsData";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { AmbientOrbs } from "./AmbientOrbs";
import { ProjectIcon } from "./ProjectIcon";
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

// ─── Mobile Scrubbed Project Card (Vertical Scroll Reveal — No Pinning §2 v8) ───
function MobileProjectCard({
  project,
  onOpenDoc,
}: {
  project: ProjectData;
  onOpenDoc: (id: string) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"],
  });

  // Focus differential & scrubbed reveals (Matching desktop visual rhyme)
  const cardOpacity = useTransform(scrollYProgress, [0, 0.4, 0.85], [0.5, 0.85, 1]);
  const cardScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 0.98, 1]);
  const mediaScale = useTransform(scrollYProgress, [0, 0.6, 1], [0.92, 0.98, 1]);
  const mediaOpacity = useTransform(scrollYProgress, [0, 0.4, 0.9], [0.4, 0.8, 1]);
  const titleY = useTransform(scrollYProgress, [0.15, 0.7], [24, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0.15, 0.7], [0, 1]);
  const bodyY = useTransform(scrollYProgress, [0.25, 0.8], [18, 0]);
  const bodyOpacity = useTransform(scrollYProgress, [0.25, 0.8], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.35, 0.9], [15, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.35, 0.9], [0, 1]);

  if (reducedMotion) {
    return (
      <div className="bg-[#0d1017] border border-white/[0.08] rounded-[16px] p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col gap-6">
        <div
          className="relative aspect-[16/9] w-full rounded-[12px] overflow-hidden border border-white/[0.08] p-3 sm:p-4 cursor-pointer group flex items-center justify-center"
          style={{
            background: "radial-gradient(ellipse at 50% 20%, rgba(255, 255, 255, 0.08) 0%, rgba(7, 9, 14, 0.95) 75%)",
          }}
          onClick={() => {
            if (project.liveUrl) {
              window.open(project.liveUrl, "_blank", "noopener,noreferrer");
            } else {
              onOpenDoc(project.id);
            }
          }}
        >
          <div className="relative w-full h-full min-h-[200px] flex items-center justify-center filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.85)]">
            <Image
              src={project.imageSrc}
              alt={project.title}
              fill
              className="object-contain object-center"
            />
          </div>
          <div className="absolute top-4 right-4 z-10">
            <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full border border-white/20 bg-[#07090E]/80 text-white backdrop-blur-md uppercase">
              {project.status}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div
            className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider"
            style={{ color: project.nativeAccent || "#8cff2e" }}
          >
            [ {project.num} ] {project.ghostType || project.type}
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            {project.title}
          </h3>
          <p className="text-[#94A3B8] text-sm leading-relaxed">{project.narrative}</p>

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

          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/[0.08]">
            <button
              onClick={() => onOpenDoc(project.id)}
              className="px-5 py-2.5 rounded-xl bg-white text-[#0d1017] font-mono font-bold text-xs hover:bg-[#8cff2e] transition-colors inline-flex items-center gap-2 shadow-lg cursor-pointer"
            >
              View Case Study <ArrowUpRight className="w-4 h-4" />
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
    );
  }

  return (
    <motion.div
      ref={cardRef}
      style={{
        opacity: cardOpacity,
        scale: cardScale,
      }}
      className="bg-[#0d1017] border border-white/[0.08] rounded-[16px] p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col gap-6 transition-colors duration-300"
    >
      {/* Media Frame ~60% with scrubbed scale & opacity reveal */}
      <motion.div
        style={{
          scale: mediaScale,
          opacity: mediaOpacity,
          background: "radial-gradient(ellipse at 50% 20%, rgba(255, 255, 255, 0.08) 0%, rgba(7, 9, 14, 0.95) 75%)",
        }}
        className="relative aspect-[16/9] w-full rounded-[12px] overflow-hidden border border-white/[0.08] p-3 sm:p-4 cursor-pointer group flex items-center justify-center"
        data-cursor="view"
        onClick={() => {
          if (project.liveUrl) {
            window.open(project.liveUrl, "_blank", "noopener,noreferrer");
          } else {
            onOpenDoc(project.id);
          }
        }}
      >
        <div className="relative w-full h-full min-h-[200px] flex items-center justify-center filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.85)]">
          <Image
            src={project.imageSrc}
            alt={project.title}
            fill
            className="object-contain object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
        </div>
        <div className="absolute top-4 right-4 z-10">
          <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full border border-white/20 bg-[#07090E]/80 text-white backdrop-blur-md uppercase">
            {project.status}
          </span>
        </div>
      </motion.div>

      {/* Content Specs with scrubbed staggered reveal */}
      <div className="flex flex-col gap-3">
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="space-y-1"
        >
          <div
            className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider"
            style={{ color: project.nativeAccent || "#8cff2e" }}
          >
            [ {project.num} ] {project.ghostType || project.type}
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            {project.title}
          </h3>
        </motion.div>

        <motion.div style={{ y: bodyY, opacity: bodyOpacity }} className="space-y-3">
          <p className="text-[#94A3B8] text-sm leading-relaxed">{project.narrative}</p>

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
        </motion.div>

        <motion.div
          style={{ y: ctaY, opacity: ctaOpacity }}
          className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/[0.08]"
        >
          <button
            onClick={() => onOpenDoc(project.id)}
            className="px-5 py-2.5 rounded-xl bg-white text-[#0d1017] font-mono font-bold text-xs hover:bg-[#8cff2e] transition-colors inline-flex items-center gap-2 shadow-lg cursor-pointer"
          >
            View Case Study <ArrowUpRight className="w-4 h-4" />
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
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Mobile / Reduced-Motion Vertical Card Layout ─────────────────────────
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
            <MobileProjectCard
              key={project.id}
              project={project}
              onOpenDoc={onOpenDoc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Desktop Pinned Showcase Carousel (Focus Pull Behavior) ─────────────────
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
      ScrollTrigger.refresh();
    }, section);

    return () => {
      clearTimeout(timer);
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
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
      className="relative overflow-hidden w-full h-screen bg-[#07090E] select-none flex flex-col justify-between py-6 md:py-8"
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
            Selected Projects [ 02 ]
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

      {/* Horizontal Focus-Pull Carousel Track */}
      <div
        ref={trackRef}
        id="project-track"
        className="flex flex-nowrap w-max h-auto items-center gap-8 lg:gap-12 px-6 md:px-16 lg:px-24 my-auto z-10"
      >
        {PROJECTS.map((project, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={project.id}
              onClick={() => {
                if (!isActive) navigateToIndex(idx);
              }}
              className={`w-[88vw] max-w-[1100px] shrink-0 bg-[#0d1017] rounded-[16px] p-6 lg:p-8 backdrop-blur-xl border border-white/[0.08] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive
                  ? "opacity-100 scale-100 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-20 hover:-translate-y-1"
                  : "opacity-40 scale-[0.92] blur-[1px] grayscale-[40%] cursor-pointer hover:opacity-60 z-10"
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Left Column (Media Frame ~60%) */}
                <div
                  className="lg:col-span-7 relative aspect-[16/9] w-full rounded-[12px] overflow-hidden border border-white/[0.08] p-4 lg:p-6 cursor-pointer group flex items-center justify-center"
                  data-cursor="view"
                  style={{
                    background: "radial-gradient(ellipse at 50% 20%, rgba(255, 255, 255, 0.08) 0%, rgba(7, 9, 14, 0.95) 75%)",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (project.liveUrl) {
                      window.open(project.liveUrl, "_blank", "noopener,noreferrer");
                    } else {
                      onOpenDoc(project.id);
                    }
                  }}
                >
                  <div className="relative w-full h-full min-h-[220px] lg:min-h-[300px] flex items-center justify-center filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]">
                    <Image
                      src={project.imageSrc}
                      alt={project.title}
                      fill
                      className="object-contain object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                      priority
                    />
                  </div>

                  <div className="absolute top-4 right-4 z-10">
                    <span
                      className="text-[11px] font-mono font-bold px-3 py-1 rounded-full border border-white/20 bg-[#07090E]/80 text-[#ffffff] backdrop-blur-md uppercase"
                      style={{ borderColor: project.accentBorder }}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Right Column (System Specs ~40%) */}
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
                  <div className="flex items-center gap-3 pt-3 border-t border-white/[0.08]">
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
                        className="px-4 py-2.5 rounded-xl border border-white/15 bg-transparent text-slate-300 hover:text-white hover:border-white/40 font-mono text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Live
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Synchronized Navigation & Controls Bar */}
      <div className="relative z-20 w-full max-w-[1240px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Active Index & Status Indicator */}
        <div className="flex items-center gap-4 font-mono text-xs text-white">
          <span className="text-[#8cff2e] font-bold text-sm tracking-widest">
            {String(activeIndex + 1).padStart(2, "0")} / {String(totalProjects).padStart(2, "0")}
          </span>
          <div className="hidden sm:flex items-center gap-2">
            {PROJECTS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => navigateToIndex(idx)}
                aria-label={`Go to project ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIndex
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

// ─── Root export ──────────────────────────────────────────────────────────────
export function Work({ onOpenDoc, onHoverProject }: WorkProps) {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setMounted(true);
    const check = () => {
      const mobileOrTablet = window.innerWidth < 1024 || window.matchMedia("(max-width: 1023px)").matches;
      setIsMobile(mobileOrTablet);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  void onHoverProject;

  if (!mounted || reducedMotion || isMobile)
    return <WorkFallback onOpenDoc={onOpenDoc} />;

  return <WorkHorizontalTrack onOpenDoc={onOpenDoc} />;
}

