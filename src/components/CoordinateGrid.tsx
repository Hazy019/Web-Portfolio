"use client";

/**
 * CoordinateGrid — Minimal Subtle Grid & Crosshairs (§2)
 *
 * Clean, uncluttered background depth layer with subtle crosshair '+' markers.
 * Free of noisy FPS monitors or clutter.
 */

export function CoordinateGrid() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[2] overflow-hidden"
    >
      {/* Corner crosshairs (+) */}
      <div className="absolute top-8 left-8 text-[#8cff2e]/30 font-mono text-sm select-none">
        +
      </div>
      <div className="absolute top-8 right-8 text-[#8cff2e]/30 font-mono text-sm select-none">
        +
      </div>
      <div className="absolute bottom-8 left-8 text-[#8cff2e]/20 font-mono text-sm select-none">
        +
      </div>
      <div className="absolute bottom-8 right-8 text-[#8cff2e]/20 font-mono text-sm select-none">
        +
      </div>

      {/* Grid intersection nodes */}
      <div className="absolute top-1/3 left-1/4 text-[#8cff2e]/20 font-mono text-xs select-none">
        +
      </div>
      <div className="absolute top-1/3 right-1/4 text-[#8cff2e]/20 font-mono text-xs select-none">
        +
      </div>
      <div className="absolute top-2/3 left-1/3 text-[#8cff2e]/20 font-mono text-xs select-none">
        +
      </div>
      <div className="absolute top-2/3 right-1/3 text-[#8cff2e]/20 font-mono text-xs select-none">
        +
      </div>
    </div>
  );
}
