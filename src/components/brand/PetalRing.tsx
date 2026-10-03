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
 * A ring of camellia petals where each petal is one unit of progress: one
 * house paid, or one arisan turn elapsed. It appears in three places with
 * real meaning (app mark, dues progress, arisan rotation), which is what
 * makes it a signature rather than decoration.
 *
 * Accessibility: rendered as a single labelled image, so screen readers hear
 * "4 dari 6 rumah sudah membayar" instead of counting petals. Colour is never
 * the only signal — the count is always stated in text alongside it.
 *
 * Motion: petals scale in via transform only, staggered, and collapse to
 * their final state under prefers-reduced-motion (handled in globals.css).
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
  const radius = size / 2 - size * 0.11;
  const centre = size / 2;
  const petalW = size * 0.155;
  const petalH = size * 0.25;

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
          <g
            key={index}
            transform={`rotate(${angle} ${centre} ${centre})`}
            style={{
              transformOrigin: `${centre}px ${centre}px`,
              // Staggered bloom; the reduced-motion rule in globals.css
              // collapses these durations so the final state is identical.
              animation: `petal-bloom 520ms cubic-bezier(0.32,0.72,0,1) ${index * 55}ms both`,
            }}
          >
            <ellipse
              cx={centre}
              cy={centre - radius}
              rx={petalW}
              ry={petalH}
              fill={isFilled ? "var(--color-brass)" : "var(--color-stone)"}
              stroke={
                isFilled ? "var(--color-brass)" : "var(--color-slate-muted)"
              }
              strokeWidth={1.5}
              opacity={isFilled ? 1 : 0.55}
            />
          </g>
        );
      })}
      <text
        x={centre}
        y={centre}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--color-evergreen-deep)"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: size * 0.22,
          fontWeight: 600,
        }}
      >
        {filled}/{safeTotal}
      </text>
    </svg>
  );
}
