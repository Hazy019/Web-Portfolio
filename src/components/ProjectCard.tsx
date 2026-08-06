"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ProjectData } from "@/lib/projectsData";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ExternalLink, Terminal, Shield, ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  project: ProjectData;
  orientation: "left" | "right";
  isFlagship?: boolean;
  onOpenDoc: (projectId: string) => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

export function ProjectCard({
  project,
  orientation,
  isFlagship = false,
  onOpenDoc,
  onHoverStart,
  onHoverEnd,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverStart();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverEnd();
  };

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
      whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-3xl border border-white/10 bg-slate-950/70 backdrop-blur-xl transition-all duration-300 overflow-hidden ${
        isFlagship ? "p-8 lg:p-10 border-white/15" : "p-6 lg:p-8"
      }`}
      style={{
        borderColor: isHovered ? project.nativeAccent : "rgba(255, 255, 255, 0.1)",
        boxShadow: isHovered
          ? `0 0 35px ${project.accentGlow}, inset 0 0 20px ${project.accentGlow}`
          : "none",
      }}
    >
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
          orientation === "right" ? "" : "lg:direction-reverse"
        }`}
      >
        {/* Text Details Column */}
        <div
          className={`space-y-5 ${
            isFlagship ? "lg:col-span-6" : "lg:col-span-5"
          } ${orientation === "right" ? "lg:order-1" : "lg:order-2"}`}
        >
          {/* Header metadata row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-sm font-bold px-2.5 py-1 rounded bg-white/5 border border-white/10"
                style={{ color: project.nativeAccent }}
              >
                [ {project.num} ]
              </span>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                {project.type}
              </span>
            </div>

            {/* Outcome Badge — Visible by default */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium border"
              style={{
                borderColor: `${project.nativeAccent}60`,
                backgroundColor: `${project.nativeAccent}15`,
                color: project.nativeAccent,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: project.nativeAccent }}
              />
              {project.outcomeBadge}
            </div>
          </div>

          {/* Solid crisp title */}
          <h3 className="font-display text-2xl lg:text-3xl font-extrabold text-white group-hover:text-emerald-300 transition-colors leading-tight">
            {project.title}
          </h3>

          {/* Narrative */}
          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light">
            {project.narrative}
          </p>

          {/* Tech Stack Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {project.stack.map((tech, idx) => (
              <span
                key={idx}
                className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() => onOpenDoc(project.id)}
              className="inline-flex items-center gap-2 font-mono text-sm font-semibold transition-all group-hover:translate-x-1"
              style={{ color: project.nativeAccent }}
            >
              <span>View Full Specs</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  title="Visit Live Site"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Screenshot Image & Device Frame Column */}
        <div
          className={`relative rounded-2xl border border-white/10 bg-slate-900/90 overflow-hidden group-hover:border-white/20 transition-all ${
            isFlagship ? "lg:col-span-6" : "lg:col-span-7"
          } ${orientation === "right" ? "lg:order-2" : "lg:order-1"}`}
        >
          {/* Device Frame Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-white/10 text-xs font-mono text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            <span className="text-[11px] text-slate-400">
              {project.deviceFrame === "phone"
                ? "Mobile Kiosk Frame"
                : project.deviceFrame === "split-terminal"
                ? "CLI Runtime Output"
                : "Desktop Browser View"}
            </span>
            <span className="text-[10px] font-bold text-emerald-400">PRODUCTION</span>
          </div>

          {/* Screenshot Image Container */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 p-2 cursor-pointer" data-cursor="view" onClick={() => onOpenDoc(project.id)}>
            <Image
              src={project.imageSrc}
              alt={project.title}
              fill
              className={`object-cover object-top transition-all duration-500 ${
                isHovered ? "scale-105 filter brightness-105" : "scale-100"
              }`}
            />

            {/* Project Specific Flagship Overlays */}
            {project.id === "yt-shorts" && (
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-4">
                <div className="flex gap-2">
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-black/90 text-lime-400 border border-lime-500/40">
                    AWS Lambda Offthread
                  </span>
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-black/90 text-lime-400 border border-lime-500/40">
                    Remotion React
                  </span>
                </div>
              </div>
            )}

            {project.id === "idee-cli" && (
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-black/90 border border-emerald-500/40 font-mono text-xs text-emerald-400 space-y-1">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-200">npx idee-cli apply</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  ✔ Environment validated · Security hooks active
                </div>
              </div>
            )}

            {project.id === "sentinel-view" && (
              <div className="absolute top-3 right-3 flex items-center gap-2 px-2.5 py-1 rounded bg-black/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px]">
                <Shield className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>3D Attack Globe</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
