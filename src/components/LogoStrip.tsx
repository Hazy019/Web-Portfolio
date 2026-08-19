"use client";

/**
 * LogoStrip — Single Real-Logo Infinite Marquee Showcase Strip (§3 v10)
 *
 * Edge Gradient Vignette Mask: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)
 * Glass Chip Styling: background: rgba(255, 255, 255, 0.04), backdrop-filter: blur(12px), border: 1px solid rgba(255, 255, 255, 0.08), rounded-xl, px-6 py-4.
 * Interactive Motion: hover:-translate-y-0.5, hover:border-[#8cff2e]/30, hover:shadow-[0_0_20px_rgba(140,255,46,0.15)].
 * Speed: 40s linear glide loop, pausing on hover.
 */

interface RealLogoItem {
  id: string;
  name: string;
  src: string;
}

const LOGO_ITEMS: RealLogoItem[] = [
  {
    id: "yt-shorts",
    name: "YouTube Shorts Automation",
    src: "/Shortsautomation_logo.png",
  },
  {
    id: "dti-queue",
    name: "DTI Queue System",
    src: "/DTI_Queue_logo.png",
  },
  {
    id: "polycon",
    name: "Polycon",
    src: "/Polycon_logo.png",
  },
  {
    id: "idee-cli",
    name: "IDEE-CLI",
    src: "/IDEE-CLI_logo.png",
  },
  {
    id: "spell-gate",
    name: "SpellGate",
    // Note: .ico converted to .png for consistent high-DPI rendering.
    // If SpellGate_logo.png is not yet in /public, rename SpellGate_logo.ico to .png.
    src: "/SpellGate_logo.ico",
  },
  {
    id: "sentinel-view",
    name: "SentinelView",
    src: "/SentinelView_logo.png?v=2",
  },
  {
    id: "client-echo",
    name: "ClientEcho",
    src: "/ClientEcho_logo.png?v=2",
  },
];

interface LogoStripProps {
  onSelectProject?: (id: string) => void;
}

export function LogoStrip({ onSelectProject }: LogoStripProps) {
  // Multiply sequence for smooth continuous infinite looping
  const marqueeSequence = [
    ...LOGO_ITEMS,
    ...LOGO_ITEMS,
    ...LOGO_ITEMS,
    ...LOGO_ITEMS,
    ...LOGO_ITEMS,
  ];

  return (
    <section
      id="logos"
      className="group w-full py-6 sm:py-8 border-t border-white/10 bg-[#0d1017]/90 backdrop-blur-xl overflow-hidden select-none relative z-20 shadow-[0_0_30px_rgba(0,0,0,0.4)]"
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
      }}
      aria-label="Built Systems Real-Logo Showcase"
    >
      {/* ── Single Infinite-Loop Real-Logo Marquee Track (40s linear glide) ───────────────────── */}
      <div
        className="animate-marquee group-hover:[animation-play-state:paused] items-center"
        style={{
          display: "flex",
          flexWrap: "nowrap",
          width: "max-content",
          whiteSpace: "nowrap",
          animationDuration: "40s",
        }}
      >
        {marqueeSequence.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onSelectProject?.(item.id)}
            className="items-center gap-6 sm:gap-10 px-6 sm:px-10 cursor-pointer group/logo flex-shrink-0"
            style={{ display: "inline-flex", flexShrink: 0, whiteSpace: "nowrap" }}
          >
            {/* Translucent Dark Glass Chip (rgba(255,255,255,0.04) fill, blur(12px), px-6 py-4) */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
              className="px-6 py-4 rounded-xl flex items-center justify-center shadow-lg group-hover/logo:-translate-y-0.5 group-hover/logo:border-[#8cff2e]/30 group-hover/logo:shadow-[0_0_20px_rgba(140,255,46,0.15)] transition-all duration-300 shrink-0"
            >
              <img
                src={item.src}
                alt={item.name}
                className="h-9 sm:h-10 max-w-[120px] object-contain"
                loading="eager"
              />
            </div>

            {/* Separator Motif (✦) */}
            <span className="text-[#8cff2e] text-xs font-bold select-none opacity-70">
              ✦
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

