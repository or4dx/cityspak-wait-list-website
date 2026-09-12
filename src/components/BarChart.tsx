type BarColor = "green" | "amber" | "blue" | "mute";

const BAR_COLOR: Record<BarColor, string> = {
  green: "bg-cs-green",
  amber: "bg-cs-amber",
  blue: "bg-cs-blue",
  mute: "bg-cs-chalk-mute",
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
    <div className="rounded-cs border border-cs-border bg-cs-surface p-5 pb-4">
      <div className="mb-0.5 text-[13px] font-semibold text-cs-chalk">{title}</div>
      <div className="mb-4 text-[11px] text-cs-chalk-dim">{sub}</div>

      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[138px_1fr_38px] items-center gap-2">
            <div className="truncate text-right text-xs text-cs-chalk-dim">{row.label}</div>
            <div className="h-[18px] overflow-hidden rounded-[3px] bg-cs-surface-hi">
              <div
                className={`h-full rounded-[3px] ${BAR_COLOR[row.color ?? "mute"]}`}
                style={{ width: `${row.pct}%` }}
              />
            </div>
            <div className="text-right font-mono text-xs tabular-nums text-cs-chalk-dim">
              {row.pct}%
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3.5 flex items-start gap-2 rounded-lg border border-cs-green/20 bg-cs-green/[0.07] px-3 py-2.5 text-xs leading-snug text-cs-chalk-dim">
        <span className="mt-1 h-[5px] w-[5px] shrink-0 rounded-full bg-cs-green" />
        <span>{insight}</span>
      </div>
    </div>
  );
}
