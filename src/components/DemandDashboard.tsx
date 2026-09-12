import { StatTile } from "./StatTile";
import { BarChart } from "./BarChart";
import { SHOW_TOTAL_COUNT, surveyData } from "@/lib/survey-data";

export function DemandDashboard() {
  const { severePct, avgIntentScore, betaCount, tools, features, frequency, wtp, openText, totalCount } =
    surveyData;

  return (
    <section id="demand" className="bg-cs-bg px-6 py-[72px] pb-20">
      <div className="mx-auto max-w-[980px]">
        <p className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.12em] text-cs-green">
          Demand validation
        </p>
        <h2 className="mb-2.5 text-balance text-[clamp(26px,4vw,38px)] font-semibold leading-tight text-cs-chalk">
          People want this. Here&apos;s what the data says.
        </h2>
        <p className="mb-10 max-w-[560px] text-[15px] leading-relaxed text-cs-chalk-dim">
          We ran an open survey before writing a single line of code. These are the live
          results, updated as responses come in.
        </p>

        <div className="mb-9 inline-flex items-center gap-[7px] font-mono text-xs text-cs-chalk-dim">
          <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-cs-green" />
          Survey is ongoing. Results update in real time.
        </div>

        <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
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
            accent="blue"
          />
        </div>

        <div className="mb-7 grid grid-cols-1 gap-3.5 md:grid-cols-2">
          <BarChart
            title="How people currently find things to do"
            sub="Multiple choice — % of respondents"
            rows={[
              { label: "Ask friends", pct: tools.friends, color: "green" },
              { label: "Instagram / TikTok", pct: tools.instagram, color: "blue" },
              { label: "Same places I know", pct: tools.samePlaces, color: "amber" },
              { label: "Yelp / TripAdvisor", pct: tools.yelp, color: "mute" },
              { label: "Google Search", pct: tools.google, color: "mute" },
            ]}
            insight={
              <>
                <strong className="text-cs-green">67% rely on asking a friend.</strong> That
                friend is what CitySpak replaces.
              </>
            }
          />

          <BarChart
            title="Most wanted feature in an experience app"
            sub="Single choice — % of respondents"
            rows={[
              { label: "Curated lists by situation", pct: features.curatedLists, color: "green" },
              { label: "Find new places early", pct: features.newPlaces, color: "blue" },
              { label: "Mood-based recs", pct: features.moodRecs, color: "mute" },
              { label: "Discover, book and plan", pct: features.endToEnd, color: "mute" },
            ]}
            insight={
              <>
                <strong className="text-cs-green">Curated lists</strong> (date night, group
                outing, solo afternoon), by a wide margin.
              </>
            }
          />

          <BarChart
            title="How often people feel like they're missing out"
            sub="Single choice — % of respondents"
            rows={[
              { label: "Almost always", pct: frequency.almostAlways, color: "green" },
              { label: "Often", pct: frequency.often, color: "green" },
              { label: "Sometimes", pct: frequency.sometimes, color: "green" },
              { label: "Rarely", pct: frequency.rarely, color: "mute" },
            ]}
            insight={
              <>
                <strong className="text-cs-green">78% feel this regularly.</strong> The
                problem is consistent, not occasional.
              </>
            }
          />

          <BarChart
            title="Willingness to pay monthly"
            sub="Single choice — % of those who answered"
            rows={[
              { label: "Free only", pct: wtp.free, color: "mute" },
              { label: "$4 – $7 / month", pct: wtp.tier1, color: "green" },
              { label: "$8 – $12 / month", pct: wtp.tier2, color: "green" },
            ]}
            insight={
              <>
                <strong className="text-cs-green">50% willing to pay</strong> before the
                product even exists. That number grows after using it.
              </>
            }
          />
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {openText.map((quote, i) => (
            <div key={i} className="rounded-cs border border-cs-border bg-cs-surface p-4">
              <div className="mb-2.5 text-[13px] italic leading-relaxed text-cs-chalk before:content-['\201C'] before:not-italic before:text-cs-green after:content-['\201D'] after:not-italic after:text-cs-green">
                {quote.text}
              </div>
              <div className="font-mono text-[11px] text-cs-chalk-dim">
                Survey respondent · {quote.city}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-2 text-center text-xs text-cs-chalk-mute">
          {SHOW_TOTAL_COUNT
            ? `Based on ${totalCount} responses collected. Survey is ongoing.`
            : "Survey is ongoing. Results update as new responses come in."}
        </p>
      </div>
    </section>
  );
}
