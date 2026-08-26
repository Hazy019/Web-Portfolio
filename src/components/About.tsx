"use client";

/**
 * About — Bi-Directional Entrance Motion & 5-Entry Grouped Role Selector (§33)
 *
 * Phase 41:
 *   41.1 — Highlight bullets: borderless editorial list (dot + hairline divider)
 *          consistently at ALL breakpoints, not just mobile.
 *   41.2 — Mobile role selector: two-row horizontal scrollable pill strip.
 *   41.3 — Overflow fade mask on pill rows (same technique as LogoStrip).
 *
 * Container: max-w-[1280px] mx-auto px-6 md:px-12 w-full
 * Left Column:
 *   - "Select Role View:" -> For Recruiters | For Engineers | For Founders
 *   - "Reference:" -> Tech Stack
 * Right Column: Rich categorized cards with smooth AnimatePresence transitions
 */

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/useReducedMotion";
import {
  Briefcase,
  Terminal,
  Zap,
  Layers,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Code2,
  Server,
  Database,
  Cloud,
  Award,
  ZoomIn,
  X,
  ExternalLink,
  Sparkles,
  Cpu,
  Workflow,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type RoleId = "services" | "founders" | "recruiters" | "engineers" | "stack" | "certificates";

interface RoleItem {
  id: RoleId;
  label: string;
  icon: React.ReactNode;
  group: "persona" | "reference";
}

const ROLES: RoleItem[] = [
  { id: "services", label: "Freelance & Services", icon: <Sparkles className="w-4 h-4" />, group: "persona" },
  { id: "founders", label: "For Founders", icon: <Zap className="w-4 h-4" />, group: "persona" },
  { id: "recruiters", label: "For Recruiters", icon: <Briefcase className="w-4 h-4" />, group: "persona" },
  { id: "engineers", label: "For Engineers", icon: <Terminal className="w-4 h-4" />, group: "persona" },
  { id: "stack", label: "Tech Stack", icon: <Layers className="w-4 h-4" />, group: "reference" },
  { id: "certificates", label: "Certificates", icon: <Award className="w-4 h-4" />, group: "reference" },
];

const CERTIFICATES = [
  {
    id: "cybersecurity-foundations",
    title: "Foundations of Cybersecurity",
    issuer: "Google Career Certificates",
    issuerTag: "Google Certified",
    category: "Cybersecurity & Defensive Engineering",
    image: "/Certificate/Foundation of Cybersecurity.png",
    skills: ["Defensive Security", "Network Protocols", "SIEM Tools", "Security Auditing"],
  },
  {
    id: "security-risks",
    title: "Play It Safe: Manage Security Risks",
    issuer: "Google Career Certificates",
    issuerTag: "Google Certified",
    category: "Threat Modeling & Risk Analysis",
    image: "/Certificate/Play it Safe Mange Security Risks.png",
    skills: ["Threat Assessment", "Vulnerability Management", "OWASP Top 10", "Incident Response"],
  },
  {
    id: "ux-foundations",
    title: "Foundations of User Experience (UX) Design",
    issuer: "Google Career Certificates",
    issuerTag: "Google UX Certified",
    category: "User-Centered Architecture",
    image: "/Certificate/Foundation of User Experience (UX) Design.png",
    skills: ["User Research", "Wireframing", "Interaction Design", "Usability Heuristics"],
  },
  {
    id: "responsive-web-design",
    title: "Responsive Web Design Certification",
    issuer: "freeCodeCamp",
    issuerTag: "freeCodeCamp Certified",
    category: "Frontend & Responsive Architecture",
    image: "/Certificate/Legacy Responsive Web Design V8.png",
    skills: ["HTML5 & CSS3", "Flexbox & Grid Layouts", "Responsive Design", "Web Accessibility (a11y)"],
  },
];

// Overflow-fade mask style for pill rows (same technique as LogoStrip)
const PILL_ROW_MASK: React.CSSProperties = {
  maskImage:
    "linear-gradient(to right, transparent 0%, black 5%, black 88%, transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0%, black 5%, black 88%, transparent 100%)",
};

const TECH_CATEGORIES = [
  {
    title: "Frontend & UI Engineering",
    icon: <Code2 className="w-4 h-4 text-cyan-400" />,
    skills: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Three.js / R3F", "Framer Motion", "Remotion"],
  },
  {
    title: "Backend & Real-Time Runtimes",
    icon: <Server className="w-4 h-4 text-emerald-400" />,
    skills: ["Python 3.12", "FastAPI", "Flask", "Node.js", "WebSockets", "PyQt6 Kiosks"],
  },
  {
    title: "Databases & Architecture",
    icon: <Database className="w-4 h-4 text-blue-400" />,
    skills: ["PostgreSQL", "Supabase RLS", "SQLite (WAL Mode)", "Drizzle ORM", "Upstash Redis"],
  },
  {
    title: "Cloud, Security & Pipelines",
    icon: <Cloud className="w-4 h-4 text-amber-400" />,
    skills: ["AWS Lambda", "AWS S3", "Cloudflare Turnstile", "JWT Auth", "GitHub Actions", "Docker"],
  },
];

const PERSONA_CONTENT: Record<
  "services" | "founders" | "recruiters" | "engineers",
  {
    headline: string;
    body: string;
    points: string[];
    specs: Array<{ key: string; value: string }>;
  }
> = {
  services: {
    headline: "Full-Stack Web Architecture, Automation Pipelines & Internal Systems",
    body: "I partner directly with founders and teams to architect, build, and deploy production software fast. From solo 0-to-1 web platforms to autonomous data pipelines and kiosk infrastructure — built for high uptime, clean code, and zero maintenance debt.",
    points: [
      "Full-Stack Web & SaaS: Next.js 15, React 19, TypeScript, Supabase & Stripe.",
      "Autonomous Pipelines: Python, FastAPI, AWS Lambda & automated media workflows.",
      "Mission-Critical Internal Tools: Real-time WebSockets, SQLite WAL mode, POS & Kiosks.",
      "Direct 1-on-1 Collaboration: Rapid 1–3 week milestone delivery with 30-day warranty.",
    ],
    specs: [
      { key: "OFFERING", value: "Full-Stack & Automation" },
      { key: "DELIVERY", value: "1–3 Wk Rapid Sprints" },
      { key: "COLLABORATION", value: "Direct 1-on-1 · Async" },
      { key: "STATUS", value: "Open for Projects" },
    ],
  },
  founders: {
    headline: "Rapid Prototype Execution, Full-Stack Delivery & Solo Product Velocity",
    body: "I convert complex business requirements into intuitive, reliable software fast. From solo government queue kiosks to automated video rendering pipelines and SaaS platforms, I build products designed for uptime and longevity.",
    points: [
      "Shipped 6 production deployments solo & lead — idea to live production.",
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
  recruiters: {
    headline: "Production-Ready Developer with Government System Deployment Experience",
    body: "BS Computer Science graduate with internship experience at the Department of Trade and Industry (DTI). Proven capability in developing production local queue systems, automated frameworks, and security-first web apps. Available immediately for full-time software engineering positions.",
    points: [
      "Built and deployed government service queue & inventory ticketing systems.",
      "Delivered 6 production-grade systems from architecture to live deployment.",
      "Open to Remote, Hybrid, or On-site roles (Based in Philippines, UTC+8).",
      "Focus: Defensive programming, reliability, and clean architecture.",
    ],
    specs: [
      { key: "DEGREE", value: "BS Computer Science (2026)" },
      { key: "EXPERIENCE", value: "DTI Internship & 6 Deployments" },
      { key: "AVAILABILITY", value: "Immediate (Full-Time)" },
      { key: "LOCATION", value: "Philippines · Remote Ready" },
    ],
  },
  engineers: {
    headline: "Security-First Architecture, Real-Time WebSockets & Resilient Pipelines",
    body: "I build systems expecting failure modes. Obsessive about type safety, low latency, clean API boundaries, and maintainable codebases that eliminate single points of failure across both frontend and backend layers.",
    points: [
      "Real-time WebSocket ticketing with SQLite transaction integrity and WAL mode.",
      "Serverless parallel video rendering pipeline with stateful recovery layers.",
      "Google Foundation in Cybersecurity certified: defensive coding & network security.",
      "Clean API boundaries, zero unnecessary dependencies, predictable control flow.",
    ],
    specs: [
      { key: "PARADIGM", value: "Type-Safe & Modular" },
      { key: "DATABASE", value: "WAL Mode & RLS Scoping" },
      { key: "SECURITY", value: "OWASP Top 10 & JWT Memory" },
      { key: "PIPELINES", value: "Autonomous CI/CD & Lambda" },
    ],
  },
};

export function About() {
  const reducedMotion = useReducedMotion();
  const [activeRole, setActiveRole] = useState<RoleId>("services");
  const [selectedCertificate, setSelectedCertificate] = useState<typeof CERTIFICATES[number] | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Synchronize GSAP ScrollTrigger whenever the dynamic tab height shifts
  useEffect(() => {
    // 1. Immediate sync on state change
    ScrollTrigger.refresh();

    // 2. Secondary sync after Framer Motion exit/enter transitions finish (350ms duration)
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => clearTimeout(timer);
  }, [activeRole]);

  // Robust ResizeObserver on section container to auto-refresh ScrollTrigger on any layout or image load change
  useEffect(() => {
    if (typeof ResizeObserver === "undefined" || !sectionRef.current) return;

    let rafId: number | null = null;
    const resizeObserver = new ResizeObserver(() => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });

    resizeObserver.observe(sectionRef.current);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, []);

  const personaRoles = ROLES.filter((r) => r.group === "persona");
  const referenceRoles = ROLES.filter((r) => r.group === "reference");

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative px-6 sm:px-10 lg:px-16 xl:px-20 overflow-hidden border-t border-white/10 bg-[#07090E] scroll-mt-24"
      style={{
        paddingTop: "var(--section-gap, 140px)",
        paddingBottom: "clamp(48px, 5vw, 80px)",
      }}
    >
      {/* Strict Global Container Wrapper */}
      <div className="relative z-10 max-w-[1536px] mx-auto w-full space-y-12">
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
            <span>[ 03 // PERSPECTIVE & EXPERIENCE ]</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
            Tailored <span className="text-white/80">Perspective.</span>
          </h2>
        </motion.div>

        {/* ── Mobile role selector (< lg): 100% visible responsive segmented grid (no truncation/clipping) ── */}
        {/* ── Mobile role selector (< lg): Aerodynamic Cyber Pills with Auto-Centering Scroll-into-view ── */}
        <motion.div
          initial={reducedMotion ? undefined : { y: 16, opacity: 0 }}
          whileInView={reducedMotion ? undefined : { y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="lg:hidden flex flex-col gap-5"
        >
          {/* Row 1: Persona role pill carousel with center-lock scrolling */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider px-0.5">
              Select Role View:
            </div>

            <div
              className="relative w-full overflow-hidden"
              style={PILL_ROW_MASK}
            >
              <div className="flex items-center gap-2.5 overflow-x-auto snap-x snap-mandatory py-1 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {personaRoles.map((role) => {
                  const isActive = activeRole === role.id;
                  return (
                    <motion.button
                      key={role.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        setActiveRole(role.id);
                        e.currentTarget.scrollIntoView({
                          behavior: "smooth",
                          inline: "center",
                          block: "nearest",
                        });
                      }}
                      className={`snap-center shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full border font-mono text-xs sm:text-sm whitespace-nowrap transition-all duration-300 ${isActive
                        ? "bg-[#12151E] border-[#8cff2e] text-white shadow-[0_0_18px_rgba(140,255,46,0.22)] ring-1 ring-[#8cff2e]/40 font-bold"
                        : "bg-[#07090E]/90 border-white/10 text-[#94A3B8] hover:text-white hover:border-white/25 font-medium"
                        }`}
                    >
                      <span className={isActive ? "text-[#8cff2e]" : "text-slate-400"}>
                        {role.icon}
                      </span>
                      <span>{role.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8cff2e] shadow-[0_0_8px_#8cff2e] shrink-0 animate-pulse" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 2: Reference topic pill */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider px-0.5">
              Reference:
            </div>
            <div
              className="relative w-full overflow-hidden"
              style={PILL_ROW_MASK}
            >
              <div className="flex items-center gap-2.5 overflow-x-auto snap-x snap-mandatory py-1 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {referenceRoles.map((role) => {
                  const isActive = activeRole === role.id;
                  return (
                    <motion.button
                      key={role.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        setActiveRole(role.id);
                        e.currentTarget.scrollIntoView({
                          behavior: "smooth",
                          inline: "center",
                          block: "nearest",
                        });
                      }}
                      className={`snap-center shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full border font-mono text-xs sm:text-sm whitespace-nowrap transition-all duration-300 ${isActive
                        ? "bg-[#12151E] border-[#8cff2e] text-white shadow-[0_0_18px_rgba(140,255,46,0.22)] ring-1 ring-[#8cff2e]/40 font-bold"
                        : "bg-[#07090E]/90 border-white/10 text-[#94A3B8] hover:text-white hover:border-white/25 font-medium"
                        }`}
                    >
                      <span className={isActive ? "text-[#8cff2e]" : "text-slate-400"}>
                        {role.icon}
                      </span>
                      <span>{role.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8cff2e] shadow-[0_0_8px_#8cff2e] shrink-0 animate-pulse" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bi-Directional Entrance Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Grouped Role & Reference Selector — Desktop only (lg:) */}
          <motion.div
            initial={reducedMotion ? undefined : { x: -60, opacity: 0 }}
            whileInView={reducedMotion ? undefined : { x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] as const }}
            className="hidden lg:flex lg:col-span-4 flex-col gap-4"
          >
            {/* Group 1: Audience Personas */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <span>Select Role View:</span>
              </div>

              <div className="flex flex-col gap-2">
                {personaRoles.map((role) => {
                  const isActive = activeRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setActiveRole(role.id)}
                      className={`relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 font-mono text-sm group ${isActive
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
              </div>
            </div>

            {/* Group 2: Reference & Architecture Topics */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <span>Reference:</span>
              </div>

              <div className="flex flex-col gap-2">
                {referenceRoles.map((role) => {
                  const isActive = activeRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setActiveRole(role.id)}
                      className={`relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 font-mono text-sm group ${isActive
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
              </div>
            </div>

            {/* Resume Callout */}
            <div className="p-5 rounded-2xl bg-[#12151E] border border-white/10 space-y-2.5 mt-1">
              <div className="text-xs font-mono text-[#94A3B8]">
                Official Credentials & PDF CV:
              </div>
              <a
                href="/Kyrell_Santillan_Resume.pdf"
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
              {activeRole === "certificates" ? (
                /* Certificates & Industry Accreditations Reference View */
                <motion.div
                  key="certificates"
                  initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
                  animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="p-6 sm:p-10 rounded-2xl bg-[#12151E] border border-white/10 backdrop-blur-xl space-y-8 shadow-2xl relative overflow-hidden"
                >
                  <div>
                    <div className="text-xs font-mono text-[#8cff2e] uppercase tracking-widest mb-2">
                      [ VERIFIED CREDENTIALS & ACCREDITATIONS ]
                    </div>
                    <h3 className="font-display text-2xl sm:text-[28px] font-extrabold text-white leading-tight">
                      Official Certifications & Engineering Accreditations
                    </h3>
                    <p className="text-slate-200 text-base sm:text-[17px] leading-[1.6] font-normal mt-2">
                      Industry-recognized engineering qualifications verified by Google and freeCodeCamp spanning cybersecurity, defensive systems, UX architecture, and modern web development.
                    </p>
                  </div>

                  {/* 4 Interactive Certificate Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    {CERTIFICATES.map((cert) => (
                      <div
                        key={cert.id}
                        onClick={() => setSelectedCertificate(cert)}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#8cff2e]/40 hover:bg-white/[0.04] transition-all duration-300 group cursor-pointer flex flex-col justify-between space-y-3.5 shadow-lg"
                      >
                        {/* Certificate Image Frame */}
                        <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-white/10 bg-[#07090E] group-hover:border-[#8cff2e]/30 transition-all">
                          <Image
                            src={cert.image}
                            alt={cert.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 350px"
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#12151E]/90 border border-[#8cff2e] text-[#8cff2e] text-xs font-mono font-bold shadow-lg">
                              <ZoomIn className="w-3.5 h-3.5" />
                              <span>View Certificate</span>
                            </span>
                          </div>
                        </div>

                        {/* Certificate Meta */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2 py-0.5 rounded bg-[#8cff2e]/10 border border-[#8cff2e]/30 text-[#8cff2e] text-[10px] font-mono font-bold uppercase tracking-wider">
                              {cert.issuerTag}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              {cert.category}
                            </span>
                          </div>

                          <h4 className="font-sans font-bold text-white text-sm sm:text-base leading-snug group-hover:text-[#8cff2e] transition-colors">
                            {cert.title}
                          </h4>

                          <div className="flex flex-wrap gap-1 pt-1">
                            {cert.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Verified Footer Status */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8cff2e]">
                      <ShieldCheck className="w-4 h-4 text-[#8cff2e]" />
                      <span className="font-bold">4 ACCREDITED CERTIFICATIONS</span>
                    </div>
                    <span className="text-xs font-mono text-slate-500">[ 100% VERIFIED ]</span>
                  </div>
                </motion.div>
              ) : activeRole === "stack" ? (
                /* Tech Stack Categorized Reference View */
                <motion.div
                  key="stack"
                  initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
                  animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="p-6 sm:p-10 rounded-2xl bg-[#12151E] border border-white/10 backdrop-blur-xl space-y-8 shadow-2xl relative overflow-hidden"
                >
                  <div>
                    <div className="text-xs font-mono text-[#8cff2e] uppercase tracking-widest mb-2">
                      [ SYSTEM ARCHITECTURE & TOOLING ]
                    </div>
                    <h3 className="font-display text-2xl sm:text-[28px] font-extrabold text-white leading-tight">
                      Production Tech Stack & Framework Architecture
                    </h3>
                    <p className="text-slate-200 text-base sm:text-[17px] leading-[1.6] font-normal mt-2">
                      Comprehensive runtimes, frameworks, and infrastructure tools utilized across 6+ shipped production applications.
                    </p>
                  </div>

                  {/* 4 Categorized Stack Blocks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {TECH_CATEGORIES.map((cat, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3"
                      >
                        <div className="flex items-center gap-2 font-mono text-xs text-white font-bold uppercase tracking-wider">
                          {cat.icon}
                          <span>{cat.title}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-slate-300 font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stack Reference Footer */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8cff2e]">
                      <span className="w-2 h-2 rounded-full bg-[#8cff2e] animate-pulse" />
                      <span className="font-bold">PRODUCTION TOOLCHAIN</span>
                    </div>
                    <span className="text-xs font-mono text-slate-500">[ 100% SHIPPED CODE ]</span>
                  </div>
                </motion.div>
              ) : (
                /* Audience Persona View (Recruiters, Engineers, Founders) */
                <motion.div
                  key={activeRole}
                  initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
                  animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="p-6 sm:p-10 rounded-2xl bg-[#12151E] border border-white/10 backdrop-blur-xl space-y-8 shadow-2xl relative overflow-hidden"
                >
                  {/* 28px Headline Copy */}
                  <h3 className="font-display text-2xl sm:text-[28px] font-extrabold text-white leading-tight">
                    {PERSONA_CONTENT[activeRole].headline}
                  </h3>

                  {/* 18px Body Copy */}
                  <p className="text-slate-200 text-lg sm:text-[18px] leading-[1.6] font-normal">
                    {PERSONA_CONTENT[activeRole].body}
                  </p>

                  {/* ── Highlights List: Generous horizontal gap and clean vertical padding ── */}
                  <div className="space-y-4 pt-2">
                    <div className="text-xs font-mono text-[#94A3B8] uppercase tracking-widest">
                      Core Capability Highlights:
                    </div>
                    {/* 2-col desktop with generous 32px–48px horizontal gap, 1-col mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-3">
                      {PERSONA_CONTENT[activeRole].points.map((pt, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3.5 py-3.5 border-b border-white/[0.08] text-sm sm:text-[15px] text-slate-300 leading-relaxed"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#8cff2e] shrink-0 mt-1" />
                          <span className="font-light leading-relaxed">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Telemetry Specs Grid & Action Link */}
                  <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full sm:w-auto flex-1">
                      {PERSONA_CONTENT[activeRole].specs.map((sp, i) => (
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

                    {(activeRole === "services" || activeRole === "founders") && (
                      <motion.a
                        href="#contact"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-[#07090E] font-mono font-bold text-xs hover:bg-[#8cff2e] transition-all text-center flex items-center justify-center gap-2 shrink-0 shadow-md cursor-pointer"
                      >
                        <span>Discuss a Project</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Certificate Fullscreen Modal / Lightbox */}
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCertificate(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-[#12151E] border border-white/20 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#8cff2e]/10 border border-[#8cff2e]/30 text-[#8cff2e] text-xs font-mono font-bold">
                      {selectedCertificate.issuerTag}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {selectedCertificate.category}
                    </span>
                  </div>
                  <h3 className="font-sans font-bold text-white text-lg sm:text-xl">
                    {selectedCertificate.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  aria-label="Close certificate modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Certificate Full Image Display */}
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-white/10 bg-black flex-1 min-h-0">
                <Image
                  src={selectedCertificate.image}
                  alt={selectedCertificate.title}
                  fill
                  sizes="(max-width: 1200px) 90vw, 900px"
                  className="object-contain object-center"
                />
              </div>

              {/* Skills Footer */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs font-mono text-slate-400">
                <div className="flex flex-wrap gap-1.5">
                  {selectedCertificate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <span className="text-[#8cff2e] font-semibold">
                  Verified Qualification
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
