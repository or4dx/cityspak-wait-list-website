/**
 * Public-facing, non-PII survey aggregates for the landing page's demand
 * dashboard section.
 *
 * TEMP: hardcoded, matching the current snapshot from the provided
 * CitySpak_public-dashboard.html mockup. Once the admin-side Google Sheets
 * integration exists (paused, see the CitySpak repo's admin-dashboard-tab
 * work), this becomes a live fetch from that same processed-data source
 * instead, same shape, so no component below needs to change.
 *
 * SHOW_TOTAL_COUNT: flip to true once responses reach 50+. At n=9, showing
 * "9 people filled this" is a negative signal; the raw count only becomes
 * useful as social proof past a real threshold.
 */
export const SHOW_TOTAL_COUNT = false;

export interface SurveyData {
  totalCount: number;
  severePct: number;
  avgIntentScore: number;
  betaCount: number;
  tools: {
    friends: number;
    instagram: number;
    samePlaces: number;
    yelp: number;
    google: number;
  };
  features: {
    curatedLists: number;
    newPlaces: number;
    moodRecs: number;
    endToEnd: number;
  };
  frequency: {
    almostAlways: number;
    often: number;
    sometimes: number;
    rarely: number;
    never: number;
  };
  wtp: {
    free: number;
    tier1: number;
    tier2: number;
  };
  openText: Array<{ text: string; city: string }>;
}

export const surveyData: SurveyData = {
  totalCount: 9,
  severePct: 78,
  avgIntentScore: 8.1,
  betaCount: 7,
  tools: { friends: 67, instagram: 33, samePlaces: 33, yelp: 22, google: 11 },
  features: { curatedLists: 56, newPlaces: 22, moodRecs: 11, endToEnd: 11 },
  frequency: { almostAlways: 11, often: 33, sometimes: 33, rarely: 22, never: 0 },
  wtp: { free: 50, tier1: 25, tier2: 25 },
  openText: [
    {
      text: "More love shown to places that have been around a while and under the radar, instead of always pushing new openings.",
      city: "Dubai",
    },
    {
      text: "People who don't only go out to brunches and bars — somewhere to meet and connect with others doing different things.",
      city: "Dubai",
    },
    {
      text: "More precise details and real information about places in the city — not just the highlight reel.",
      city: "Dubai",
    },
  ],
};
