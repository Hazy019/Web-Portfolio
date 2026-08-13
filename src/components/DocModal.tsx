"use client";

import { useEffect, useState } from "react";
import { PROJECTS, ProjectData } from "@/lib/projectsData";
import { TechIcon } from "./Work";
import { ProjectIcon } from "./ProjectIcon";
import { X, ExternalLink, Github, ChevronLeft, ChevronRight, Lock } from "lucide-react";

interface DocModalProps {
  projectId: string | null;
  onClose: () => void;
  onSelectProject: (id: string) => void;
}

export function DocModal({
  projectId,
  onClose,
  onSelectProject,
}: DocModalProps) {
  const [selectedLightboxImg, setSelectedLightboxImg] = useState<string | null>(null);

  const currentProject = PROJECTS.find((p) => p.id === projectId);
  const currentIndex = PROJECTS.findIndex((p) => p.id === projectId);

  const prevProject =
    currentIndex > 0
      ? PROJECTS[currentIndex - 1]
      : PROJECTS[PROJECTS.length - 1];

  const nextProject =
    currentIndex < PROJECTS.length - 1
      ? PROJECTS[currentIndex + 1]
      : PROJECTS[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedLightboxImg) {
          setSelectedLightboxImg(null);
        } else {
          onClose();
        }
      }
    };
    if (projectId) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.stop === "function") {
        lenis.stop();
      }
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.start === "function") {
        lenis.start();
      }
    };
  }, [projectId, selectedLightboxImg, onClose]);

  if (!projectId || !currentProject) return null;

  const accentColor = currentProject.nativeAccent || "#8cff2e";

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4 lg:p-6 overflow-hidden"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        onWheel={(e) => { e.stopPropagation(); e.preventDefault(); }}
        onTouchMove={(e) => { e.stopPropagation(); e.preventDefault(); }}
        className="absolute inset-0 bg-[#07090E]/85 backdrop-blur-xl animate-in fade-in duration-200 pointer-events-auto"
      />

      {/* Modal Content Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="doc-modal-title"
        className="relative w-full max-w-5xl max-h-[92vh] bg-[#0d1017] border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-white/10 bg-[#07090E]/60">
          <div className="flex items-center gap-4">
            <span
              className="font-mono text-sm sm:text-base font-bold px-3 py-1 rounded-md bg-white/5 border border-white/15"
              style={{ color: accentColor, borderColor: currentProject.accentBorder }}
            >
              {currentProject.num}
            </span>
            <div>
              <div
                className="text-xs font-mono font-bold tracking-widest uppercase"
                style={{ color: accentColor }}
              >
                [ {currentProject.ghostType || currentProject.type} ]
              </div>
              <h2 id="doc-modal-title" className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1">
                {currentProject.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/30 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 max-h-[80vh] overflow-y-auto p-6 sm:p-8 lg:p-10 space-y-10 custom-scrollbar">
          {/* Action Links & Status Bar */}
          <div className="flex flex-wrap items-center gap-4 border-b border-white/10 pb-6">
            {currentProject.liveUrl && (
              <a
                href={currentProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-white hover:bg-[#8cff2e] text-[#07090E] font-mono font-bold text-xs sm:text-sm transition-all shadow-xl"
              >
                <span>Visit Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {currentProject.repoUrl && (
              <a
                href={currentProject.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-3 px-6 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 text-xs sm:text-sm font-mono transition-all"
              >
                <Github className="w-4 h-4 text-[#8cff2e]" />
                <span>Source Code</span>
              </a>
            )}
            <div className="ml-auto flex items-center gap-2 font-mono text-xs text-[#94A3B8]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              <span>STATUS: {currentProject.status}</span>
            </div>
          </div>

          {/* Access-Gated State B Notice Banner */}
          {currentProject.status.includes("Restricted Access") && (
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 font-mono text-xs text-amber-300 flex items-center gap-3">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Production Deployment: Institutional / LAN system with access control. Walkthrough documented below.</span>
            </div>
          )}

          {/* Visual Proof & Screenshot Gallery (3-Column Grid with Lightbox) */}
          {currentProject.screenshots && currentProject.screenshots.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-widest flex items-center justify-between">
                <span>VISUAL PROOF & SCREENSHOT GALLERY</span>
                <span className="text-[11px] text-slate-400 font-mono font-semibold">[ CLICK TO ENLARGE ]</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {currentProject.screenshots.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedLightboxImg(src)}
                    className="group/img relative aspect-[16/10] rounded-xl border border-white/15 bg-slate-950/90 overflow-hidden shadow-lg flex items-center justify-center p-2 hover:border-[#8cff2e] transition-all cursor-pointer text-left w-full focus:outline-none focus:ring-2 focus:ring-[#8cff2e]"
                  >
                    <img
                      src={src}
                      alt={`${currentProject.title} screenshot ${i + 1}`}
                      className="w-full h-full object-contain object-center group-hover/img:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-[#07090E]/85 backdrop-blur-md border-t border-white/10 text-[10px] font-mono text-slate-300 flex items-center justify-between">
                      <span>{i === 0 ? "Primary Mockup" : i === 1 ? "Mobile/Kiosk View" : "System Output"}</span>
                      <span className="text-[#8cff2e] font-bold">ENLARGE ↗</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack Pills Quartet */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-widest">
              TECHNOLOGY STACK
            </div>
            <div className="flex flex-wrap gap-2.5">
              {currentProject.stack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-mono rounded-full border border-white/15 bg-white/5 text-slate-200 font-medium"
                >
                  <TechIcon name={tech} />
                  <span>{tech}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Problem & Solution Grid (Minimum 16px body copy) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-7 rounded-2xl border border-red-500/30 bg-red-500/5 space-y-3">
              <div className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
                THE PROBLEM
              </div>
              <p className="text-slate-200 text-base sm:text-[17px] leading-[1.6] font-normal">
                {currentProject.problem}
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                THE SOLUTION
              </div>
              <p className="text-slate-200 text-base sm:text-[17px] leading-[1.6] font-normal">
                {currentProject.solution}
              </p>
            </div>
          </div>

          {/* Architecture Steps (Load-bearing step numbers in accent badges) */}
          <div className="space-y-4">
            <div className="text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-widest">
              ARCHITECTURE & EXECUTION STEPS
            </div>
            <div className="space-y-3">
              {currentProject.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 sm:p-5 rounded-xl border border-white/10 bg-white/[0.03] text-base sm:text-[17px] text-slate-200 leading-[1.6]"
                >
                  <span
                    className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center font-mono font-bold text-sm shrink-0 mt-0.5"
                    style={{ color: accentColor, borderColor: currentProject.accentBorder }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-normal">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spec Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {currentProject.specs.map((spec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-white/10 bg-[#07090E]/60 font-mono space-y-1"
              >
                <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider">
                  {spec.label}
                </div>
                <div
                  className="text-xs sm:text-sm font-bold truncate"
                  style={{ color: accentColor }}
                >
                  {spec.value}
                </div>
              </div>
            ))}
          </div>

          {/* Developer Notes & Outcome */}
          <div className="p-6 sm:p-7 rounded-2xl border border-white/15 bg-white/[0.02] space-y-3">
            <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
              DEVELOPER NOTES & OPTIMIZATIONS
            </div>
            <p className="text-slate-300 text-base sm:text-[16px] leading-[1.6] font-normal">
              {currentProject.devnotes}
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              RESULTS & IMPACT
            </div>
            <p className="text-white text-base sm:text-[17px] font-semibold leading-[1.6]">
              {currentProject.outcome}
            </p>
          </div>
        </div>

        {/* Footer Project Navigation */}
        <div className="flex items-center justify-between p-5 border-t border-white/10 bg-[#07090E]/70 text-xs sm:text-sm font-mono">
          <button
            onClick={() => onSelectProject(prevProject.id)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-[#8cff2e]" />
            <span>PREV: {prevProject.title}</span>
          </button>
          <button
            onClick={() => onSelectProject(nextProject.id)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>NEXT: {nextProject.title}</span>
            <ChevronRight className="w-4 h-4 text-[#8cff2e]" />
          </button>
        </div>
      </div>

      {/* Lightbox Modal Overlay */}
      {selectedLightboxImg && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setSelectedLightboxImg(null)}
        >
          <button
            onClick={() => setSelectedLightboxImg(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer z-10"
            aria-label="Close image preview"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedLightboxImg}
              alt="Enlarged screenshot proof"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
}
