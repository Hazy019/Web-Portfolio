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
import { Mail, Github, Linkedin, Send, Quote } from "lucide-react";

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
    <section
      id="contact"
      className="relative py-[80px] lg:py-[140px] border-t border-white/10 bg-[#07090E] overflow-hidden"
    >
      <AmbientOrbs
        orbs={[
          {
            color: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
            size: "600px",
            top: "-20%",
            right: "-5%",
            opacity: 0.1,
            delay: "-15s",
          },
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

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 w-full space-y-20 relative z-10">
        {/* ── Upgraded Recommendation Quote Card (#0d1017 glass surface) ────── */}
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="p-8 sm:p-12 md:p-16 rounded-2xl border border-white/10 bg-[#0d1017]/70 backdrop-blur-xl relative overflow-hidden text-center space-y-6 shadow-2xl">
            <motion.div
              initial={reducedMotion ? undefined : { scale: 0, opacity: 0 }}
              whileInView={reducedMotion ? undefined : { scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center"
            >
              <Quote className="w-10 h-10 text-[#8cff2e]/80" />
            </motion.div>

            <blockquote className="font-serif italic font-light text-[22px] sm:text-[25px] md:text-[28px] text-[#FFFFFF] leading-relaxed max-w-3xl mx-auto">
              &ldquo;Kyrell builds like someone who has already thought about what happens when
              things go wrong. His systems are defensible and his interfaces are genuinely
              considered — a combination that&apos;s rarer than it should be.&rdquo;
            </blockquote>

            <div className="font-mono text-xs sm:text-sm text-[#8cff2e] font-semibold tracking-widest uppercase pt-2">
              — RESEARCH ADVISER, CS DEPARTMENT
            </div>
          </div>
        </motion.div>

        {/* ── 2-Column Grid (1fr 1fr, Gap 64px–80px) ────────────────────────── */}
        <motion.div
          variants={reducedMotion ? undefined : containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 pt-4 items-start"
        >
          {/* Left Column: Heading (Fluid Clamp clamp(2.5rem, 4.5vw, 4rem)), Copy & Social Pills */}
          <div className="space-y-8">
            {/* Eyebrow Badge */}
            <motion.div
              variants={reducedMotion ? undefined : itemVariants}
              className="inline-flex items-center gap-2 text-xs font-mono text-[#8cff2e] uppercase tracking-widest"
            >
              <span className="w-2 h-2 rounded-full bg-[#8cff2e] animate-pulse" />
              <span>[ 05 // CONTACT & INQUIRIES ]</span>
            </motion.div>

            {/* Headline Display Fluid Clamp Sizing: clamp(2.5rem, 4.5vw, 4rem) */}
            <motion.h2
              initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(2.5rem,4.5vw,4rem)] font-extrabold text-white leading-[1.05] tracking-tight"
            >
              Let&apos;s build <br />
              <span className="text-white/80 transition-all duration-300">
                {rotatingWords[wordIdx]}
              </span>
            </motion.h2>

            <motion.p
              variants={reducedMotion ? undefined : itemVariants}
              className="text-[#94A3B8] text-base sm:text-lg leading-[1.6] font-normal"
            >
              Open to full-time engineering roles, contract projects, and research opportunities.
              Based in the Philippines (UTC+8) and available remotely worldwide. I respond to every
              message.
            </motion.p>

            {/* Social Link Pills */}
            <motion.div
              variants={reducedMotion ? undefined : itemVariants}
              className="space-y-3 font-mono text-sm"
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
          <motion.div variants={reducedMotion ? undefined : formVariants}>
            <form
              onSubmit={handleSubmit}
              className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-[#12151E] backdrop-blur-xl space-y-6 shadow-2xl"
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
            </form>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto pt-20 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#94A3B8] gap-4">
          <div className="font-display text-base font-extrabold text-white">
            H<span className="text-[#8cff2e]">AZY</span>
          </div>
          <div>© 2026 Kyrell Santillan · Built with obsession 🇵🇭</div>
        </footer>
      </div>
    </section>
  );
}
