type Accent = "green" | "amber" | "blue";

const ACCENT_BORDER: Record<Accent, string> = {
  green: "before:bg-cs-green",
  amber: "before:bg-cs-amber",
  blue: "before:bg-cs-blue",
};

interface StatTileProps {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  accent?: Accent;
}

export function StatTile({ label, value, unit, sub, accent = "green" }: StatTileProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-cs border border-cs-border bg-cs-surface p-5 pb-4
        before:absolute before:inset-x-0 before:top-0 before:h-[3px] ${ACCENT_BORDER[accent]}`}
    >
      <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-cs-chalk-dim">
        {label}
      </div>
      <div className="font-mono text-[36px] font-medium leading-none text-cs-chalk tabular-nums">
        {value}
        {unit && <span className="ml-1 text-base text-cs-chalk-dim">{unit}</span>}
      </div>
      {sub && <div className="mt-1.5 text-xs leading-snug text-cs-chalk-dim">{sub}</div>}
    </div>
  );
}
