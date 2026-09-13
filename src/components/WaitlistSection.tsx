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

          <div className="mt-8 rounded-2xl border border-cs-warm/30 bg-cs-warm/5 p-6">
            <p className="font-semibold text-cs-text">Want to help shape what we build?</p>
            <p className="mt-1 text-sm text-cs-text-muted">
              Take our 2-minute survey, it&apos;s what the data above is built from.
            </p>
            <a
              href="https://form.typeform.com/to/QXGKh5b4"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex h-11 items-center gap-2 rounded-lg bg-cs-warm px-6 text-sm font-semibold text-cs-bg transition-all hover:opacity-90"
            >
              Take the survey
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
