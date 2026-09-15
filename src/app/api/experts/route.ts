import { NextResponse } from "next/server";

/**
 * Forwards a venue expert survey submission to an external webhook (Zapier,
 * Make, or a custom endpoint), server-side, so SURVEY_WEBHOOK_URL itself
 * never reaches the browser bundle. Mirrors src/app/api/waitlist/route.ts's
 * shape: validate the minimum, forward, surface a clear error rather than
 * silently dropping the submission.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const venues = body.venues as Record<string, unknown> | undefined;
  if (!venues || typeof venues !== "object" || Object.keys(venues).length === 0) {
    return NextResponse.json({ message: "Mark at least one venue as visited before submitting." }, { status: 400 });
  }

  const webhookUrl = process.env.SURVEY_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("SURVEY_WEBHOOK_URL is not set, dropping a survey submission.");
    return NextResponse.json(
      { message: "Survey submissions aren't accepted yet. Please try again shortly." },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Webhook responded with status ${res.status}`);
    }
  } catch (err) {
    console.error("Failed to forward survey submission to webhook:", err);
    return NextResponse.json(
      { message: "Something went wrong saving your responses. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Responses recorded." }, { status: 201 });
}
