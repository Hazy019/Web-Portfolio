"use client";

import { useState, useEffect } from "react";
import { Loader } from "@/components/Loader";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { CoordinateGrid } from "@/components/CoordinateGrid";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Work } from "@/components/Work";
import { PhilosophyQuote } from "@/components/PhilosophyQuote";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";

import { DocModal } from "@/components/DocModal";
import { ProjectData } from "@/lib/projectsData";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeSection, setActiveSection] = useState("intro");
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [hoverContext, setHoverContext] = useState<{
    num: string;
    type: string;
    title: string;
  } | null>(null);

  // Active section scroll spy with viewport center detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["intro", "about", "philosophy", "projects", "contact"];
      const targetThreshold = window.innerHeight * 0.4;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= targetThreshold && rect.bottom >= 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const handleHoverProject = (project: ProjectData | null) => {
    if (project) {
      setHoverContext({
        num: project.num,
        type: project.type,
        title: project.title,
      });
    } else {
      setHoverContext(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 relative">
      <Loader onComplete={() => setIsLoaded(true)} />
      <CustomCursor />

      {/* Grid overlay, Coordinate telemetry & Noise background */}
      <div className="grid-overlay" />
      <CoordinateGrid />
      <div className="noise-overlay" />

      {/* Floating Minimal Pill Progress Indicator */}
      <Navbar
        activeSection={activeSection}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Full Width Main Content Layout */}
      <div className="relative z-10">
        <Hero />
        <Marquee />
        <About />
        <PhilosophyQuote />
        <Work
          onOpenDoc={(id) => setActiveModalId(id)}
          onHoverProject={handleHoverProject}
        />
        <Contact />
      </div>

      {/* Documentation Modal */}
      <DocModal
        projectId={activeModalId}
        onClose={() => setActiveModalId(null)}
        onSelectProject={(id) => setActiveModalId(id)}
      />
    </main>
  );
}
