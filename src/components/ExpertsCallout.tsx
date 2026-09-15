import { Compass } from "lucide-react";

/**
 * Secondary homepage CTA, a different audience than the general waitlist:
 * lifestyle influencers and venue regulars who already know the city well.
 * Links out to /experts, which otherwise has no other path in from the
 * site (it's a dedicated route, not a homepage anchor).
 */
export function ExpertsCallout() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 rounded-2xl border border-cs-border bg-cs-surface p-8 text-center sm:p-10">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cs-accent/10 text-cs-accent">
            <Compass className="h-5 w-5" />
          </span>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cs-accent">
            Venue Expert Program
          </p>
          <h2 className="text-balance font-serif text-2xl font-bold text-cs-text md:text-3xl">
            Already know the city&apos;s best spots?
          </h2>
          <p className="max-w-md text-sm text-cs-text-muted">
            If you&apos;re a lifestyle influencer or someone who&apos;s genuinely been everywhere, tell us
            what you know. Your ratings and insider tips help shape how CitySpak curates the city.
          </p>
          <a
            href="/experts"
            className="rounded-lg bg-cs-accent px-6 py-3 text-sm font-semibold text-cs-bg transition-all hover:bg-cs-accent-hover hover:shadow-lg hover:shadow-cs-accent/25"
          >
            Share what you know
          </a>
        </div>
      </div>
    </section>
  );
}
