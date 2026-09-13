import { NextResponse } from "next/server";
import { upsertEntry } from "@/lib/google-sheets";

/**
 * Waitlist signups go straight to a Google Sheet (see src/lib/google-sheets.ts),
 * durable, survives Vercel/Netlify's ephemeral filesystem, and never touches
 * git, so no PII in the repo. Requires GOOGLE_SERVICE_ACCOUNT_EMAIL,
 * GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, and WAITLIST_GOOGLE_SHEET_ID to be set.
 */

const EXPERIENCE_FOCUS_OPTIONS = new Set([
  "Date nights",
  "Group outings",
  "Solo discovery",
  "All of the above",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  try {
    await upsertEntry({
      firstName,
      email,
      city,
      experienceFocus,
      submittedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to write waitlist entry to Google Sheets:", err);
    return NextResponse.json(
      { message: "Something went wrong saving your signup. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Added to the waitlist." }, { status: 201 });
}
