interface CitySpakMarkProps {
  size?: number;
  className?: string;
}

/**
 * The CitySpak brand mark, "Facet" (ADR-0009). A leaning, gem-cut drop in
 * the Ambient Green brand ramp. Ported verbatim from the main CitySpak
 * app's apps/web/src/components/brand/CitySpakMark.tsx (source of truth:
 * docs/brand/cityspak-mark.svg in that repo). Theme-independent, the mark
 * itself never re-themes, only the surface it sits on does.
 *
 * The main app's marketing landing page header still uses an older Sparkles-
 * icon placeholder that predates this mark and was never migrated, this
 * site intentionally uses the real, current mark instead (already the one
 * used everywhere else in that app: admin layout, sidebar, mobile).
 */
export function CitySpakMark({ size = 32, className }: CitySpakMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="CitySpak"
      className={className}
    >
      <defs>
        <linearGradient id="cityspak-mark-fill" x1="10%" y1="100%" x2="90%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <g transform="rotate(26 50 50)">
        <path
          fill="url(#cityspak-mark-fill)"
          d="M50,10 C74,34 82,50 82,64 A32,32 0 1 1 18,64 C18,50 26,34 50,10 Z"
        />
        <path fill="#FAFAF9" opacity={0.3} d="M50,10 L66,26 L44,30 Z" />
        <path fill="#0C0A09" opacity={0.24} d="M50,64 L72,58 L64,84 Z" />
      </g>
    </svg>
  );
}
