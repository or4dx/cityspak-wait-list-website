type BarColor = "accent" | "warm" | "subtle";

const BAR_COLOR: Record<BarColor, string> = {
  accent: "bg-cs-accent",
  warm: "bg-cs-warm",
  subtle: "bg-cs-text-subtle",
};

export interface BarChartRow {
  label: string;
  pct: number;
  color?: BarColor;
}

interface BarChartProps {
  title: string;
  sub: string;
  rows: BarChartRow[];
  insight: React.ReactNode;
}

export function BarChart({ title, sub, rows, insight }: BarChartProps) {
  return (
    <div className="rounded-2xl border border-cs-border bg-cs-surface p-6">
      <div className="mb-0.5 text-sm font-semibold text-cs-text">{title}</div>
      <div className="mb-5 text-xs text-cs-text-muted">{sub}</div>

      <div className="flex flex-col gap-2.5">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[138px_1fr_38px] items-center gap-2">
            <div className="truncate text-right text-xs text-cs-text-muted">{row.label}</div>
            <div className="h-[18px] overflow-hidden rounded-full bg-cs-surface-elevated">
              <div
                className={`h-full rounded-full ${BAR_COLOR[row.color ?? "subtle"]}`}
                style={{ width: `${row.pct}%` }}
              />
            </div>
            <div className="text-right font-mono text-xs tabular-nums text-cs-text-muted">
              {row.pct}%
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-cs-accent/20 bg-cs-accent/[0.07] px-3 py-2.5 text-xs leading-snug text-cs-text-muted">
        <span className="mt-1 h-[5px] w-[5px] shrink-0 rounded-full bg-cs-accent" />
        <span>{insight}</span>
      </div>
    </div>
  );
}
