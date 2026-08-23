"use client";

/**
 * Contact — Fluid Clamp Typography, 2-Column Grid (1fr 1fr), Upgraded Quote Card & Staggered Entrance (§5)
 *
 * Vertical Padding: py-[80px] lg:py-[140px] (140px desktop / 80px mobile equity spacing).
 * Grid: 2-Column Grid (display: grid; grid-template-columns: 1fr 1fr; gap: 64px / 80px).
 * Headline: Fluid clamp sizing font-size: clamp(2.5rem, 4.5vw, 4rem) with line-height: 1.05. Zero text slip behind form.
 * Upgraded Quote Card: 24px-28px italic serif white (#FFFFFF), author tag in JetBrains Mono neon green (#8CFF2E), p-12 md:p-16 glass backdrop.
 * Inputs: Enlarge height to 52px (h-[52px]), 1px neon green focus bloom (#8CFF2E).
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { AmbientOrbs } from "./AmbientOrbs";
import { Mail, Github, Linkedin, Send, Quote, GraduationCap, Lock, ShieldCheck } from "lucide-react";
import { FitText } from "./FitText";

export function Contact() {
  const reducedMotion = useReducedMotion();
  const rotatingWords = ["something.", "extraordinary.", "resilient.", "defensible."];
  const [wordIdx, setWordIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [reducedMotion, rotatingWords.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const formVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <>
      {/* ── Trust & Validation Section (§36 Two-Tier Hierarchy) ────── */}
      <section
        id="testimonial"
        className="relative border-t border-white/10 bg-[#07090E] overflow-hidden"
        style={{
          paddingTop: "var(--section-gap, 140px)",
          paddingBottom: "clamp(60px, 6vw, 100px)",
        }}
      >
        <AmbientOrbs
          orbs={[
            {
              color: "radial-gradient(circle, rgba(140,255,46,0.08) 0%, transparent 70%)",
              size: "500px",
              top: "-20%",
              right: "-5%",
              opacity: 0.08,
              delay: "-15s",
            },
          ]}
        />
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 w-full relative z-10 space-y-8">
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
              <span>[ 05 // TRUST & VALIDATION ]</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
              Endorsements & <span className="text-white/80">Proof.</span>
            </h2>
          </motion.div>

          {/* Primary Tier: Formal Academic Recommendation (High Prominence) */}
          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0, y: 35 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: "rgba(13, 16, 23, 0.75)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
            className="p-8 sm:p-10 md:p-12 rounded-2xl shadow-2xl relative overflow-hidden"
          >
            {/* Subtle internal accent ambient glow */}
            <div
              aria-hidden="true"
              className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full pointer-events-none opacity-25"
              style={{
                background: "radial-gradient(circle, rgba(140,255,46,0.4) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Author Metadata */}
              <div className="lg:col-span-5 space-y-4 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border border-[#8cff2e]/30 bg-gradient-to-br from-[#8cff2e]/10 via-slate-900 to-slate-950 flex items-center justify-center flex-shrink-0 relative shadow-[0_0_20px_rgba(140,255,46,0.15)] ring-1 ring-white/10">
                    <GraduationCap className="w-6 h-6 text-[#8cff2e]" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#8cff2e] ring-2 ring-[#030712] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#030712]" />
                    </span>
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-white text-base sm:text-lg leading-tight">
                      Prof. Jose Mari
                    </h4>
                    <p className="font-mono text-xs text-[#8cff2e] tracking-wider uppercase">
                      Technical Adviser
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-white/80 font-medium">
                    Technological Institute of the Philippines
                  </div>
                  <div className="font-mono text-xs text-[#94A3B8] opacity-60 uppercase tracking-wider font-medium">
                    CS Department Faculty
                  </div>
                </div>
              </div>

              {/* Right Quotation */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[#8cff2e] font-serif text-4xl leading-none select-none font-bold">
                    &ldquo;
                  </span>
                  <span className="font-mono text-xs text-[#8cff2e] tracking-widest uppercase">
                    Formal Academic Recommendation
                  </span>
                </div>

                <p className="font-sans text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed italic">
                  &ldquo;Kyrell demonstrated exceptional technical initiative and architecture skills during the development of critical departmental systems. His ability to turn complex logistical queue requirements into high-throughput, fault-tolerant web software is outstanding for a software engineer.&rdquo;
                </p>

                <div className="pt-2 flex items-center justify-between text-xs font-mono text-white/60">
                  <span>CAPSTONE EVALUATION</span>
                  <span className="text-[#8cff2e] font-semibold">SCORE: 1.00 (EXCELLENT)</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Secondary Tier: Client & Stakeholder Proof (Visually Demoted §36) */}
          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="p-5 sm:p-6 rounded-xl border border-white/[0.06] bg-[#0d1017]/50 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#8cff2e] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-white font-semibold tracking-wide flex items-center gap-2">
                  <span>Client & Stakeholder Proof</span>
                  <span className="text-[10px] text-slate-500 font-normal">[ SYSTEM VALIDATION ]</span>
                </div>
                <div className="text-[#94A3B8] text-[11px]">
                  Government & SaaS deliverables validated in live production with zero downtime.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 self-end sm:self-center">
              <span>POWERED BY</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white font-bold">ClientEcho Engine</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Form Section (#contact anchor target with scroll-margin-top) ────── */}
      <section
        id="contact"
        className="relative border-t border-white/10 bg-[#07090E] overflow-hidden scroll-mt-28"
        style={{
          paddingTop: "var(--section-gap, 140px)",
          paddingBottom: "var(--section-gap, 140px)",
        }}
      >
        <AmbientOrbs
          orbs={[
            {
              color: "radial-gradient(circle, rgba(140,255,46,0.06) 0%, transparent 70%)",
              size: "450px",
              bottom: "5%",
              left: "-8%",
              opacity: 0.08,
              delay: "-40s",
            },
          ]}
        />

        <div className="max-w-[1280px] mx-auto px-6 md:px-12 w-full relative z-10">
          {/* ── 2-Column Grid (12-Col System: Balanced 6-Col Content / 6-Col Form) ────────────────── */}
          <motion.div
            variants={reducedMotion ? undefined : containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-4 items-start"
          >
            {/* Left Column: Heading (Fluid Clamp clamp(1.75rem, 4vw, 3.5rem)), Copy & Social Pills */}
            <div className="lg:col-span-6 space-y-8 min-w-0 overflow-visible relative z-20">
              {/* Eyebrow Badge */}
              <motion.div
                variants={reducedMotion ? undefined : itemVariants}
                className="inline-flex items-center gap-2 text-xs font-mono text-[#8cff2e] uppercase tracking-widest"
              >
                <span className="w-2 h-2 rounded-full bg-[#8cff2e] animate-pulse" />
                <span>[ 06 // CONTACT & INQUIRIES ]</span>
              </motion.div>

              {/* Headline Display Fluid Clamp Sizing with Auto-Fitting Rotating Suffix */}
              <motion.h2
                initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[clamp(2.5rem,4vw,3.5rem)] font-extrabold text-white leading-[1.1] tracking-tight break-words overflow-visible relative z-20"
              >
                <span>Let&apos;s build</span>
                <FitText
                  minFontSize={16}
                  containerClassName="overflow-visible relative z-20"
                  className="text-white/80 transition-all duration-300 block pb-1 overflow-visible relative z-20"
                >
                  {rotatingWords[wordIdx]}
                </FitText>
              </motion.h2>

              <motion.p
                variants={reducedMotion ? undefined : itemVariants}
                className="text-[#94A3B8] text-base sm:text-lg leading-[1.6] font-normal max-w-xl"
              >
                Open to full-time engineering roles, contract projects, and research opportunities.
                Based in the Philippines (UTC+8) and available remotely worldwide. I respond to every
                message.
              </motion.p>

              {/* Social Link Pills */}
              <motion.div
                variants={reducedMotion ? undefined : itemVariants}
                className="space-y-3 font-mono text-sm max-w-xl"
              >
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=santillankyrell@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-[#12151E] hover:border-white/30 hover:bg-white/5 transition-all text-slate-200 group shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#8cff2e]" />
                    <span className="text-[#94A3B8] text-xs uppercase tracking-wider">Email</span>
                  </div>
                  <span className="text-white group-hover:text-[#8cff2e] transition-colors font-medium">
                    santillankyrell@gmail.com →
                  </span>
                </a>

                <a
                  href="https://wa.me/639912443422?text=Hello%20Kyrell%2C%20I%27d%20like%20to%20connect%20regarding%20a%20project!"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact Kyrell on WhatsApp"
                  className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-[#12151E] hover:border-white/30 hover:bg-white/5 transition-all text-slate-200 group shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-4 h-4 text-[#25D366] fill-current"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.979-.276-.1-.477-.15-.678.15-.2.301-.777.979-.953 1.18-.175.201-.351.226-.652.075-.301-.15-1.272-.469-2.424-1.496-.895-.798-1.5-1.784-1.675-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.201-.301.301-.502.1-.201.05-.377-.025-.527-.075-.15-.678-1.634-.929-2.238-.244-.588-.493-.509-.678-.518l-.577-.01c-.201 0-.527.075-.803.377s-1.054 1.03-1.054 2.511 1.079 2.912 1.23 3.113c.15.201 2.124 3.243 5.145 4.549.719.311 1.281.497 1.719.636.723.23 1.381.197 1.902.12.58-.087 1.78-.728 2.03-1.431.251-.703.251-1.305.176-1.431-.075-.126-.276-.201-.577-.351zM12.042 2c-5.522 0-10 4.477-10 10 0 1.764.459 3.423 1.261 4.871L2 22l5.301-1.258A9.957 9.957 0 0012.042 22c5.523 0 10-4.477 10-10s-4.477-10-10-10z" />
                    </svg>
                    <span className="text-[#94A3B8] text-xs uppercase tracking-wider">WhatsApp</span>
                  </div>
                  <span className="text-slate-300 group-hover:text-white transition-colors font-medium">
                    +63 991 244 3422 →
                  </span>
                </a>

                <a
                  href="https://github.com/Hazy019"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-[#12151E] hover:border-white/30 hover:bg-white/5 transition-all text-slate-200 group shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <Github className="w-4 h-4 text-[#8cff2e]" />
                    <span className="text-[#94A3B8] text-xs uppercase tracking-wider">GitHub</span>
                  </div>
                  <span className="text-slate-300 group-hover:text-white transition-colors font-medium">
                    @hazy019 →
                  </span>
                </a>

                <a
                  href="https://linkedin.com/in/kyrell-santillan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-[#12151E] hover:border-white/30 hover:bg-white/5 transition-all text-slate-200 group shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-4 h-4 text-[#8cff2e]" />
                    <span className="text-[#94A3B8] text-xs uppercase tracking-wider">LinkedIn</span>
                  </div>
                  <span className="text-slate-300 group-hover:text-white transition-colors font-medium">
                    Kyrell Santillan →
                  </span>
                </a>
              </motion.div>
            </div>

            {/* Right Column: Contact Form Box */}
            <motion.div variants={reducedMotion ? undefined : formVariants} className="lg:col-span-6 min-w-0 w-full mx-auto lg:mx-0 relative z-10">
              <form
                onSubmit={handleSubmit}
                className="p-8 sm:p-10 md:p-12 rounded-2xl border border-white/10 bg-[#12151E] backdrop-blur-xl space-y-6 shadow-2xl"
              >
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-mono text-[#94A3B8] uppercase tracking-wider font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className="w-full px-4 h-[52px] rounded-xl border border-white/10 bg-[#07090E] text-white placeholder:text-slate-600 focus:outline-none focus:border-[#8cff2e] focus:ring-1 focus:ring-[#8cff2e]/30 transition-all text-sm font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-mono text-[#94A3B8] uppercase tracking-wider font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@company.com"
                    className="w-full px-4 h-[52px] rounded-xl border border-white/10 bg-[#07090E] text-white placeholder:text-slate-600 focus:outline-none focus:border-[#8cff2e] focus:ring-1 focus:ring-[#8cff2e]/30 transition-all text-sm font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-mono text-[#94A3B8] uppercase tracking-wider font-medium">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can I help you build?"
                    className="w-full p-4 rounded-xl border border-white/10 bg-[#07090E] text-white placeholder:text-slate-600 focus:outline-none focus:border-[#8cff2e] focus:ring-1 focus:ring-[#8cff2e]/30 transition-all text-sm font-sans"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 rounded-xl bg-white hover:bg-[#8cff2e] text-[#07090E] font-mono font-bold text-base transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitted ? "Message Transmitted!" : "Send Message"}</span>
                </motion.button>

                {/* Direct Data-Handling Trust Note */}
                <p className="text-[11px] font-mono text-slate-500 text-center flex items-center justify-center gap-1.5 pt-1">
                  <Lock className="w-3 h-3 text-[#8cff2e]/70 shrink-0" />
                  <span>Direct transmission to inbox only. Zero tracking, no third-party data broker storage.</span>
                </p>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Standalone Footer Ribbon (Clear separation mt-16/lg:mt-24 & Tight vertical padding py-4/py-5) ────── */}
      <footer className="w-full mt-6 lg:mt-6 border-t border-white/10 bg-[#07090E] py-6 sm:py-7 px-12 lg:px-24 relative z-10">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#94A3B8] gap-3">
          <div className="font-display text-base font-extrabold text-white">
            H<span className="text-[#8cff2e]">AZY</span>
          </div>
          <div>© 2026 Kyrell Santillan · Built with obsession 🇵🇭</div>
        </div>
      </footer>
    </>
  );
}
