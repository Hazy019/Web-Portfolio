"use client";

/**
 * About — Bi-Directional Entrance Motion & Global Container Alignment (§1 & §4)
 *
 * Container: max-w-[1280px] mx-auto px-6 md:px-12 w-full
 * Left Column (Role Selector Tabs): Enters from Left-to-Right (x: -60px -> 0px, opacity: 0 -> 1)
 * Right Column (Audience Card): Enters from Right-to-Left (x: 60px -> 0px, opacity: 0 -> 1)
 * Persona Views: For Recruiters | For Engineers | For Founders
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Briefcase, Terminal, Zap, ArrowUpRight, CheckCircle2 } from "lucide-react";

type PersonaRole = "recruiters" | "engineers" | "founders";

const ROLES: Array<{ id: PersonaRole; label: string; icon: React.ReactNode }> = [
  { id: "recruiters", label: "For Recruiters", icon: <Briefcase className="w-4 h-4" /> },
  { id: "engineers", label: "For Engineers", icon: <Terminal className="w-4 h-4" /> },
  { id: "founders", label: "For Founders", icon: <Zap className="w-4 h-4" /> },
];

const PERSONA_CONTENT: Record<
  PersonaRole,
  {
    headline: string;
    body: string;
    points: string[];
    specs: Array<{ key: string; value: string }>;
  }
> = {
  recruiters: {
    headline: "Production-Ready Developer with Government System Deployment Experience",
    body: "BS Computer Science graduate with internship experience at the Department of Trade and Industry (DTI). Proven capability in developing production local queue systems, automated frameworks, and security-first web apps. Available immediately for full-time software engineering positions.",
    points: [
      "Built DTI local queue & inventory system (Next.js 15, SQLite3, WebSockets).",
      "Google Cybersecurity Certificate & freeCodeCamp Responsive Web Design certified.",
      "Open to Remote, Hybrid, or On-site roles (Based in Philippines, UTC+8).",
      "Focus: Defensive programming, reliability, and clean architecture.",
    ],
    specs: [
      { key: "DEGREE", value: "BS Computer Science (2026)" },
      { key: "EXPERIENCE", value: "DTI Internship & 6 Core Deployments" },
      { key: "AVAILABILITY", value: "Immediate (Full-Time)" },
      { key: "LOCATION", value: "Philippines (UTC+8) · Remote Ready" },
    ],
  },
  engineers: {
    headline: "Security-First Architecture, Real-Time WebSockets & Resilient Pipelines",
    body: "I build systems expecting failure modes. Specialized in Next.js 15 App Router, React 19, TypeScript, Python automation, WebSockets, and secure authentication. Obsessive about type safety, low latency, and maintainable code bases.",
    points: [
      "Real-time WebSocket ticketing with SQLite transaction integrity.",
      "PyQt6 + AWS Lambda + Remotion automated YouTube Shorts video rendering pipeline.",
      "Google Foundation in Cybersecurity certified: defensive coding & network security.",
      "Clean API boundaries, zero unnecessary dependencies, predictable control flow.",
    ],
    specs: [
      { key: "FRONTEND", value: "Next.js 15, React 19, TypeScript, Tailwind CSS" },
      { key: "BACKEND", value: "Python, Flask, Node.js, WebSockets, SQLite3" },
      { key: "SECURITY", value: "JWT Auth, Input Sanitization, OWASP Top 10" },
      { key: "AUTOMATION", value: "AWS Lambda, Remotion, PyQt6, GitHub Actions" },
    ],
  },
  founders: {
    headline: "Rapid Prototype Execution, Full-Stack Delivery & Solo Product Velocity",
    body: "I convert complex business requirements into intuitive, reliable software fast. From solo government queue kiosks to automated AI video rendering pipelines, I build products designed for performance and longevity.",
    points: [
      "Shipped 6 production deployments solo & lead — idea to production.",
      "Automated DTI weekly reporting workflows to eliminate manual data entry.",
      "User-centered design: crisp typography, generous spacing, zero UI clutter.",
      "Pragmatic engineering: built for uptime, zero fluff, maximum impact.",
    ],
    specs: [
      { key: "SHIPPED", value: "6 Full Production Systems" },
      { key: "VELOCITY", value: "Rapid Idea-to-Deployment" },
      { key: "MINDSET", value: "Product-Led & User-Centered" },
      { key: "OWNERSHIP", value: "Full Stack End-to-End" },
    ],
  },
};

export function About() {
  const reducedMotion = useReducedMotion();
  const [activeRole, setActiveRole] = useState<PersonaRole>("recruiters");

  const activeContent = PERSONA_CONTENT[activeRole];

  return (
    <section
      id="about"
      className="relative py-[80px] lg:py-[140px] px-6 overflow-hidden border-t border-white/10 bg-[#07090E]"
    >
      {/* Strict Global Container Wrapper */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 w-full space-y-12">
        {/* Section Header */}
        <motion.div
          initial={reducedMotion ? undefined : { y: 20, opacity: 0 }}
          whileInView={reducedMotion ? undefined : { y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8cff2e] uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#8cff2e] animate-pulse" />
            <span>[ 02 // PERSPECTIVE & EXPERIENCE ]</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
            Tailored <span className="text-white/80">Perspective.</span>
          </h2>
        </motion.div>

        {/* Bi-Directional Entrance Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Enters Left-to-Right (x: -60px -> 0px) */}
          <motion.div
            initial={reducedMotion ? undefined : { x: -60, opacity: 0 }}
            whileInView={reducedMotion ? undefined : { x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] as const }}
            className="lg:col-span-4 flex flex-col gap-3"
          >
            <div className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1">
              Select Role View:
            </div>

            {ROLES.map((role) => {
              const isActive = activeRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  className={`relative flex items-center justify-between p-5 rounded-2xl border text-left transition-all duration-300 font-mono text-sm group ${
                    isActive
                      ? "bg-[#12151E] border-white/30 text-white shadow-xl"
                      : "bg-[#07090E] border-white/10 text-[#94A3B8] hover:text-white hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? "text-[#8cff2e]" : "text-slate-500"}>
                      {role.icon}
                    </span>
                    <span className={isActive ? "font-bold text-white text-base" : "font-medium text-sm"}>
                      {role.label}
                    </span>
                  </div>

                  {/* Active Indicator Dot */}
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <motion.span
                        layoutId="roleIndicatorDot"
                        className="w-2.5 h-2.5 rounded-full bg-[#8cff2e] shadow-[0_0_8px_#8cff2e]"
                      />
                    ) : (
                      <span className="text-xs text-slate-600 group-hover:text-slate-400">→</span>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Resume Callout */}
            <div className="p-6 rounded-2xl bg-[#12151E] border border-white/10 space-y-3 mt-2">
              <div className="text-xs font-mono text-[#94A3B8]">
                Official Credentials & PDF CV:
              </div>
              <a
                href="Kyrell_Santillan_Resume.pdf"
                download
                className="inline-flex items-center gap-2 text-sm font-mono font-bold text-[#8cff2e] hover:underline"
              >
                <span>Download Resume (PDF)</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Right Column: Enters Right-to-Left (x: 60px -> 0px) */}
          <motion.div
            initial={reducedMotion ? undefined : { x: 60, opacity: 0 }}
            whileInView={reducedMotion ? undefined : { x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] as const }}
            className="lg:col-span-8"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRole}
                initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="p-8 sm:p-10 rounded-2xl bg-[#12151E] border border-white/10 backdrop-blur-xl space-y-8 shadow-2xl relative overflow-hidden"
              >
                {/* 28px Headline Copy */}
                <h3 className="font-display text-2xl sm:text-[28px] font-extrabold text-white leading-tight">
                  {activeContent.headline}
                </h3>

                {/* 18px Body Copy */}
                <p className="text-slate-200 text-lg sm:text-[18px] leading-[1.6] font-normal">
                  {activeContent.body}
                </p>

                {/* Highlights List */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-mono text-[#94A3B8] uppercase tracking-widest">
                    Core Capability Highlights:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeContent.points.map((pt, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#8cff2e] shrink-0 mt-0.5" />
                        <span className="font-light leading-normal">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Telemetry Specs Grid */}
                <div className="pt-6 border-t border-white/10">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {activeContent.specs.map((sp, i) => (
                      <div key={i} className="space-y-1">
                        <div className="text-[11px] font-mono text-[#94A3B8] uppercase">
                          {sp.key}
                        </div>
                        <div className="text-xs font-mono font-semibold text-white">
                          {sp.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
