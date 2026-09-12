# CitySpak Waitlist Site

Public marketing/waitlist page for CitySpak. Separate repo from the main
[CitySpak](../CitySpak) monorepo on purpose, independent deploy cadence,
own design, no dependency on the main app's backend.

## What's here (public site only)

- Hero, problem statement, a live-styled demand-validation dashboard
  (currently static data, see below), and a waitlist signup form.
- The **admin-only** view of full survey results (names/emails/beta
  pipeline) is deliberately not part of this repo, that's a tab inside the
  main CitySpak app's existing `/admin` panel instead, paused for now.

## Data sources, current state

- **Survey stats** (`src/lib/survey-data.ts`): hardcoded, matches the
  latest manual snapshot from the provided mockups. Swap this for a live
  fetch once the Google Sheets integration (planned on the main CitySpak
  repo's admin side) exists, same shape, no component here needs to change.
- **Waitlist signups** (`src/app/api/waitlist/route.ts`): written to a local
  JSON file (`data/waitlist.json`, gitignored, real PII). **This does not
  persist on Vercel** (ephemeral filesystem), it's dev/local-only for now.
  Before deploying, swap this for something durable: forward to an email
  service (Resend), a lightweight hosted DB, or append to the same Google
  Sheet the survey data will read from.

## Running locally

```bash
pnpm install
pnpm dev
```

## Design

Matches the main CitySpak app's own marketing landing page
(`apps/web/src/components/home/MarketingLanding.tsx`) for brand
uniformity, not the dark investor-deck mockups this was first built from.
Same `cs-*` tokens (transcribed from the app's `globals.css`), same
asymmetric 2-color palette (emerald accent, orange warm as a lighter
contrast signal, never a third arbitrary color), same font system (Inter/
Playfair Display/DM Mono), same ambient-glow + drifting-sparkle hero
motif. Light is the default (matching the app's shipped default); dark is
a `prefers-color-scheme` fallback, not a JS toggle, this is a lightweight
marketing page, not the full app.
