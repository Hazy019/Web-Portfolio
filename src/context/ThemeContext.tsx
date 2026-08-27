"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { ThemeTransitionOverlay } from "@/components/ThemeTransitionOverlay";

export type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  targetTheme: Theme | null;
  isTransitioning: boolean;
  toggleTheme: () => void;
  setThemeExplicitly: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [targetTheme, setTargetTheme] = useState<Theme | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollYSnapshot, setScrollYSnapshot] = useState(0);
  const isTransitioningRef = useRef(false);

  // Initialize theme from localStorage, active DOM attribute, or system preferences on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("hazy_theme") as Theme | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      } else {
        const domTheme = document.documentElement.getAttribute("data-theme") as Theme | null;
        if (domTheme === "light" || domTheme === "dark") {
          setTheme(domTheme);
        } else {
          const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
          const initialTheme: Theme = prefersLight ? "light" : "dark";
          setTheme(initialTheme);
          document.documentElement.setAttribute("data-theme", initialTheme);
        }
      }
    } catch {
      // Fallback to dark if localStorage is inaccessible
      document.documentElement.setAttribute("data-theme", "dark");
    }

    // Listen to live OS/Browser system color scheme changes in real-time
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      try {
        const manualChoice = localStorage.getItem("hazy_theme_manual");
        if (!manualChoice) {
          const newSystemTheme: Theme = e.matches ? "light" : "dark";
          setTheme(newSystemTheme);
          document.documentElement.setAttribute("data-theme", newSystemTheme);
        }
      } catch {
        // Ignore
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemChange);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(handleSystemChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleSystemChange);
      } else if ((mediaQuery as any).removeListener) {
        (mediaQuery as any).removeListener(handleSystemChange);
      }
    };
  }, []);

  const setThemeExplicitly = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    try {
      localStorage.setItem("hazy_theme", newTheme);
      localStorage.setItem("hazy_theme_manual", "true");
    } catch {
      // Ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    if (isTransitioningRef.current) return;

    const nextTheme: Theme = theme === "dark" ? "light" : "dark";

    // Accessibility check: bypass staggered slat animation if user requested reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setThemeExplicitly(nextTheme);
      return;
    }

    // Capture current scroll offset for pixel-perfect viewport synchronization
    const currentY = typeof window !== "undefined" ? window.scrollY : 0;
    setScrollYSnapshot(currentY);

    isTransitioningRef.current = true;
    setIsTransitioning(true);
    setTargetTheme(nextTheme);
  }, [theme, setThemeExplicitly]);

  const handleTransitionComplete = useCallback(() => {
    if (targetTheme) {
      setTheme(targetTheme);
    }
    setIsTransitioning(false);
    setTargetTheme(null);
    isTransitioningRef.current = false;
  }, [targetTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        targetTheme,
        isTransitioning,
        toggleTheme,
        setThemeExplicitly,
      }}
    >
      {children}
      {isTransitioning && targetTheme && (
        <ThemeTransitionOverlay
          targetTheme={targetTheme}
          scrollY={scrollYSnapshot}
          onComplete={handleTransitionComplete}
        />
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
