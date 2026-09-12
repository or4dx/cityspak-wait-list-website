import { WaitlistForm } from "./WaitlistForm";

export function WaitlistSection() {
  return (
    <section id="waitlist" className="bg-cs-bg px-6 py-20">
      <div className="mx-auto max-w-[480px] text-center">
        <h2 className="mb-2 text-[clamp(24px,4vw,32px)] font-semibold text-cs-chalk">
          Be among the first.
        </h2>
        <p className="mb-8 text-sm text-cs-chalk-dim">
          No spam. Just a message when beta access opens.
        </p>
        <div className="text-left">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
