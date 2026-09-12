import { StatTile } from "./StatTile";
import { BarChart } from "./BarChart";
import { SHOW_TOTAL_COUNT, surveyData } from "@/lib/survey-data";

export function DemandDashboard() {
  const { severePct, avgIntentScore, betaCount, tools, features, frequency, wtp, openText, totalCount } =
    surveyData;

  return (
    <section id="demand" className="section-padding bg-cs-bg">
      <div className="container-custom">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-cs-text-muted">
            Demand validation
          </p>
          <h2 className="text-balance font-serif text-4xl font-bold text-cs-text md:text-5xl">
            People want this. Here&apos;s what the data says.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-cs-text-muted">
            We ran an open survey before writing a single line of code. These are the live
            results, updated as responses come in.
          </p>
        </div>

        <div className="mb-3 flex items-center justify-center gap-[7px] font-mono text-xs text-cs-text-muted">
          <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-cs-accent" />
          Survey is ongoing. Results update in real time.
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatTile
            label="Feel like they're missing out"
            value={String(severePct)}
            unit="%"
            sub='Say "sometimes" or more often'
          />
          <StatTile
            label="Average intent to use"
            value={String(avgIntentScore)}
            unit="/10"
            sub="On a weekly-use likelihood scale"
          />
          <StatTile
            label="Joined the beta list"
            value={String(betaCount)}
            sub="Opted in for early access"
            accent="warm"
          />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <BarChart
            title="How people currently find things to do"
            sub="Multiple choice — % of respondents"
            rows={[
              { label: "Ask friends", pct: tools.friends, color: "accent" },
              { label: "Instagram / TikTok", pct: tools.instagram, color: "warm" },
              { label: "Same places I know", pct: tools.samePlaces, color: "subtle" },
              { label: "Yelp / TripAdvisor", pct: tools.yelp, color: "subtle" },
              { label: "Google Search", pct: tools.google, color: "subtle" },
            ]}
            insight={
              <>
                <strong className="text-cs-accent">67% rely on asking a friend.</strong> That
                friend is what CitySpak replaces.
              </>
            }
          />

          <BarChart
            title="Most wanted feature in an experience app"
            sub="Single choice — % of respondents"
            rows={[
              { label: "Curated lists by situation", pct: features.curatedLists, color: "accent" },
              { label: "Find new places early", pct: features.newPlaces, color: "warm" },
              { label: "Mood-based recs", pct: features.moodRecs, color: "subtle" },
              { label: "Discover, book and plan", pct: features.endToEnd, color: "subtle" },
            ]}
            insight={
              <>
                <strong className="text-cs-accent">Curated lists</strong> (date night, group
                outing, solo afternoon), by a wide margin.
              </>
            }
          />

          <BarChart
            title="How often people feel like they're missing out"
            sub="Single choice — % of respondents"
            rows={[
              { label: "Almost always", pct: frequency.almostAlways, color: "accent" },
              { label: "Often", pct: frequency.often, color: "accent" },
              { label: "Sometimes", pct: frequency.sometimes, color: "accent" },
              { label: "Rarely", pct: frequency.rarely, color: "subtle" },
            ]}
            insight={
              <>
                <strong className="text-cs-accent">78% feel this regularly.</strong> The
                problem is consistent, not occasional.
              </>
            }
          />

          <BarChart
            title="Willingness to pay monthly"
            sub="Single choice — % of those who answered"
            rows={[
              { label: "Free only", pct: wtp.free, color: "subtle" },
              { label: "$4 – $7 / month", pct: wtp.tier1, color: "accent" },
              { label: "$8 – $12 / month", pct: wtp.tier2, color: "accent" },
            ]}
            insight={
              <>
                <strong className="text-cs-accent">50% willing to pay</strong> before the
                product even exists. That number grows after using it.
              </>
            }
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {openText.map((quote, i) => (
            <div key={i} className="rounded-2xl border border-cs-border bg-cs-surface p-5">
              <div className="mb-3 text-sm italic leading-relaxed text-cs-text before:content-['\201C'] before:not-italic before:text-cs-accent after:content-['\201D'] after:not-italic after:text-cs-accent">
                {quote.text}
              </div>
              <div className="font-mono text-[11px] text-cs-text-muted">
                Survey respondent · {quote.city}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-2 text-center text-xs text-cs-text-subtle">
          {SHOW_TOTAL_COUNT
            ? `Based on ${totalCount} responses collected. Survey is ongoing.`
            : "Survey is ongoing. Results update as new responses come in."}
        </p>
      </div>
    </section>
  );
}
