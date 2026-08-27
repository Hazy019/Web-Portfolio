"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PROJECTS, ProjectData } from "@/lib/projectsData";
import { TechIcon } from "./Work";
import { ProjectIcon } from "./ProjectIcon";
import { X, ExternalLink, Github, ChevronLeft, ChevronRight, Lock, ChevronDown, ChevronUp, Briefcase } from "lucide-react";

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
  const [deepDiveOpen, setDeepDiveOpen] = useState(false);

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
    // Store the currently focused element so we can restore focus on close
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedLightboxImg) {
          setSelectedLightboxImg(null);
        } else {
          onClose();
        }
        return;
      }

      // Focus trap: cycle Tab/Shift+Tab only within the modal
      if (e.key === "Tab" && projectId) {
        const modal = document.querySelector('[role="dialog"]') as HTMLElement | null;
        if (!modal) return;
        const focusableSelectors = [
          'a[href]', 'button:not([disabled])', 'input:not([disabled])',
          'select:not([disabled])', 'textarea:not([disabled])',
          '[tabindex]:not([tabindex="-1"])',
        ].join(", ");
        const focusable = Array.from(modal.querySelectorAll<HTMLElement>(focusableSelectors));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus({ preventScroll: true });
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus({ preventScroll: true });
          }
        }
      }
    };

    if (projectId) {
      window.addEventListener("keydown", handleKeyDown);
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.stop === "function") {
        lenis.stop();
      } else {
        document.body.style.overflow = "hidden";
      }
      // Move focus into the modal without triggering window scroll
      const modal = document.querySelector('[role="dialog"]') as HTMLElement | null;
      if (modal) {
        const closeBtn = modal.querySelector('button[aria-label="Close modal"]') as HTMLElement | null;
        if (closeBtn) {
          closeBtn.focus({ preventScroll: true });
        } else {
          modal.focus({ preventScroll: true });
        }
      }
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.start === "function") {
        lenis.start();
      } else {
        document.body.style.overflow = "";
      }
      // Restore focus to the element that triggered the modal open without scrolling
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [projectId, selectedLightboxImg, onClose]);

  if (!projectId || !currentProject) return null;

  const accentColor = currentProject.nativeAccent || "#8cff2e";

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-2 sm:p-4 lg:p-6 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] overflow-hidden"
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
        className="relative w-full max-w-5xl max-h-[92dvh] bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8 border-b border-[var(--border-subtle)] bg-[var(--bg-panel)]/80 gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <span
              className="font-mono text-xs sm:text-base font-bold px-2.5 py-1 rounded-md bg-white/5 border border-[var(--border-subtle)] shrink-0"
              style={{ color: accentColor, borderColor: currentProject.accentBorder }}
            >
              {currentProject.num}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div
                  className="text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase truncate"
                  style={{ color: accentColor }}
                >
                  [ {currentProject.ghostType || currentProject.type} ]
                </div>
                {/* Project nature tag */}
                <div className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border border-[var(--border-subtle)] bg-white/5 text-[var(--text-muted)] shrink-0">
                  <Briefcase className="w-2.5 h-2.5" />
                  <span>{currentProject.projectNature}</span>
                </div>
              </div>
              <h2 id="doc-modal-title" className="font-display text-xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--text-primary)] mt-1 break-words">
                {currentProject.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-xl border border-[var(--border-subtle)] bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-subtle)] transition-all cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div
          data-lenis-prevent
          className="flex-1 min-h-0 max-h-[78dvh] overflow-y-auto p-4 sm:p-8 lg:p-10 space-y-8 sm:space-y-10 custom-scrollbar"
          style={{ overscrollBehavior: "contain" }}
        >
          {/* Action Links & Status Bar */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 border-b border-[var(--border-subtle)] pb-5 sm:pb-6">
            {currentProject.liveUrl && (
              <a
                href={currentProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2.5 px-4 sm:py-3 sm:px-6 rounded-xl bg-[var(--text-primary)] hover:bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:text-white font-mono font-bold text-xs sm:text-sm transition-all shadow-xl"
              >
                <span>Visit Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
            {currentProject.repoUrl && (
              <a
                href={currentProject.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2.5 px-4 sm:py-3 sm:px-6 rounded-xl border border-[var(--border-subtle)] bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] text-xs sm:text-sm font-mono transition-all"
              >
                <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--accent-primary)]" />
                <span>Source Code</span>
              </a>
            )}
            <div className="sm:ml-auto flex items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
              <span className="break-all">STATUS: {currentProject.status}</span>
            </div>
          </div>

          {/* Access-Gated State B Notice Banner */}
          {currentProject.status.includes("Restricted Access") && (
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 font-mono text-xs text-amber-500 dark:text-amber-300 flex items-center gap-3">
              <Lock className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
              <span className="break-words">Production Deployment: Institutional / LAN system with access control. Walkthrough documented below.</span>
            </div>
          )}

          {/* Visual Proof & Screenshot Gallery */}
          {currentProject.screenshots && currentProject.screenshots.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center justify-between flex-wrap gap-1">
                <span>VISUAL PROOF & SCREENSHOT GALLERY</span>
                <span className="text-[11px] text-[var(--text-muted)] font-mono font-semibold">[ CLICK TO ENLARGE ]</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {currentProject.screenshots.map((src, i) => {
                  const label = currentProject.screenshotLabels?.[i] ||
                    (i === 0 ? "Primary Mockup" : i === 1 ? "Mobile/Kiosk View" : "System Output");
                  const isTodo = label.startsWith("TODO:");

                  if (isTodo) {
                    return (
                      <div
                        key={i}
                        className="relative aspect-[16/10] rounded-xl border border-amber-500/30 bg-amber-500/5 overflow-hidden shadow-lg flex flex-col items-center justify-center gap-3 p-4 text-center"
                      >
                        <Lock className="w-6 h-6 text-amber-500/60" />
                        <div className="text-[11px] font-mono text-amber-600 dark:text-amber-300/80 leading-snug break-words">
                          {label.replace("TODO: ", "")}
                        </div>
                        <div className="text-[10px] font-mono text-[var(--text-muted)]">
                          [ PENDING ASSET SUPPLY ]
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedLightboxImg(src)}
                      className="group/img relative aspect-[16/10] rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] overflow-hidden shadow-lg flex items-center justify-center p-2 hover:border-[var(--accent-primary)] transition-all cursor-pointer text-left w-full focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={src}
                          alt={`${currentProject.title} — ${label}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 350px"
                          className="object-contain object-center group-hover/img:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-[var(--bg-panel)]/90 backdrop-blur-md border-t border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-secondary)] flex items-center justify-between gap-1 z-10">
                        <span className="truncate">{label}</span>
                        <span className="text-[var(--accent-primary)] font-bold shrink-0">ENLARGE ↗</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tech Stack Pills Quartet */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest">
              TECHNOLOGY STACK
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {currentProject.stack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-sm font-mono rounded-full border border-[var(--border-subtle)] bg-white/5 text-[var(--text-secondary)] font-medium"
                >
                  <TechIcon name={tech} />
                  <span>{tech}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Problem & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-5 sm:p-7 rounded-2xl border border-red-500/30 bg-red-500/5 space-y-3">
              <div className="text-xs font-mono font-bold text-red-500 dark:text-red-400 uppercase tracking-widest">
                THE PROBLEM
              </div>
              <p className="text-[var(--text-secondary)] text-sm sm:text-[17px] leading-[1.6] font-normal break-words">
                {currentProject.problem}
              </p>
            </div>

            <div className="p-5 sm:p-7 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
              <div className="text-xs font-mono font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest">
                THE SOLUTION
              </div>
              <p className="text-[var(--text-secondary)] text-sm sm:text-[17px] leading-[1.6] font-normal break-words">
                {currentProject.solution}
              </p>
            </div>
          </div>

          {/* Architecture Steps */}
          <div className="space-y-4">
            <div className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest">
              ARCHITECTURE & EXECUTION STEPS
            </div>
            <div className="space-y-3">
              {currentProject.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-xl border border-[var(--border-subtle)] bg-white/[0.02] text-sm sm:text-[17px] text-[var(--text-secondary)] leading-[1.6]"
                >
                  <span
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[var(--border-subtle)] bg-white/5 flex items-center justify-center font-mono font-bold text-xs sm:text-sm shrink-0 mt-0.5"
                    style={{ color: accentColor, borderColor: currentProject.accentBorder }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-normal break-words min-w-0">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spec Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {currentProject.specs.map((spec, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-panel)] font-mono space-y-1 min-w-0"
              >
                <div className="text-[10px] sm:text-[11px] text-[var(--text-muted)] uppercase tracking-wider truncate">
                  {spec.label}
                </div>
                <div
                  className="text-xs sm:text-sm font-bold break-words leading-tight"
                  style={{ color: accentColor }}
                >
                  {spec.value}
                </div>
              </div>
            ))}
          </div>

          {/* Developer Notes & Outcome */}
          <div className="border border-[var(--border-subtle)] rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setDeepDiveOpen((v) => !v)}
              className="w-full flex items-center justify-between p-4 sm:p-6 bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-left cursor-pointer gap-2"
              aria-expanded={deepDiveOpen}
            >
              <div>
                <div className="text-xs font-mono font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                  TECHNICAL DEEP-DIVE
                </div>
                <div className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">For Engineers — architecture notes & optimizations</div>
              </div>
              {deepDiveOpen
                ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                : <ChevronDown className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
              }
            </button>
            {deepDiveOpen && (
              <div className="p-4 sm:p-6 border-t border-[var(--border-subtle)] bg-white/[0.01] overflow-x-auto">
                <p className="text-[var(--text-secondary)] text-sm sm:text-[16px] leading-[1.6] font-normal break-words [overflow-wrap:anywhere]">
                  {currentProject.devnotes}
                </p>
              </div>
            )}
          </div>

          <div className="p-5 sm:p-7 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest">
              RESULTS & IMPACT
            </div>
            <p className="text-[var(--text-primary)] text-sm sm:text-[17px] font-semibold leading-[1.6] break-words">
              {currentProject.outcome}
            </p>
          </div>
        </div>

        {/* Footer Project Navigation */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-t border-[var(--border-subtle)] bg-[var(--bg-panel)] text-xs sm:text-sm font-mono gap-2">
          <button
            onClick={() => onSelectProject(prevProject.id)}
            className="flex items-center gap-1.5 sm:gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer min-w-0"
          >
            <ChevronLeft className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
            <span className="truncate">PREV: {prevProject.title}</span>
          </button>
          <button
            onClick={() => onSelectProject(nextProject.id)}
            className="flex items-center gap-1.5 sm:gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer min-w-0"
          >
            <span className="truncate">NEXT: {nextProject.title}</span>
            <ChevronRight className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
          </button>
        </div>
      </div>

      {/* Lightbox Modal Overlay */}
      {selectedLightboxImg && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setSelectedLightboxImg(null)}
        >
          <button
            onClick={() => setSelectedLightboxImg(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 sm:p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer z-10"
            aria-label="Close image preview"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div
            className="relative max-w-5xl max-h-[85dvh] w-full h-[70vh] flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedLightboxImg}
              alt="Enlarged screenshot proof"
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-contain rounded-xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
}
