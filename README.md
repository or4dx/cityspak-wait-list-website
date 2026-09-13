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

- **Survey stats** (`src/lib/survey-data.ts`): still hardcoded for now. Will
  be replaced by a live read from `SURVEY_GOOGLE_SHEET_ID` (the
  Typeform-linked survey responses sheet, read-only), same output shape, no
  component here needs to change when that lands.
- **Waitlist signups** (`src/app/api/waitlist/route.ts` +
  `src/lib/google-sheets.ts`): written straight to a Google Sheet
  (`WAITLIST_GOOGLE_SHEET_ID`) via the Sheets API, durable, survives
  Netlify/Vercel's ephemeral filesystem, never touches git. A repeat email
  updates its existing row in place rather than duplicating it.
  - The sheet has two tabs, **Test** and **Live**. Which one gets written
    to is automatic: local dev (`pnpm dev`) defaults to **Test**, a
    production build defaults to **Live**, so local testing can never mix
    with real signups. Override with `WAITLIST_SHEET_TAB` if a deploy
    context needs something else (e.g. a Netlify deploy preview, which
    still builds in production mode but shouldn't collect real signups).
  - Two entirely separate Google Sheets are in play, never confuse them:
    the waitlist sheet (this app writes to it, Editor access) and the
    survey responses sheet (this app only ever reads from it, Viewer access
    only, sharing it as Editor here would be a mistake).

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
