// Two-color system only (emerald accent, orange warm), matching the main
// app's asymmetric-palette rule, no third arbitrary color for a third tile.
type Accent = "accent" | "warm";

interface StatTileProps {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  accent?: Accent;
}

export function StatTile({ label, value, unit, sub, accent = "accent" }: StatTileProps) {
  const valueColor = accent === "warm" ? "text-cs-warm" : "text-cs-accent";

  return (
    <div className="rounded-2xl border border-cs-border bg-cs-surface p-6">
      <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-cs-text-muted">
        {label}
      </div>
      <div className={`font-mono text-4xl font-bold leading-none tabular-nums ${valueColor}`}>
        {value}
        {unit && <span className="ml-1 text-base font-normal text-cs-text-muted">{unit}</span>}
      </div>
      {sub && <div className="mt-2 text-xs leading-snug text-cs-text-muted">{sub}</div>}
    </div>
  );
}
