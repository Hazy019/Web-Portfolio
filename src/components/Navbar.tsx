"use client";

/**
 * Navbar — Floating Glass Capsule Nav with Smooth Sliding Active Pill (§5)
 *
 * Typography: 14px (text-sm) medium weight for immediate legibility.
 * Container: Glassmorphism (backdrop-filter: blur(16px), border: 1px solid rgba(255,255,255,0.08)).
 * Sliding Pill: Smooth layoutId background pill transition beneath active item.
 */

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FileText, Send, Menu, X } from "lucide-react";

interface NavbarProps {
  activeSection: string;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  isModalOpen?: boolean;
}

export function Navbar({ activeSection, theme, onToggleTheme, isModalOpen = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const navItems = [
    { id: "intro", num: "01", label: "Intro" },
    { id: "projects", num: "02", label: "Projects" },
    { id: "about", num: "03", label: "About" },
    { id: "philosophy", num: "04", label: "Philosophy" },
    { id: "contact", num: "05", label: "Contact" },
  ];

  useEffect(() => {
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let directionChangeY = lastScrollY;
    let isLastScrollDown = false;
    let rafId: number | null = null;

    const checkScroll = (e?: any) => {
      const scrollYVal = typeof e?.scroll === "number" ? e.scroll : window.scrollY;
      const currentY = Math.max(0, scrollYVal);
      setScrolled(currentY > 40);

      // Dead zone (top 120px) or open modal / mobile drawer -> always visible
      if (currentY <= 120 || isOpen || isModalOpen) {
        setIsHidden(false);
        lastScrollY = currentY;
        directionChangeY = currentY;
        isLastScrollDown = false;
        return;
      }

      const delta = currentY - lastScrollY;

      // Ignore zero velocity / resting state: HOLD CURRENT STATE UNCHANGED!
      if (Math.abs(delta) < 3) {
        return;
      }

      const isScrollingDown = delta > 0;

      if (isScrollingDown) {
        if (!isLastScrollDown) {
          directionChangeY = currentY;
          isLastScrollDown = true;
        }
        if (currentY - directionChangeY > 140) {
          setIsHidden(true);
        }
      } else {
        if (isLastScrollDown) {
          directionChangeY = currentY;
          isLastScrollDown = false;
        }
        if (directionChangeY - currentY > 60) {
          setIsHidden(false);
        }
      }

      lastScrollY = currentY;
    };

    const handleScroll = (e?: any) => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => checkScroll(e));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Also attach to Lenis scroll if available for pinned section sync
    const lenis = (window as any).lenis;
    if (lenis && typeof lenis.on === "function") {
      lenis.on("scroll", handleScroll);
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      if (lenis && typeof lenis.off === "function") {
        lenis.off("scroll", handleScroll);
      }
    };
  }, [isOpen, isModalOpen]);

  return (
    <header
      className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-8 flex justify-center pointer-events-none transition-transform duration-300"
      style={{
        transform: isHidden ? "translateY(-140%)" : "translateY(0%)",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Floating Glass Capsule Nav (backdrop-filter: blur(16px), border: 1px solid rgba(255,255,255,0.08)) */}
      <div
        className={`pointer-events-auto flex items-center justify-between gap-4 sm:gap-8 px-5 py-2.5 sm:px-7 sm:py-3 rounded-full border transition-all duration-300 ${scrolled
            ? "bg-[#07090E]/90 border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.9)]"
            : "bg-[#07090E]/80 border-white/10 shadow-2xl"
          }`}
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Brand Logo & Live Status Dot */}
        <a
          href="#intro"
          className="flex items-center gap-3 group shrink-0"
          aria-label="HAZY — Back to Top"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/15 flex items-center justify-center group-hover:border-[#8cff2e] transition-colors">
            <Image
              src="/logo.png"
              alt="HAZY"
              width={22}
              height={22}
              className="object-contain"
            />
          </div>
          <span className="font-display font-extrabold text-base tracking-wider text-white hidden xs:inline">
            H<span className="text-[#8cff2e]">AZY</span>
          </span>
        </a>

        {/* Live Status Pill */}
        <div className="hidden md:flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#94A3B8]">
          <span className="w-2 h-2 rounded-full bg-[#8cff2e] animate-pulse" />
          <span className="text-white font-medium">[ ONLINE ]</span>
        </div>

        {/* Center Sliding Pill Navigation (14px font-medium) */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 relative">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`relative flex items-center gap-2 py-1.5 px-4 rounded-full text-sm font-medium z-10 transition-colors duration-200 ${isActive ? "text-white font-bold" : "text-[#94A3B8] hover:text-white"
                  }`}
              >
                {/* Smooth Sliding Pill Background */}
                {isActive && (
                  <motion.div
                    layoutId="navbarActivePill"
                    className="absolute inset-0 bg-white/15 border border-white/20 rounded-full shadow-lg z-[-1]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="text-[11px] font-mono opacity-50">{item.num}</span>
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="/Kyrell_Santillan_Resume.pdf"
            download
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 font-mono text-xs font-medium transition-all hover:border-white/30"
          >
            <FileText className="w-3.5 h-3.5 text-[#8cff2e]" />
            <span>CV</span>
          </a>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=santillankyrell@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-white hover:bg-[#8cff2e] text-[#07090E] font-mono font-bold text-xs transition-all shadow-lg flex items-center gap-1.5"
          >
            <Send className="w-3 h-3" />
            <span className="hidden xs:inline">Talk</span>
          </a>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-full border border-white/15 bg-white/5 text-slate-200 hover:text-white"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="pointer-events-auto absolute top-20 left-4 right-4 bg-[#07090E]/95 backdrop-blur-2xl border border-white/15 p-6 rounded-2xl space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 max-w-md mx-auto">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono text-xs text-white">
            <span>[ SYSTEM NAV ]</span>
            <span className="text-[#94A3B8]">{navItems.length} SECTIONS</span>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between py-3 px-4 rounded-xl font-mono text-sm ${activeSection === item.id
                    ? "text-white bg-white/10 font-bold border border-white/20"
                    : "text-[#94A3B8] hover:bg-white/5"
                  }`}
              >
                <span>{item.label}</span>
                <span className="text-xs opacity-50">{item.num}</span>
              </a>
            ))}
          </nav>

          <div className="flex gap-2 pt-2 border-t border-white/10">
            <a
              href="/Kyrell_Santillan_Resume.pdf"
              download
              className="flex-1 py-2.5 text-center rounded-xl border border-white/15 bg-white/5 text-slate-200 font-mono text-xs"
            >
              Resume
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=santillankyrell@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 text-center rounded-xl bg-white text-[#07090E] font-mono font-bold text-xs"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
