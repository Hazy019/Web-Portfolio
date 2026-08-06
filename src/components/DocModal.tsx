"use client";

import { useEffect } from "react";
import { PROJECTS, ProjectData } from "@/lib/projectsData";
import { X, ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";

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
      if (e.key === "Escape") onClose();
    };
    if (projectId) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [projectId, onClose]);

  if (!projectId || !currentProject) return null;

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 lg:p-8">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200"
      />

      {/* Modal Content Panel */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-950 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-sm font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10"
              style={{ color: currentProject.nativeAccent }}
            >
              {currentProject.num}
            </span>
            <div>
              <div className="text-xs font-mono text-slate-400">
                {currentProject.type}
              </div>
              <h2 className="font-display text-xl font-bold text-white">
                {currentProject.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* Action links */}
          <div className="flex flex-wrap items-center gap-4">
            {currentProject.liveUrl && (
              <a
                href={currentProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,255,136,0.3)]"
              >
                <span>Visit Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {currentProject.repoUrl && (
              <a
                href={currentProject.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-mono transition-all"
              >
                <Github className="w-3.5 h-3.5 text-emerald-400" />
                <span>Source Code</span>
              </a>
            )}
          </div>

          {/* Problem & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/5 space-y-2">
              <div className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                The Problem
              </div>
              <p className="text-slate-300 text-xs leading-relaxed font-light">
                {currentProject.problem}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                The Solution
              </div>
              <p className="text-slate-300 text-xs leading-relaxed font-light">
                {currentProject.solution}
              </p>
            </div>
          </div>

          {/* Architecture Steps */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Architecture & Execution Steps
            </div>
            <div className="space-y-2">
              {currentProject.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg border border-white/5 bg-white/5 text-xs text-slate-300 font-light"
                >
                  <span className="font-mono text-emerald-400 font-bold shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spec Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {currentProject.specs.map((spec, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-white/10 bg-slate-900/60 font-mono"
              >
                <div className="text-[10px] text-slate-500 uppercase">
                  {spec.label}
                </div>
                <div className="text-xs font-bold text-emerald-400 truncate mt-1">
                  {spec.value}
                </div>
              </div>
            ))}
          </div>

          {/* Developer Notes & Outcome */}
          <div className="p-5 rounded-xl border border-white/10 bg-slate-900/40 space-y-3">
            <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Developer Notes & Optimizations
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              {currentProject.devnotes}
            </p>
          </div>

          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Results & Impact
            </div>
            <p className="text-xs text-slate-200 font-medium">
              {currentProject.outcome}
            </p>
          </div>
        </div>

        {/* Footer Project Navigation */}
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-slate-900/50 text-xs font-mono">
          <button
            onClick={() => onSelectProject(prevProject.id)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>PREV: {prevProject.title}</span>
          </button>
          <button
            onClick={() => onSelectProject(nextProject.id)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <span>NEXT: {nextProject.title}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
