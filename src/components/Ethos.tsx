import { Gem, ShieldCheck, Users } from "lucide-react";

const PILLARS = [
  {
    icon: Gem,
    title: "Quality first, always",
    text: "A five-dollar noodle stall and a five-hundred-dollar tasting menu get judged by the same bar: is it actually great. Price is never the filter.",
  },
  {
    icon: ShieldCheck,
    title: "Sponsored, never disguised",
    text: "A few spots may pay for extra visibility, and when they do, it's always labeled as sponsored. The quality bar for what we call genuinely great is never for sale.",
  },
  {
    icon: Users,
    title: "Curated by real locals",
    text: "Every experience is vetted by people who actually live here, not pulled from a directory or ranked by ad spend.",
  },
];

export function Ethos() {
  return (
    <section id="ethos" className="section-padding">
      <div className="container-custom">
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-cs-accent">
            What we believe
          </p>
          <h2 className="text-balance font-serif text-3xl font-bold text-cs-text md:text-4xl">
            Great doesn&apos;t mean expensive. Expensive doesn&apos;t mean great.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-cs-text-muted">
            CitySpak exists to close that gap: the best experience for the moment,
            regardless of what it costs, chosen because it&apos;s genuinely great, not
            because it&apos;s the newest, the loudest, or the highest bidder.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="space-y-3 rounded-2xl border border-cs-border bg-cs-surface p-6"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cs-accent/10 text-cs-accent">
                <pillar.icon className="h-5 w-5" />
              </span>
              <h3 className="font-semibold text-cs-text">{pillar.title}</h3>
              <p className="text-sm text-cs-text-muted">{pillar.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
