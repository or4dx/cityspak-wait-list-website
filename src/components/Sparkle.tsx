import type { CSSProperties } from "react";

/** A single drifting firefly-style light accent, transcribed from the main
 * CitySpak app's own ui/Sparkle.tsx for visual consistency. */
export function Sparkle({
  top,
  left,
  size,
  color,
  duration,
  delay,
}: {
  top: string;
  left: string;
  size: number;
  color: string;
  duration: string;
  delay: string;
}) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute animate-cs-sparkle rounded-full"
      style={
        {
          top,
          left,
          width: size,
          height: size,
          background: color,
          boxShadow: `0 0 ${size}px ${size / 2}px ${color}, 0 0 ${size * 5}px ${size * 2}px ${color.replace(",1)", ",0.55)")}`,
          animationDuration: duration,
          animationDelay: delay,
        } as CSSProperties
      }
    />
  );
}
