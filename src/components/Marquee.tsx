"use client";

/**
 * Marquee — Dual-Tier Infinite Ticker/Marquee Banner
 *
 * Section Height: 72px–80px (py-4 md:py-5, ~56px on mobile)
 * Surface: Dark glass ribbon (#0d1017 / rgba(18,21,30,0.85) + backdrop blur + border-y border-[#8cff2e]/20)
 * Row 1 (Category Track): Monospace (13px, 60% opacity, tracking 0.18em, TECHNICAL ✦ DEVELOPMENT ✦ IDENTITY ✦ MOTION ✦ UX/UI)
 * Row 2 (Value Prop Track): Syne Display (18px-20px, 100% opacity bold, SOLVING DEPTH ✦ CRAFTED IN PH ✦ AVAILABLE FOR WORK ✦ STAY HAZY)
 * Motion: GPU-accelerated dual-track scroll (30s top leftward, 25s bottom rightward), pauses on hover
 */

export function Marquee() {
  const categoryItems = [
    "TECHNICAL",
    "DEVELOPMENT",
    "IDENTITY",
    "MOTION",
    "UX/UI",
    "SYSTEMS ARCHITECTURE",
    "AI PIPELINES",
    "CYBERSECURITY",
  ];

  const valuePropItems = [
    "SOLVING DEPTH",
    "CRAFTED IN PH",
    "AVAILABLE FOR WORK",
    "STAY HAZY",
    "ZERO FAILURE MODES",
    "HIGH PERFORMANCE",
  ];

  return (
    <section
      className="group w-full py-4 md:py-5 border-y border-[#8cff2e]/20 bg-[#0d1017]/90 backdrop-blur-xl overflow-hidden select-none relative z-20 shadow-[0_0_30px_rgba(140,255,46,0.08)]"
      aria-label="Technical Capabilities and Ticker Banner"
    >
      {/* ── Row 1: Category Track (Monospace 13px, Opacity 60%) ───────────── */}
      <div
        className="animate-marquee group-hover:[animation-play-state:paused] items-center"
        style={{ display: "flex", flexWrap: "nowrap", width: "max-content", whiteSpace: "nowrap" }}
      >
        {categoryItems.concat(categoryItems).concat(categoryItems).map((item, idx) => (
          <div
            key={idx}
            className="items-center gap-4 md:gap-6 px-3 md:px-5"
            style={{ display: "inline-flex", flexShrink: 0, whiteSpace: "nowrap" }}
          >
            <span
              className="font-mono text-[11px] md:text-[13px] uppercase tracking-[0.18em] text-white/60 font-semibold"
              style={{ whiteSpace: "nowrap" }}
            >
              {item}
            </span>
            <span className="text-[#8cff2e] text-[10px] md:text-[12px] font-bold select-none opacity-80">
              ✦
            </span>
          </div>
        ))}
      </div>

      {/* ── Row 2: Value Prop Track (Bold Syne Display 18-20px, Opacity 100%) ── */}
      <div
        className="animate-marquee-reverse group-hover:[animation-play-state:paused] items-center pt-2 md:pt-2.5"
        style={{ display: "flex", flexWrap: "nowrap", width: "max-content", whiteSpace: "nowrap" }}
      >
        {valuePropItems.concat(valuePropItems).concat(valuePropItems).map((item, idx) => (
          <div
            key={idx}
            className="items-center gap-5 md:gap-8 px-4 md:px-6"
            style={{ display: "inline-flex", flexShrink: 0, whiteSpace: "nowrap" }}
          >
            <span
              className="font-display font-extrabold text-[15px] md:text-[19px] uppercase tracking-wider text-white opacity-100"
              style={{ whiteSpace: "nowrap" }}
            >
              {item}
            </span>
            <span className="text-[#8cff2e] text-[12px] md:text-[14px] font-bold select-none">
              ✦
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
