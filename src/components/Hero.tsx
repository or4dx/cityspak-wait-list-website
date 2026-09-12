export function Hero() {
  return (
    <header className="bg-cs-bg px-6 pb-16 pt-20">
      <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
        <div className="mb-8 flex items-center gap-2 text-xl font-semibold text-cs-chalk">
          <span className="inline-block h-2 w-2 rounded-full bg-cs-green" />
          City<span className="text-cs-green">Spak</span>
        </div>

        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.12em] text-cs-chalk-dim">
          Urban Experience Intelligence
        </p>

        <h1 className="mb-5 text-balance text-[clamp(32px,6vw,52px)] font-semibold leading-[1.15] text-cs-chalk">
          The city is full. Your weekend is empty.{" "}
          <span className="text-cs-green">We are fixing that.</span>
        </h1>

        <p className="mb-9 max-w-[520px] text-balance text-base leading-relaxed text-cs-chalk-dim">
          CitySpak curates real, situation-specific experiences from people who actually
          live in the city, so you stop scrolling five apps for one good answer.
        </p>

        <a
          href="#waitlist"
          className="rounded-cs bg-cs-green px-7 py-3 text-sm font-semibold text-cs-bg transition hover:bg-cs-green-dim"
        >
          Join the waitlist
        </a>
      </div>
    </header>
  );
}
