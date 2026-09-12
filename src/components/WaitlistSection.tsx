import { WaitlistForm } from "./WaitlistForm";

export function WaitlistSection() {
  return (
    <section id="waitlist" className="section-padding bg-gradient-to-r from-cs-accent/15 to-cs-warm/8">
      <div className="container-custom">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="mb-2 font-serif text-4xl font-bold text-cs-text">
            Be among the first.
          </h2>
          <p className="mb-8 text-lg text-cs-text-muted">
            No spam. Just a message when beta access opens.
          </p>
          <div className="rounded-2xl border border-cs-border bg-cs-surface p-6 text-left sm:p-8">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
}
