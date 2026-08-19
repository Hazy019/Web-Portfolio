"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseFitTextOptions {
  minFontSize?: number;
  maxFontSize?: number;
  safetyMargin?: number; // default 0.98 for optical padding
}

export function useFitText<
  C extends HTMLElement = HTMLDivElement,
  T extends HTMLElement = HTMLDivElement
>(options: UseFitTextOptions = {}) {
  const { minFontSize = 18, maxFontSize, safetyMargin = 0.98 } = options;

  const containerRef = useRef<C>(null);
  const textRef = useRef<T>(null);
  const [scale, setScale] = useState<number>(1);
  const [computedFontSize, setComputedFontSize] = useState<number | null>(null);

  const calculateFit = useCallback(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    // Reset inline font-size temporarily to measure natural unconstrained text width
    const prevFontSize = text.style.fontSize;
    text.style.fontSize = "";

    const containerWidth = container.clientWidth;
    const textWidth = text.scrollWidth;

    if (containerWidth > 0 && textWidth > 0) {
      if (textWidth > containerWidth) {
        const computedStyle = window.getComputedStyle(text);
        const baseFontSize = parseFloat(computedStyle.fontSize) || 32;
        const targetSize = Math.max(
          minFontSize,
          Math.floor((containerWidth / textWidth) * baseFontSize * safetyMargin)
        );
        const finalSize = maxFontSize ? Math.min(maxFontSize, targetSize) : targetSize;

        text.style.fontSize = `${finalSize}px`;
        setComputedFontSize(finalSize);
        setScale(containerWidth / textWidth);
      } else {
        // Fits comfortably without shrinking
        text.style.fontSize = maxFontSize ? `${maxFontSize}px` : "";
        setComputedFontSize(null);
        setScale(1);
      }
    } else {
      text.style.fontSize = prevFontSize;
    }
  }, [minFontSize, maxFontSize, safetyMargin]);

  useEffect(() => {
    calculateFit();

    // Re-calculate when fonts are loaded
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(calculateFit);
    }

    // ResizeObserver for dynamic container adjustments
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        calculateFit();
      });
      resizeObserver.observe(containerRef.current);
    }

    const handleWindowResize = () => {
      calculateFit();
    };

    window.addEventListener("resize", handleWindowResize, { passive: true });
    window.addEventListener("orientationchange", handleWindowResize);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("orientationchange", handleWindowResize);
    };
  }, [calculateFit]);

  return {
    containerRef,
    textRef,
    scale,
    computedFontSize,
    recalculate: calculateFit,
  };
}
