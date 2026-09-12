import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/**
 * Simplest possible storage, per the spec: a local JSON file, one entry per
 * signup. Gitignored (`data/`), this holds real PII (name, email, city).
 *
 * IMPORTANT: this only works for local dev/testing. Vercel's filesystem is
 * ephemeral per invocation, a write here will NOT persist once deployed,
 * it'll silently vanish on the next cold start or deploy. Before shipping
 * this to Vercel, swap the storage for something durable: forward to an
 * email service (Resend), write to a lightweight hosted DB, or append to
 * the same Google Sheet the survey data reads from.
 */
const DATA_DIR = path.join(process.cwd(), "data");
const WAITLIST_FILE = path.join(DATA_DIR, "waitlist.json");

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
  try {
    const raw = await fs.readFile(WAITLIST_FILE, "utf-8");
    return JSON.parse(raw) as WaitlistEntry[];
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "ENOENT") return [];
    throw err;
  }
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

  await fs.writeFile(WAITLIST_FILE, JSON.stringify(entries, null, 2), "utf-8");

  return NextResponse.json({ message: "Added to the waitlist." }, { status: 201 });
}
