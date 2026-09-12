const POINTS = [
  "You open 5 apps. You get 0 good answers.",
  "Every recommendation is the same hyped-up new opening, never the places locals actually love.",
  "By the time you've decided where to go, the night is half over.",
];

export function ProblemStatement() {
  return (
    <section className="bg-cs-bg px-6 pb-8">
      <div className="mx-auto max-w-[720px]">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {POINTS.map((point) => (
            <li
              key={point}
              className="rounded-cs border border-cs-border bg-cs-surface p-4 text-center text-sm leading-relaxed text-cs-chalk-dim"
            >
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
