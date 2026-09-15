import { NextResponse } from "next/server";
import { appendSurveySubmission } from "@/lib/experts-sheet";
import type { ExpertsSurveyPayload, VenueSubmission } from "@/lib/experts-types";

/**
 * Venue expert survey submissions go straight to a Google Sheet (see
 * src/lib/experts-sheet.ts), same pattern as the waitlist signups, not an
 * external webhook. Requires GOOGLE_SERVICE_ACCOUNT_EMAIL,
 * GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, and EXPERTS_GOOGLE_SHEET_ID to be set.
 */

function isVenueSubmission(value: unknown): value is VenueSubmission {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.category === "string" &&
    typeof v.visit_type === "string" &&
    typeof v.last_visited === "string" &&
    typeof v.score === "number" &&
    typeof v.best_for === "string" &&
    typeof v.recommend === "string" &&
    typeof v.tip === "string"
  );
}

function parsePayload(body: Record<string, unknown>): ExpertsSurveyPayload | null {
  if (typeof body.submitted_at !== "string") return null;
  if (typeof body.name !== "string") return null;
  if (typeof body.handle !== "string") return null;
  if (typeof body.content_focus !== "string") return null;
  if (typeof body.venues_visited_estimate !== "string") return null;

  const venuesRaw = body.venues;
  if (!venuesRaw || typeof venuesRaw !== "object") return null;
  const venues: Record<string, VenueSubmission> = {};
  for (const [name, entry] of Object.entries(venuesRaw as Record<string, unknown>)) {
    if (!isVenueSubmission(entry)) return null;
    venues[name] = entry;
  }
  if (Object.keys(venues).length === 0) return null;

  const suggestedRaw = body.suggested_additions;
  const suggested_additions: Record<string, string> = {};
  if (suggestedRaw && typeof suggestedRaw === "object") {
    for (const [category, text] of Object.entries(suggestedRaw as Record<string, unknown>)) {
      if (typeof text === "string" && text.trim()) suggested_additions[category] = text;
    }
  }

  return {
    submitted_at: body.submitted_at,
    name: body.name,
    handle: body.handle,
    content_focus: body.content_focus,
    venues_visited_estimate: body.venues_visited_estimate,
    venues,
    suggested_additions,
  };
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const payload = parsePayload(body);
  if (!payload) {
    return NextResponse.json(
      { message: "Mark at least one venue as visited before submitting." },
      { status: 400 }
    );
  }

  try {
    await appendSurveySubmission(payload);
  } catch (err) {
    console.error("Failed to write expert survey submission to Google Sheets:", err);
    return NextResponse.json(
      { message: "Something went wrong saving your responses. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Responses recorded." }, { status: 201 });
}
