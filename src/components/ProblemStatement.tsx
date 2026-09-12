const POINTS = [
  { num: "01", text: "You open 5 apps. You get 0 good answers." },
  {
    num: "02",
    text: "Every recommendation is the same hyped-up new opening, never the places locals actually love.",
  },
  { num: "03", text: "By the time you've decided where to go, the night is half over." },
];

export function ProblemStatement() {
  return (
    <section className="section-padding bg-cs-surface/20">
      <div className="container-custom">
        <div className="grid gap-6 sm:grid-cols-3">
          {POINTS.map((point) => (
            <div
              key={point.num}
              className="space-y-3 rounded-2xl border border-cs-border bg-cs-surface p-6"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cs-accent/10 font-mono text-xs text-cs-accent">
                {point.num}
              </span>
              <p className="text-sm text-cs-text-muted">{point.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
