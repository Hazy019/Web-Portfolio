"use client";

/**
 * Navbar — Floating Glass Capsule Nav with Progressive Disclosure (§5)
 *
 * State 1 (Expanded / Near Top): Full HAZY wordmark + labeled Talk button.
 * State 2 (Compact / Past Hero): Icon-only capsule + chat bubble icon + hamburger.
 * Transition: Smooth animated width/opacity with zero layout shift.
 */

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, MessageSquare, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface NavbarProps {
  activeSection: string;
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
  isModalOpen?: boolean;
}

export function Navbar({ activeSection, isModalOpen = false }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const navItems = [
    { id: "intro", num: "01", label: "Intro" },
    { id: "projects", num: "02", label: "Projects" },
    { id: "about", num: "03", label: "About" },
    { id: "philosophy", num: "04", label: "Philosophy" },
    { id: "contact", num: "05", label: "Contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false);

    const el = document.getElementById(id);
    if (!el) return;

    // Use requestAnimationFrame to ensure drawer state update doesn't cancel smooth scroll
    requestAnimationFrame(() => {
      if (id === "intro") {
        const lenis = (window as any).lenis;
        if (lenis && typeof lenis.scrollTo === "function") {
          lenis.scrollTo(0, { duration: 1.0, lock: false });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      const navOffset = window.innerWidth >= 1024 ? 40 : 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.scrollTo === "function") {
        lenis.scrollTo(el, {
          offset: -navOffset,
          duration: 1.0,
          lock: false,
        });
      } else {
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth",
        });
      }
    });
  };

  useEffect(() => {
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let directionChangeY = lastScrollY;
    let isLastScrollDown = false;
    let rafId: number | null = null;

    const checkScroll = (e?: any) => {
      const scrollYVal = typeof e?.scroll === "number" ? e.scroll : window.scrollY;
      const currentY = Math.max(0, scrollYVal);
      setScrolled(currentY > 40);

      // Progressive disclosure: Compact once scrolled past Hero (~320px) or away from intro
      setIsCompact(currentY > 320);

      // Dead zone (top 120px) or open modal / mobile drawer -> always visible
      if (currentY <= 120 || isOpen || isModalOpen) {
        setIsHidden(false);
        lastScrollY = currentY;
        directionChangeY = currentY;
        isLastScrollDown = false;
        return;
      }

      const delta = currentY - lastScrollY;

      // Ignore zero velocity / resting state
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

    // Attach to Lenis scroll for sync
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
      className="fixed top-4 sm:top-6 left-0 right-0 z-50 px-3 sm:px-8 flex justify-center pointer-events-none transition-transform duration-300"
      style={{
        transform: isHidden ? "translateY(-140%)" : "translateY(0%)",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Floating Glass Capsule Nav with Smooth Adaptive Transitions */}
      <div
        className={`pointer-events-auto flex items-center justify-between border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isCompact
            ? "gap-2 sm:gap-4 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full"
            : "gap-2.5 sm:gap-6 px-3 py-2 sm:px-6 sm:py-2.5 rounded-full"
        } ${
          scrolled
            ? "bg-[var(--bg-panel)] border-[var(--border-subtle)] shadow-[var(--glass-shadow)]"
            : "bg-[var(--bg-panel)] border-[var(--border-subtle)] shadow-xl"
        }`}
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Left Cluster: Brand Logo, Wordmark & Live Status Badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="#intro"
            className="flex items-center gap-2 group shrink-0"
            aria-label="HAZY — Back to Top"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 border border-[var(--border-subtle)] flex items-center justify-center group-hover:border-[var(--accent-primary)] transition-colors shrink-0">
              <Image
                src="/logo.png"
                alt="HAZY Mark"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <span
              className={`font-display font-extrabold text-base tracking-wider text-[var(--text-primary)] whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isCompact
                  ? "w-0 max-w-0 opacity-0 -translate-x-2 pointer-events-none"
                  : "max-w-[100px] opacity-100 translate-x-0"
              }`}
            >
              H<span className="text-[var(--accent-primary)]">AZY</span>
            </span>
          </a>

          {/* Live Status Telemetry */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-mono text-[var(--accent-primary)] tracking-wider shrink-0 font-semibold">
            <span>[ ONLINE ]</span>
          </div>
        </div>

        {/* Center Sliding Pill Navigation (Desktop lg:flex) */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-[var(--border-subtle)] relative">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`relative flex items-center gap-2 py-1.5 px-4 rounded-full text-sm font-medium z-10 transition-colors duration-200 ${
                  isActive ? "text-[var(--text-primary)] font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {/* Smooth Sliding Pill Background */}
                {isActive && (
                  <motion.div
                    layoutId="navbarActivePill"
                    className="absolute inset-0 bg-white/15 border border-[var(--border-subtle)] rounded-full shadow-lg z-[-1]"
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
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Theme Toggle Button with Micro-Spring Physics */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="w-8 h-8 rounded-full border border-[var(--border-subtle)] bg-white/5 hover:bg-white/10 text-[var(--text-primary)] flex items-center justify-center transition-colors cursor-pointer relative"
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5 text-[#8cff2e] transition-transform duration-300 rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#059669] transition-transform duration-300 rotate-0 hover:-rotate-12" />
            )}
          </motion.button>

          <a
            href="/Kyrell_Santillan_Resume.pdf"
            download
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border-subtle)] bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] font-mono text-xs font-medium transition-all hover:border-[var(--accent-primary)]/40"
          >
            <FileText className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>CV</span>
          </a>

          {/* Talk / Message Button with Universal Chat-Bubble Icon */}
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=santillankyrell@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Talk to Kyrell (Contact)"
            className={`rounded-full bg-[var(--text-primary)] hover:bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:text-white font-mono font-bold text-xs transition-all duration-300 shadow-lg flex items-center justify-center ${
              isCompact
                ? "w-8 h-8 p-0 gap-0 shrink-0"
                : "h-8 px-3.5 py-1.5 gap-1.5 shrink-0"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span
              className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap ${
                isCompact
                  ? "w-0 max-w-0 opacity-0 -translate-x-1 pointer-events-none hidden"
                  : "max-w-[45px] opacity-100 inline"
              }`}
            >
              Talk
            </span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white/5 text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
            aria-label={isOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto absolute top-20 left-4 right-4 bg-[var(--bg-panel)] backdrop-blur-2xl border border-[var(--border-subtle)] p-6 rounded-3xl space-y-4 shadow-2xl max-w-md mx-auto z-50"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] font-mono text-xs text-[var(--text-primary)]">
              <span>[ SYSTEM NAV ]</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--border-subtle)] bg-white/5 text-xs text-[var(--text-primary)]"
                >
                  {theme === "dark" ? <Sun className="w-3 h-3 text-[#8cff2e]" /> : <Moon className="w-3 h-3 text-[#2563eb]" />}
                  <span className="capitalize">{theme === "dark" ? "Light" : "Dark"} Mode</span>
                </button>
                <span className="text-[var(--text-muted)]">{navItems.length} SECTIONS</span>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`flex items-center justify-between py-3 px-4 rounded-xl font-mono text-sm transition-all duration-200 ${
                    activeSection === item.id
                      ? "text-[var(--text-primary)] bg-white/10 font-bold border border-[var(--border-subtle)]"
                      : "text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-primary)]"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs opacity-50">{item.num}</span>
                </a>
              ))}
            </nav>

            <div className="flex gap-2 pt-2 border-t border-[var(--border-subtle)]">
              <a
                href="/Kyrell_Santillan_Resume.pdf"
                download
                className="flex-1 py-2.5 text-center rounded-xl border border-[var(--border-subtle)] bg-white/5 text-[var(--text-secondary)] font-mono text-xs hover:border-[var(--accent-primary)]/40 transition-colors"
              >
                Resume
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=santillankyrell@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 text-center rounded-xl bg-[var(--text-primary)] hover:bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:text-white font-mono font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

