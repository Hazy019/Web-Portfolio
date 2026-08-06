/**
 * AmbientOrbs — Sitewide atmosphere depth system (§1)
 *
 * Renders 2–3 large, heavily blurred, low-opacity radial gradient blobs that
 * slowly drift in the background of a section. They read as "feeling" not
 * "shapes" — guardrail: if an orb is visible as a distinct object, reduce
 * its opacity prop.
 *
 * Each section passes its own orb config so the atmospheric colour shifts
 * as the user scrolls through the page.
 */

interface OrbDef {
  /** CSS color value — preferably use rgba or a project nativeAccent */
  color: string;
  /** Width/height as a CSS size string, e.g. "600px" */
  size: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  /** 0–1, default 0.12 — keep at 0.08–0.15 to stay atmospheric */
  opacity?: number;
  /** CSS animation-delay, stagger between orbs to prevent sync */
  delay?: string;
  /** Override drift duration, default 60s */
  duration?: string;
}

interface AmbientOrbsProps {
  orbs: OrbDef[];
}

export function AmbientOrbs({ orbs }: AmbientOrbsProps) {
  return (
    <>
      {orbs.map((orb, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="ambient-orb"
          style={{
            width: orb.size,
            height: orb.size,
            background: orb.color,
            opacity: orb.opacity ?? 0.12,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
            animationDelay: orb.delay ?? `${i * -18}s`,
            animationDuration: orb.duration ?? `${62 + i * 9}s`,
          }}
        />
      ))}
    </>
  );
}
