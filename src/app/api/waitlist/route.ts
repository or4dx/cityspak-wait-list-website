import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import ExcelJS from "exceljs";

/**
 * Simplest possible storage, per the spec: a local .xlsx workbook, one row
 * per signup. Gitignored (`data/`), this holds real PII (name, email, city).
 * Every submission rereads this same file and rewrites it in place, it
 * never generates a new file, "waitlist.xlsx" is always the one workbook.
 *
 * IMPORTANT: this only works for local dev/testing. Vercel's filesystem is
 * ephemeral per invocation, a write here will NOT persist once deployed,
 * it'll silently vanish on the next cold start or deploy. Before shipping
 * this to Vercel, swap the storage for something durable: forward to an
 * email service (Resend), write to a lightweight hosted DB, or append to
 * a Google Sheet (see .env.local for the service-account variables staged
 * for that, not wired up yet).
 */
const DATA_DIR = path.join(process.cwd(), "data");
const WAITLIST_FILE = path.join(DATA_DIR, "waitlist.xlsx");
const SHEET_NAME = "Waitlist";

const COLUMNS: { header: string; key: keyof WaitlistEntry; width: number }[] = [
  { header: "First Name", key: "firstName", width: 20 },
  { header: "Email", key: "email", width: 32 },
  { header: "City", key: "city", width: 20 },
  { header: "Experience Focus", key: "experienceFocus", width: 24 },
  { header: "Submitted At", key: "submittedAt", width: 24 },
];

const EXPERIENCE_FOCUS_OPTIONS = new Set([
  "Date nights",
  "Group outings",
  "Solo discovery",
  "All of the above",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface WaitlistEntry {
  firstName: string;
  email: string;
  city: string;
  experienceFocus: string;
  submittedAt: string;
}

async function readEntries(): Promise<WaitlistEntry[]> {
  // exceljs doesn't raise a Node-style ENOENT for a missing file, it throws
  // a plain Error with its own message, so check existence ourselves rather
  // than pattern-match that string.
  try {
    await fs.access(WAITLIST_FILE);
  } catch {
    return [];
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(WAITLIST_FILE);

  const sheet = workbook.getWorksheet(SHEET_NAME);
  if (!sheet) return [];

  const entries: WaitlistEntry[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // header row
    const [, firstName, email, city, experienceFocus, submittedAt] = row.values as unknown[];
    entries.push({
      firstName: String(firstName ?? ""),
      email: String(email ?? ""),
      city: String(city ?? ""),
      experienceFocus: String(experienceFocus ?? ""),
      submittedAt: String(submittedAt ?? ""),
    });
  });
  return entries;
}

async function writeEntries(entries: WaitlistEntry[]): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(SHEET_NAME);
  sheet.columns = COLUMNS;
  sheet.getRow(1).font = { bold: true };
  entries.forEach((entry) => sheet.addRow(entry));
  await workbook.xlsx.writeFile(WAITLIST_FILE);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const experienceFocus = typeof body.experienceFocus === "string" ? body.experienceFocus : "";

  if (!firstName || !email || !city || !experienceFocus) {
    return NextResponse.json({ message: "All fields are required." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }
  if (!EXPERIENCE_FOCUS_OPTIONS.has(experienceFocus)) {
    return NextResponse.json({ message: "Please select a valid experience focus." }, { status: 400 });
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  const entries = await readEntries();

  // Same email signing up again just updates their existing entry rather
  // than piling up duplicates from a double-click or a re-visit.
  const existingIndex = entries.findIndex((entry) => entry.email === email);
  const entry: WaitlistEntry = {
    firstName,
    email,
    city,
    experienceFocus,
    submittedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.push(entry);
  }

  await writeEntries(entries);

  return NextResponse.json({ message: "Added to the waitlist." }, { status: 201 });
}
