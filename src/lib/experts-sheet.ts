import { google } from "googleapis";
import type { ExpertsSurveyPayload } from "./experts-types";

/**
 * Writes venue expert survey submissions straight to a dedicated Google
 * Sheet, same service account and same Test/Live split as the waitlist
 * sheet (src/lib/google-sheets.ts), but its own EXPERTS_GOOGLE_SHEET_ID,
 * never one of the other two sheets. Two tabs per mode: "Responses" (one
 * row per rated venue) and "Suggested Additions" (one row per per-category
 * suggestion), both verified to exist rather than assumed, same lesson as
 * the earlier test-data-in-the-real-survey-sheet incident.
 */

// Venue first: it's the distinct factor per row, easiest to scan what was
// filled in for which venue. Category right after it, then everything else.
const RESPONSES_HEADER = [
  "Venue",
  "Category",
  "Name",
  "Handle",
  "Content focus",
  "Venues visited estimate",
  "Visit type",
  "Last visited",
  "Score",
  "Best for",
  "Recommend",
  "Tip",
  "Submitted at",
];

const SUGGESTIONS_HEADER = ["Name", "Handle", "Category", "Suggestion", "Submitted at"];

/** So the API route can return a clean 503 ("not set up yet") instead of a
 * generic 500 ("something broke") while EXPERTS_GOOGLE_SHEET_ID is still a
 * placeholder. */
export function isExpertsSheetConfigured(): boolean {
  return Boolean(
    process.env.EXPERTS_GOOGLE_SHEET_ID &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  );
}

function getCredentials() {
  const sheetId = process.env.EXPERTS_GOOGLE_SHEET_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!sheetId || !email || !rawKey) {
    throw new Error(
      "Google Sheets isn't configured: GOOGLE_SERVICE_ACCOUNT_EMAIL, " +
        "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, and EXPERTS_GOOGLE_SHEET_ID all " +
        "need to be set."
    );
  }

  const privateKey = rawKey.includes("\\n") ? rawKey.replace(/\\n/g, "\n") : rawKey;
  return { sheetId, email, privateKey };
}

async function getSheetsClient() {
  const { sheetId, email, privateKey } = getCredentials();
  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  return { sheets, sheetId };
}

/**
 * "Test" for local dev, "Live" for a production build. EXPERTS_SHEET_MODE
 * overrides either way, e.g. force "Test" on a Netlify deploy preview
 * (still builds in production mode but shouldn't collect real responses).
 */
function getMode(): "Test" | "Live" {
  const override = process.env.EXPERTS_SHEET_MODE;
  if (override === "Test" || override === "Live") return override;
  return process.env.NODE_ENV === "production" ? "Live" : "Test";
}

async function verifyTabsExist(
  sheets: ReturnType<typeof google.sheets>,
  sheetId: string,
  wanted: string[]
) {
  const { data } = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
    fields: "sheets.properties.title",
  });
  const tabs = (data.sheets ?? []).map((s) => s.properties?.title).filter(Boolean) as string[];
  const missing = wanted.filter((w) => !tabs.includes(w));
  if (missing.length > 0) {
    throw new Error(
      `Expected tab(s) ${missing.map((m) => `"${m}"`).join(", ")} in the experts spreadsheet, ` +
        `found: ${tabs.join(", ") || "(no tabs)"}. Create the missing tab(s), or set EXPERTS_SHEET_MODE.`
    );
  }
}

async function ensureHeaderRow(
  sheets: ReturnType<typeof google.sheets>,
  sheetId: string,
  tab: string,
  header: string[]
) {
  const lastCol = String.fromCharCode("A".charCodeAt(0) + header.length - 1);
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tab}!A1:${lastCol}1`,
  });
  if (!data.values || data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${tab}!A1:${lastCol}1`,
      valueInputOption: "RAW",
      requestBody: { values: [header] },
    });
  }
}

export async function appendSurveySubmission(payload: ExpertsSurveyPayload): Promise<void> {
  const { sheets, sheetId } = await getSheetsClient();
  const mode = getMode();
  const responsesTab = `Responses ${mode}`;
  const suggestionsTab = `Suggested Additions ${mode}`;

  await verifyTabsExist(sheets, sheetId, [responsesTab, suggestionsTab]);
  await ensureHeaderRow(sheets, sheetId, responsesTab, RESPONSES_HEADER);
  await ensureHeaderRow(sheets, sheetId, suggestionsTab, SUGGESTIONS_HEADER);

  const responseRows = Object.entries(payload.venues).map(([venueName, v]) => [
    venueName,
    v.category,
    payload.name,
    payload.handle,
    payload.content_focus,
    payload.venues_visited_estimate,
    v.visit_type,
    v.last_visited,
    v.score,
    v.best_for,
    v.recommend,
    v.tip,
    payload.submitted_at,
  ]);

  if (responseRows.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${responsesTab}!A:M`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: responseRows },
    });
  }

  const suggestionRows = Object.entries(payload.suggested_additions).map(([category, suggestion]) => [
    payload.name,
    payload.handle,
    category,
    suggestion,
    payload.submitted_at,
  ]);

  if (suggestionRows.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${suggestionsTab}!A:E`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: suggestionRows },
    });
  }
}
