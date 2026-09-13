import { google } from "googleapis";
import type { SurveyData } from "./survey-data";
import { readEntries as readWaitlistEntries } from "./google-sheets";

/**
 * Live aggregation of the Typeform-linked survey responses sheet into the
 * exact SurveyData shape the dashboard already renders. Read-only,
 * SURVEY_GOOGLE_SHEET_ID's service account only ever needs Viewer access,
 * this never writes anything.
 *
 * Column order is the real sheet's own header row, matched by position
 * (not by header text, Typeform could rephrase a question slightly
 * without changing column order). If that order ever changes, this needs
 * updating alongside it.
 */
const COL = {
  frequency: 0,
  tools: 1,
  features: 2,
  intentScore: 3,
  wtp: 4,
  wish: 5,
  firstName: 6,
  city: 7,
  email: 8,
  experienceFocus: 9,
  submittedAt: 10,
  token: 11,
} as const;

const TOOL_MAP: Record<string, keyof SurveyData["tools"]> = {
  "Ask friends or a group chat": "friends",
  "Instagram or TikTok": "instagram",
  "I just go to the same places I know": "samePlaces",
  "Yelp, TripAdvisor, or similar": "yelp",
  "Google Search": "google",
};

const FEATURE_MAP: Record<string, keyof SurveyData["features"]> = {
  "Curated lists for specific situations like date night or group outings": "curatedLists",
  "Finding new places before they get popular": "newPlaces",
  "Recommendations matched to my mood or occasion": "moodRecs",
  "One place to discover, book, and plan an experience end to end": "endToEnd",
};

const FREQUENCY_MAP: Record<string, keyof SurveyData["frequency"]> = {
  "Almost always": "almostAlways",
  Often: "often",
  Sometimes: "sometimes",
  Rarely: "rarely",
  Never: "never",
};

const WTP_MAP: Record<string, keyof SurveyData["wtp"]> = {
  "Free only, I would not pay": "free",
  "$4 to $7/month": "tier1",
  "$8 to $12/month": "tier2",
};

function pct(count: number, total: number): number {
  return total === 0 ? 0 : Math.round((count / total) * 100);
}

async function getSurveySheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const sheetId = process.env.SURVEY_GOOGLE_SHEET_ID;

  if (!email || !rawKey || !sheetId) {
    throw new Error(
      "Survey Sheets isn't configured: GOOGLE_SERVICE_ACCOUNT_EMAIL, " +
        "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, and SURVEY_GOOGLE_SHEET_ID all " +
        "need to be set."
    );
  }
  const privateKey = rawKey.includes("\\n") ? rawKey.replace(/\\n/g, "\n") : rawKey;

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    // Read-only on purpose, this code should never be able to write to
    // the survey sheet even if a bug tried to.
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  return { sheets: google.sheets({ version: "v4", auth }), sheetId };
}

export async function fetchLiveSurveyData(): Promise<SurveyData> {
  const { sheets, sheetId } = await getSurveySheetsClient();

  const meta = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
    fields: "sheets.properties.title",
  });
  const tab = meta.data.sheets?.[0]?.properties?.title;
  if (!tab) throw new Error("Couldn't find a tab in the survey spreadsheet.");

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tab}!A2:L`,
  });
  const rows = data.values ?? [];

  const tools = { friends: 0, instagram: 0, samePlaces: 0, yelp: 0, google: 0 };
  const features = { curatedLists: 0, newPlaces: 0, moodRecs: 0, endToEnd: 0 };
  const frequency = { almostAlways: 0, often: 0, sometimes: 0, rarely: 0, never: 0 };
  const wtp = { free: 0, tier1: 0, tier2: 0 };

  let intentSum = 0;
  let intentCount = 0;
  let emailCount = 0;

  for (const row of rows) {
    const freqKey = FREQUENCY_MAP[String(row[COL.frequency] ?? "").trim()];
    if (freqKey) frequency[freqKey]++;

    for (const part of String(row[COL.tools] ?? "").split(",")) {
      const toolKey = TOOL_MAP[part.trim()];
      if (toolKey) tools[toolKey]++;
    }

    const featureKey = FEATURE_MAP[String(row[COL.features] ?? "").trim()];
    if (featureKey) features[featureKey]++;

    const intentRaw = String(row[COL.intentScore] ?? "").trim();
    const intentNum = Number(intentRaw);
    if (intentRaw && !Number.isNaN(intentNum)) {
      intentSum += intentNum;
      intentCount++;
    }

    const wtpKey = WTP_MAP[String(row[COL.wtp] ?? "").trim()];
    if (wtpKey) wtp[wtpKey]++;

    if (String(row[COL.email] ?? "").trim()) emailCount++;
  }

  const totalCount = rows.length;
  const severeCount = frequency.almostAlways + frequency.often + frequency.sometimes;

  // Per the agreed definition: survey respondents who left an email, plus
  // however many people are on the actual waitlist. Not a dedicated
  // "beta interest" question, that can change later if this needs its own
  // sheet/column.
  let waitlistCount = 0;
  try {
    waitlistCount = (await readWaitlistEntries()).length;
  } catch (err) {
    console.error("Couldn't read waitlist count for betaCount, using 0:", err);
  }

  return {
    totalCount,
    severePct: pct(severeCount, totalCount),
    avgIntentScore: intentCount > 0 ? Math.round((intentSum / intentCount) * 10) / 10 : 0,
    betaCount: emailCount + waitlistCount,
    tools: {
      friends: pct(tools.friends, totalCount),
      instagram: pct(tools.instagram, totalCount),
      samePlaces: pct(tools.samePlaces, totalCount),
      yelp: pct(tools.yelp, totalCount),
      google: pct(tools.google, totalCount),
    },
    features: {
      curatedLists: pct(features.curatedLists, totalCount),
      newPlaces: pct(features.newPlaces, totalCount),
      moodRecs: pct(features.moodRecs, totalCount),
      endToEnd: pct(features.endToEnd, totalCount),
    },
    frequency: {
      almostAlways: pct(frequency.almostAlways, totalCount),
      often: pct(frequency.often, totalCount),
      sometimes: pct(frequency.sometimes, totalCount),
      rarely: pct(frequency.rarely, totalCount),
      never: pct(frequency.never, totalCount),
    },
    wtp: {
      free: pct(wtp.free, totalCount),
      tier1: pct(wtp.tier1, totalCount),
      tier2: pct(wtp.tier2, totalCount),
    },
    // The "what do you wish existed" free-text answers are deliberately
    // never surfaced here, unmoderated user text has no business landing
    // straight on a public, investor-facing page. DemandDashboard uses the
    // hand-picked quotes in survey-data.ts instead, update that array
    // yourself with real quotes you've actually read.
    openText: [],
  };
}
