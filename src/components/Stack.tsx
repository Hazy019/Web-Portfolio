"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function Stack() {
  const reducedMotion = useReducedMotion();

  const categories = [
    {
      name: "Frontend",
      skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Flutter", "Figma", "HTML5/CSS"],
    },
    {
      name: "Backend",
      skills: ["Python", "Django", "Flask", "Node.js", "Express", "PostgreSQL", "SQLite", "REST APIs", "WebSockets"],
    },
    {
      name: "Security",
      skills: ["Cybersecurity Fundamentals", "Secure Coding", "JWT Auth", "Linux", "Git", "Network Analysis"],
    },
    {
      name: "Automation",
      skills: ["Python Automation", "AWS Lambda", "Remotion", "Selenium", "NLP", "Voice AI", "Kiosk Dev"],
    },
  ];

  return (
    <section id="stack" className="relative py-24 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            The Arsenal
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
            Technical <span className="accent-txt">Stack.</span>
          </h2>
        </div>

        {/* Stack Category Rows */}
        <div className="space-y-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={reducedMotion ? {} : { opacity: 0, x: -10 }}
              whileInView={reducedMotion ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-6 rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-xl flex flex-col md:flex-row md:items-center gap-4 justify-between hover:border-emerald-500/30 transition-all"
            >
              <div className="font-mono text-sm font-bold text-emerald-400 uppercase tracking-wider md:w-40 shrink-0">
                {cat.name}
              </div>

              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-mono text-slate-200 hover:border-emerald-400/50 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
