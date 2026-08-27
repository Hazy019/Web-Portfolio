"use client";

import React, { useState, useEffect } from "react";
import { Loader } from "@/components/Loader";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { CoordinateGrid } from "@/components/CoordinateGrid";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Work } from "@/components/Work";
import { PhilosophyQuote } from "@/components/PhilosophyQuote";
import { About } from "@/components/About";
import { LogoStrip } from "@/components/LogoStrip";
import { Contact } from "@/components/Contact";

import { DocModal } from "@/components/DocModal";
import { ProjectData } from "@/lib/projectsData";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[HAZY App Error Boundary Caught Exception]:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-6 text-center font-mono space-y-4">
          <div className="text-red-400 text-xs tracking-widest uppercase">[ SYSTEM RECOVERY ]</div>
          <h1 className="text-2xl font-bold font-display">Something slipped in runtime execution.</h1>
          <p className="text-sm text-slate-400 max-w-md">
            {this.state.error?.message || "A client exception was safely intercepted."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl bg-white text-[#07090e] font-bold text-xs hover:bg-[#8cff2e] transition-colors"
          >
            Reboot Interface
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeSection, setActiveSection] = useState("intro");
  const activeSectionRef = React.useRef("intro");
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [hoverContext, setHoverContext] = useState<{
    num: string;
    type: string;
    title: string;
  } | null>(null);

  // Active section scroll spy with viewport center detection & URL hash synchronization
  useEffect(() => {
    // Registered sections ordered from bottom to top for reverse scan
    const trackedSections = [
      { id: "contact", navId: "contact" },
      { id: "testimonial", navId: "contact" },
      { id: "philosophy", navId: "philosophy" },
      { id: "about", navId: "about" },
      { id: "projects", navId: "projects" },
      { id: "intro", navId: "intro" },
    ];

    const handleScroll = () => {
      // Bottom of page guarantee: if near bottom, always activate contact
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 120;

      if (isAtBottom) {
        if (activeSectionRef.current !== "contact") {
          activeSectionRef.current = "contact";
          setActiveSection("contact");
          if (typeof window !== "undefined" && window.history?.replaceState) {
            window.history.replaceState(null, "", "#contact");
          }
        }
        return;
      }

      const targetThreshold = window.innerHeight * 0.45;
      let matchedNavId = "intro";

      for (const section of trackedSections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= targetThreshold && rect.bottom >= 80) {
            matchedNavId = section.navId;
            break;
          }
        }
      }

      if (matchedNavId !== activeSectionRef.current) {
        activeSectionRef.current = matchedNavId;
        setActiveSection(matchedNavId);

        // Update URL hash dynamically without history pollution
        if (typeof window !== "undefined" && window.history?.replaceState) {
          const newHash =
            matchedNavId === "intro"
              ? window.location.pathname + window.location.search
              : `#${matchedNavId}`;
          if (window.location.hash !== (matchedNavId === "intro" ? "" : `#${matchedNavId}`)) {
            window.history.replaceState(null, "", newHash);
          }
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Sync with Lenis scroll stream
    const lenis = (window as any).lenis;
    if (lenis && typeof lenis.on === "function") {
      lenis.on("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (lenis && typeof lenis.off === "function") {
        lenis.off("scroll", handleScroll);
      }
    };
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
    <ErrorBoundary>
      <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
        <Loader onComplete={() => setIsLoaded(true)} />
        <CustomCursor />

        {/* Grid overlay, Coordinate telemetry & Noise background */}
        <div className="grid-overlay" />
        <CoordinateGrid />
        <div className="noise-overlay" />

        {/* Floating Minimal Pill Progress Indicator */}
        <Navbar
          activeSection={activeSection}
          isModalOpen={!!activeModalId}
        />

        {/* Full Width Main Content Layout */}
        <div className="relative z-10">
          <Hero />
          <Marquee />
          <Work
            onOpenDoc={(id) => setActiveModalId(id)}
            onHoverProject={handleHoverProject}
          />
          <About />
          <PhilosophyQuote />
          <LogoStrip onSelectProject={(id) => setActiveModalId(id)} />
          <Contact />
        </div>

        {/* Documentation Modal */}
        <DocModal
          projectId={activeModalId}
          onClose={() => setActiveModalId(null)}
          onSelectProject={(id) => setActiveModalId(id)}
        />
      </main>
    </ErrorBoundary>
  );
}
