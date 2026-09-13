import { Sparkles } from "lucide-react";
import { Sparkle } from "./Sparkle";

// Same asymmetric-palette rule as the main app's hero: emerald (accent)
// dominant and larger, orange (warm) smaller/lower-opacity, a contrast
// signal, never equal weight.
const HERO_SPARKLES = [
  { top: "15%", left: "18%", size: 6, color: "rgba(5,150,105,1)", duration: "7s", delay: "0s" },
  { top: "22%", left: "68%", size: 5, color: "rgba(234,88,12,1)", duration: "9s", delay: "2.5s" },
  { top: "40%", left: "38%", size: 7, color: "rgba(5,150,105,1)", duration: "8s", delay: "4s" },
  { top: "55%", left: "78%", size: 5, color: "rgba(5,150,105,1)", duration: "10s", delay: "1s" },
  { top: "65%", left: "12%", size: 6, color: "rgba(234,88,12,1)", duration: "7.5s", delay: "3.5s" },
];

export function Hero() {
  return (
    <section className="relative z-0 flex min-h-[85vh] flex-col justify-center overflow-hidden pt-24">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(5,150,105,0.14), transparent)",
        }}
      />
      {HERO_SPARKLES.map((s, i) => (
        <Sparkle key={i} {...s} />
      ))}

      <div className="container-custom">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-cs-text-muted">
            Coming soon · Early access
          </p>
          <h1 className="text-balance font-serif text-5xl font-bold leading-[1.1] text-cs-text md:text-7xl">
            The city, decoded by
            <br />
            the people who actually live in it.
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base text-cs-text-muted">
            Real intelligence, not guesswork. CitySpak surfaces what locals already
            know, so you end up somewhere genuinely good, not just highly rated. We
            curate just not everything the city has, but what&apos;s actually worth
            your time.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#waitlist"
              className="inline-flex h-14 items-center gap-2 rounded-lg bg-cs-accent px-10 text-lg font-semibold text-cs-bg transition-all hover:bg-cs-accent-hover hover:shadow-lg hover:shadow-cs-accent/25 active:scale-[0.98]"
            >
              <Sparkles className="h-5 w-5" />
              Join the waitlist
            </a>
            <a
              href="#demand"
              className="inline-flex h-14 items-center gap-2 rounded-lg border border-cs-border px-10 text-lg font-semibold text-cs-text-muted transition-all hover:text-cs-text"
            >
              See the data
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
