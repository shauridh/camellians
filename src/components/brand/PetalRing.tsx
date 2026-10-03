import { cn } from "@/lib/utils";

interface PetalRingProps {
  /** Number of filled petals (houses paid, or turns elapsed). */
  value: number;
  /** Total petals in the ring. */
  total: number;
  /** Accessible description; defaults to a Bahasa Indonesia summary. */
  label?: string;
  /** Diameter in px. Only 96 / 128 / 160 are used by the design. */
  size?: 96 | 128 | 160;
  className?: string;
}

/**
 * PetalRing — the signature element of Camellians.
 *
 * A camellia rosette where each petal is one unit of progress: one house paid,
 * or one arisan turn elapsed. It appears in three places with real meaning
 * (app mark, dues progress, arisan rotation), which is what makes it a
 * signature rather than decoration.
 *
 * Geometry is derived from the petal count, so a 6-petal and a 16-petal ring
 * both read as the same flower: petals sit in an annulus between `inner` and
 * the rim, and their width is clamped to the circumferential room available.
 *
 * Accessibility: one labelled image, so a screen reader hears "12 dari 16
 * rumah sudah membayar" instead of counting petals. The count is always also
 * stated in adjacent text, so colour is never the only signal.
 *
 * Motion: petals scale in via transform only, staggered, and collapse to their
 * final state under prefers-reduced-motion (handled in globals.css). Rotation
 * lives on an outer group and the animation on an inner one — on the same
 * element a CSS transform would override the rotate attribute.
 */
export function PetalRing({
  value,
  total,
  label,
  size = 128,
  className,
}: PetalRingProps) {
  const safeTotal = Math.max(1, total);
  const filled = Math.min(Math.max(0, value), safeTotal);

  const centre = size / 2;
  const margin = size * 0.05;
  const rim = centre - margin; // outermost reach of a petal
  const inner = rim * 0.4; // open centre, where the stamen sits

  const petalH = (rim - inner) / 2;
  const petalDistance = (rim + inner) / 2;
  // Circumferential room at the petal's mid-radius, so dense rings stay
  // legible instead of fusing into a disc.
  const circumferential = (Math.PI * 2 * petalDistance) / safeTotal;
  const petalW = Math.min(rim * 0.3, circumferential * 0.72);

  const description = label ?? `${filled} dari ${safeTotal} sudah terisi`;

  return (
    <svg
      role="img"
      aria-label={description}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={cn("shrink-0", className)}
    >
      {Array.from({ length: safeTotal }).map((_, index) => {
        const angle = (360 / safeTotal) * index;
        const isFilled = index < filled;
        return (
          <g key={index} transform={`rotate(${angle} ${centre} ${centre})`}>
            <g
              style={{
                transformOrigin: `${centre}px ${centre}px`,
                // Staggered bloom; the reduced-motion rule in globals.css
                // collapses these durations to the same final state.
                animation: `petal-bloom 520ms cubic-bezier(0.32,0.72,0,1) ${index * 40}ms both`,
              }}
            >
              <ellipse
                cx={centre}
                cy={centre - petalDistance}
                rx={petalW}
                ry={petalH}
                fill={isFilled ? "var(--color-brass)" : "var(--color-mist)"}
                stroke={
                  isFilled ? "var(--color-brass)" : "var(--color-slate-muted)"
                }
                strokeWidth={1.5}
              />
            </g>
          </g>
        );
      })}

      {/* Stamen: the ivory eye at the heart of the bloom. */}
      <circle cx={centre} cy={centre} r={inner * 0.62} fill="var(--color-paper)" />
      <circle
        cx={centre}
        cy={centre}
        r={inner * 0.62}
        fill="none"
        stroke="var(--color-brass)"
        strokeWidth={1.5}
      />
      <circle cx={centre} cy={centre} r={inner * 0.24} fill="var(--color-brass)" />
    </svg>
  );
}
