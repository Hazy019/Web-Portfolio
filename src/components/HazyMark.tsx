"use client";

/**
 * HazyMark — Animated Geometric Logo Mark (§4)
 *
 * The HAZY signature visual: a node-connected hexagonal cloud outline
 * with pulsing connection lines. Serves three roles sitewide:
 *
 *   1. Hero negative space — right side, ~240px, low opacity (ambient presence)
 *   2. Philosophy quote watermark — behind the quote, ~400px, very faint
 *   3. Loader background texture — inside iris frame
 *
 * Animation system:
 *   - Slow idle rotation (60s loop, 360°) via CSS @keyframes
 *   - Traveling dot on connection lines via stroke-dashoffset animation
 *   - Node pulse — faint opacity cycle on each vertex circle
 *   - Cursor parallax — mousemove nudges the mark ≤12px in any direction
 *
 * Guardrail: mark sits at low visual weight (opacity, size, position)
 * so it reads as personality/atmosphere, not as a fourth "star."
 */

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface HazyMarkProps {
  /** Rendered size in px (width = height). Default: 240 */
  size?: number;
  /** Base opacity. Default: 0.18 */
  opacity?: number;
  /** Whether to apply cursor parallax. Default: true */
  parallax?: boolean;
  /** Extra class names for positioning */
  className?: string;
  /** aria-hidden — default true (purely decorative) */
  decorative?: boolean;
}

export function HazyMark({
  size = 240,
  opacity = 0.18,
  parallax = true,
  className = "",
  decorative = true,
}: HazyMarkProps) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // ── Cursor parallax ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!parallax || reducedMotion) return;
    const MAX = 12; // max px nudge
    let raf: number;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = ((e.clientX - cx) / cx) * MAX;
      targetY = ((e.clientY - cy) / cy) * MAX;
    };

    const loop = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      setOffset({ x: currentX, y: currentY });
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, [parallax, reducedMotion]);

  // ── SVG geometry ─────────────────────────────────────────────────────────
  // Centre of SVG viewport
  const cx = 100;
  const cy = 100;

  // 6 outer nodes arranged in a hexagon (radius 72)
  const R = 72;
  const nodes = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 6 - Math.PI / 6; // flat-top hex
    return {
      x: cx + R * Math.cos(angle),
      y: cy + R * Math.sin(angle),
    };
  });

  // 2 inner nodes — smaller inner ring (radius 36)
  const innerR = 36;
  const innerNodes = [0, 2, 4].map((i) => {
    const angle = (i * Math.PI * 2) / 6 - Math.PI / 6;
    return {
      x: cx + innerR * Math.cos(angle),
      y: cy + innerR * Math.sin(angle),
    };
  });

  // Connection lines: each outer node to its 2 neighbors + to nearest inner node
  const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

  // Outer hexagon edges
  nodes.forEach((n, i) => {
    const next = nodes[(i + 1) % 6];
    lines.push({ x1: n.x, y1: n.y, x2: next.x, y2: next.y });
  });

  // Spokes from center to every other outer node
  [0, 2, 4].forEach((i) => {
    lines.push({ x1: cx, y1: cy, x2: nodes[i].x, y2: nodes[i].y });
  });

  // Inner triangle
  innerNodes.forEach((n, i) => {
    const next = innerNodes[(i + 1) % 3];
    lines.push({ x1: n.x, y1: n.y, x2: next.x, y2: next.y });
  });

  // Spokes from inner to adjacent outer
  innerNodes.forEach((inner, i) => {
    const outerIdx = i * 2;
    lines.push({
      x1: inner.x,
      y1: inner.y,
      x2: nodes[outerIdx].x,
      y2: nodes[outerIdx].y,
    });
  });

  const animationStyle = reducedMotion
    ? {}
    : { animation: "hazyMarkRotate 70s linear infinite" };

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none select-none ${className}`}
      aria-hidden={decorative}
      style={{
        width: size,
        height: size,
        opacity,
        transform: parallax && !reducedMotion
          ? `translate(${offset.x}px, ${offset.y}px)`
          : undefined,
        willChange: parallax ? "transform" : undefined,
      }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        style={animationStyle}
      >
        {/* Connection lines — primary structure */}
        {lines.map((line, i) => {
          const len = Math.hypot(line.x2 - line.x1, line.y2 - line.y1);
          return (
            <line
              key={`line-${i}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#00ff88"
              strokeWidth="0.6"
              strokeOpacity="0.6"
              strokeDasharray={`${len * 0.15} ${len * 0.85}`}
              strokeDashoffset="0"
              style={
                reducedMotion
                  ? { strokeDasharray: "none" }
                  : {
                      animation: `hazyDash ${4 + (i % 3) * 1.2}s linear infinite ${i * 0.3}s`,
                      strokeDasharray: `${len * 0.15} ${len * 0.85}`,
                    }
              }
            />
          );
        })}

        {/* Continuous line ring (faint, no dash) */}
        {lines.map((line, i) => (
          <line
            key={`bg-line-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#00ff88"
            strokeWidth="0.35"
            strokeOpacity="0.2"
          />
        ))}

        {/* Outer hexagon nodes */}
        {nodes.map((node, i) => (
          <circle
            key={`outer-${i}`}
            cx={node.x}
            cy={node.y}
            r="3.5"
            fill="#00ff88"
            fillOpacity="0.7"
            style={
              reducedMotion
                ? {}
                : {
                    animation: `hazyNodePulse ${3 + i * 0.4}s ease-in-out infinite ${i * 0.5}s`,
                  }
            }
          />
        ))}

        {/* Inner triangle nodes */}
        {innerNodes.map((node, i) => (
          <circle
            key={`inner-${i}`}
            cx={node.x}
            cy={node.y}
            r="2.5"
            fill="#00ff88"
            fillOpacity="0.5"
            style={
              reducedMotion
                ? {}
                : {
                    animation: `hazyNodePulse ${2.5 + i * 0.6}s ease-in-out infinite ${i * 0.7 + 0.3}s`,
                  }
            }
          />
        ))}

        {/* Center origin node */}
        <circle cx={cx} cy={cy} r="4" fill="#00ff88" fillOpacity="0.85" />
        <circle
          cx={cx}
          cy={cy}
          r="8"
          fill="none"
          stroke="#00ff88"
          strokeWidth="0.6"
          strokeOpacity="0.3"
          style={
            reducedMotion
              ? {}
              : { animation: "hazyNodePulse 2s ease-in-out infinite" }
          }
        />

        {/* Outer bounding ring — cloud outline suggestion */}
        <circle
          cx={cx}
          cy={cy}
          r="88"
          fill="none"
          stroke="#00ff88"
          strokeWidth="0.4"
          strokeOpacity="0.15"
          strokeDasharray="3 8"
        />
      </svg>
    </div>
  );
}
