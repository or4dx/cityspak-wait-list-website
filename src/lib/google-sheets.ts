import { google } from "googleapis";

/**
 * Thin wrapper around the Sheets API for the waitlist. Reads use
 * spreadsheets.values.get, writes use values.append/values.update, both
 * atomic on Google's side, no local-file race condition to worry about.
 *
 * The target tab is picked explicitly, "Test" for local/dev, "Live" for a
 * real production deploy, so a local test run can never land in the same
 * place as real signups. WAITLIST_SHEET_TAB overrides either way, useful
 * for a Netlify deploy preview/branch deploy, which still builds in
 * production mode but shouldn't collect real signups.
 */

export interface WaitlistEntry {
  firstName: string;
  email: string;
  city: string;
  experienceFocus: string;
  submittedAt: string;
}

// Matches the waitlist form's own field labels (src/components/WaitlistForm.tsx)
// exactly, this sheet's headers are the form's own questions, not the
// survey's, they're two separate sheets for two separate purposes.
const HEADER_ROW = ["First name", "Email", "City", "Experience focus", "Submitted at"];

function getCredentials() {
  const sheetId = process.env.WAITLIST_GOOGLE_SHEET_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!sheetId || !email || !rawKey) {
    throw new Error(
      "Google Sheets isn't configured: GOOGLE_SERVICE_ACCOUNT_EMAIL, " +
        "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, and WAITLIST_GOOGLE_SHEET_ID all " +
        "need to be set."
    );
  }

  // Env files usually keep the key's newlines as literal "\n" rather than
  // real line breaks, undo that if present.
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
 * "Test" for local dev, "Live" for a production build, WAITLIST_SHEET_TAB
 * overrides either way. Verifies the tab actually exists rather than
 * silently falling back to whatever happens to be first, that's the exact
 * mistake that mixed test data into the real survey sheet earlier.
 */
async function getTargetTab(sheets: ReturnType<typeof google.sheets>, sheetId: string) {
  const wanted =
    process.env.WAITLIST_SHEET_TAB || (process.env.NODE_ENV === "production" ? "Live" : "Test");

  const { data } = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
    fields: "sheets.properties.title",
  });
  const tabs = (data.sheets ?? []).map((s) => s.properties?.title).filter(Boolean);

  if (!tabs.includes(wanted)) {
    throw new Error(
      `Expected a "${wanted}" tab in the waitlist spreadsheet, found: ${tabs.join(", ") || "(no tabs)"}. ` +
        `Create it, or set WAITLIST_SHEET_TAB to an existing tab name.`
    );
  }
  return wanted;
}

async function ensureHeaderRow(
  sheets: ReturnType<typeof google.sheets>,
  sheetId: string,
  tab: string
) {
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tab}!A1:E1`,
  });
  if (!data.values || data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${tab}!A1:E1`,
      valueInputOption: "RAW",
      requestBody: { values: [HEADER_ROW] },
    });
  }
}

export async function readEntries(): Promise<WaitlistEntry[]> {
  const { sheets, sheetId } = await getSheetsClient();
  const tab = await getTargetTab(sheets, sheetId);
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tab}!A2:E`,
  });
  const rows = data.values ?? [];
  return rows.map((row) => ({
    firstName: String(row[0] ?? ""),
    email: String(row[1] ?? ""),
    city: String(row[2] ?? ""),
    experienceFocus: String(row[3] ?? ""),
    submittedAt: String(row[4] ?? ""),
  }));
}

/**
 * Writes one entry: updates the existing row in place if that email is
 * already present, appends a new row otherwise. Never rewrites the whole
 * sheet, so this is safe even with concurrent submissions racing each
 * other, at worst two near-simultaneous new signups both append (fine,
 * they're different rows) or both target the same existing email (Google
 * serializes the two update calls, the second one just wins, same outcome
 * as the old local-file version already had).
 */
export async function upsertEntry(entry: WaitlistEntry): Promise<void> {
  const { sheets, sheetId } = await getSheetsClient();
  const tab = await getTargetTab(sheets, sheetId);
  await ensureHeaderRow(sheets, sheetId, tab);

  const existing = await readEntries();
  const rowValues = [
    entry.firstName,
    entry.email,
    entry.city,
    entry.experienceFocus,
    entry.submittedAt,
  ];

  const existingIndex = existing.findIndex((row) => row.email === entry.email);
  if (existingIndex >= 0) {
    const rowNumber = existingIndex + 2; // +1 for header, +1 for 1-indexing
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${tab}!A${rowNumber}:E${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [rowValues] },
    });
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${tab}!A:E`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [rowValues] },
    });
  }
}
