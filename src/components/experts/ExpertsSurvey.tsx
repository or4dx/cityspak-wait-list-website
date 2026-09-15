"use client";

import { useMemo, useState } from "react";
import { CitySpakMark } from "@/components/CitySpakMark";
import { ChipGroup } from "./ChipGroup";
import { VenueAvatar } from "./VenueAvatar";
import { VenueRow } from "./VenueRow";
import {
  EXPERT_CATEGORIES,
  FOCUS_OPTIONS,
  VISIT_COUNT_OPTIONS,
  venueId,
} from "@/lib/experts-data";
import type { ExpertsSurveyPayload, VenueRatingState, VenueSubmission } from "@/lib/experts-types";

type Step = 1 | 2 | 3 | 4;
type SubmitStatus = "idle" | "submitting" | "success" | "error";

const STEP_LABELS: Record<Exclude<Step, 4>, string> = {
  1: "Step 1 of 3",
  2: "Step 2 of 3",
  3: "Step 3 of 3",
};

function newRating(): VenueRatingState {
  return { visitType: "", lastVisited: "", score: 0, bestFor: new Set(), recommend: "", tip: "" };
}

export function ExpertsSurvey() {
  const [step, setStep] = useState<Step>(1);

  // Step 1
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [focus, setFocus] = useState<Set<string>>(new Set());
  const [countEstimate, setCountEstimate] = useState("");

  // Step 2
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
  const [categoryWarning, setCategoryWarning] = useState(false);

  // Step 3
  const [visitedVenues, setVisitedVenues] = useState<Set<string>>(new Set());
  const [ratings, setRatings] = useState<Record<string, VenueRatingState>>({});
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});
  const [submitWarning, setSubmitWarning] = useState(false);

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedCategories = useMemo(
    () => EXPERT_CATEGORIES.filter((c) => selectedCategoryIds.has(c.id)),
    [selectedCategoryIds]
  );

  function toggleFocus(option: string) {
    setFocus((prev) => {
      const next = new Set(prev);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });
  }

  function toggleCategory(id: string) {
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleVisited(vid: string) {
    setVisitedVenues((prev) => {
      const next = new Set(prev);
      if (next.has(vid)) {
        next.delete(vid);
        setRatings((r) => {
          const rest = { ...r };
          delete rest[vid];
          return rest;
        });
      } else {
        next.add(vid);
        setRatings((r) => ({ ...r, [vid]: newRating() }));
      }
      return next;
    });
  }

  function patchRating(vid: string, patch: Partial<VenueRatingState>) {
    setRatings((prev) => ({ ...prev, [vid]: { ...prev[vid], ...patch } }));
  }

  function toggleBestFor(vid: string, option: string) {
    setRatings((prev) => {
      const current = prev[vid];
      if (!current) return prev;
      const next = new Set(current.bestFor);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return { ...prev, [vid]: { ...current, bestFor: next } };
    });
  }

  function goToStep(target: Step) {
    if (target === 3 && selectedCategoryIds.size === 0) {
      setCategoryWarning(true);
      return;
    }
    setCategoryWarning(false);
    setSubmitWarning(false);
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    if (visitedVenues.size === 0) {
      setSubmitWarning(true);
      return;
    }
    setSubmitWarning(false);
    setSubmitStatus("submitting");
    setSubmitError(null);

    const venues: Record<string, VenueSubmission> = {};
    for (const category of selectedCategories) {
      for (const venue of category.venues) {
        const vid = venueId(category.id, venue.name);
        if (!visitedVenues.has(vid)) continue;
        const rating = ratings[vid];
        if (!rating) continue;
        venues[venue.name] = {
          category: category.name,
          visit_type: rating.visitType,
          last_visited: rating.lastVisited,
          score: rating.score,
          best_for: Array.from(rating.bestFor).join(", "),
          recommend: rating.recommend,
          tip: rating.tip,
        };
      }
    }

    const suggested_additions: Record<string, string> = {};
    for (const category of selectedCategories) {
      const text = suggestions[category.id]?.trim();
      if (text) suggested_additions[category.name] = text;
    }

    const payload: ExpertsSurveyPayload = {
      submitted_at: new Date().toISOString(),
      name: name.trim(),
      handle: handle.trim(),
      content_focus: Array.from(focus).join(", "),
      venues_visited_estimate: countEstimate,
      venues,
      suggested_additions,
    };

    try {
      const res = await fetch("/api/experts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(body?.message ?? "Something went wrong. Please try again.");
      }
      setSubmitStatus("success");
      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitStatus("error");
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  const respondedVenues = useMemo(() => {
    const rows: { vid: string; name: string; color: string; instagramHandle: string; tip: string; score: number }[] = [];
    for (const category of selectedCategories) {
      for (const venue of category.venues) {
        const vid = venueId(category.id, venue.name);
        if (!visitedVenues.has(vid)) continue;
        const rating = ratings[vid];
        if (!rating) continue;
        rows.push({ vid, name: venue.name, color: category.color, instagramHandle: venue.instagramHandle, tip: rating.tip, score: rating.score });
      }
    }
    return rows;
  }, [selectedCategories, visitedVenues, ratings]);

  return (
    <div className="mx-auto max-w-2xl px-5 pb-16 pt-24">
      <div className="mb-9 flex items-center justify-between border-b border-cs-border pb-5">
        <div className="flex items-center gap-2.5">
          <CitySpakMark size={28} />
          <span className="font-serif text-xl font-bold text-cs-text">CitySpak</span>
        </div>
        <span className="rounded-full border border-cs-accent/30 bg-cs-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cs-accent">
          Venue Expert Program
        </span>
      </div>

      {step !== 4 && (
        <div className="mb-10 flex gap-1.5">
          {([1, 2, 3] as const).map((n) => (
            <div
              key={n}
              className={`h-[3px] flex-1 rounded-sm transition-colors ${
                n === step ? "bg-cs-accent" : n < step ? "bg-cs-accent/35" : "bg-cs-border"
              }`}
            />
          ))}
        </div>
      )}

      {step === 1 && (
        <div>
          <p className="mb-3.5 text-[11px] font-semibold uppercase tracking-wider text-cs-text-muted">
            {STEP_LABELS[1]}
          </p>
          <h1 className="mb-2 font-serif text-3xl font-bold text-cs-text text-balance">Tell us a bit about you.</h1>
          <p className="mb-9 text-sm text-cs-text-muted">Quick intro before we get into the venues.</p>

          <div className="mb-7">
            <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wide text-cs-text-muted">
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-lg border border-cs-border bg-cs-surface px-4 py-3 text-sm text-cs-text outline-none transition-colors focus:border-cs-accent"
            />
          </div>

          <div className="mb-7">
            <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wide text-cs-text-muted">
              Instagram or TikTok handle
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@yourhandle"
              className="w-full rounded-lg border border-cs-border bg-cs-surface px-4 py-3 text-sm text-cs-text outline-none transition-colors focus:border-cs-accent"
            />
          </div>

          <div className="mb-7">
            <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wide text-cs-text-muted">
              Content focus <span className="font-normal normal-case tracking-normal">(select all that apply)</span>
            </label>
            <ChipGroup options={FOCUS_OPTIONS} selected={focus} onToggle={toggleFocus} />
          </div>

          <div className="mb-7">
            <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wide text-cs-text-muted">
              Roughly how many venues on our list have you visited?
            </label>
            <ChipGroup options={VISIT_COUNT_OPTIONS} value={countEstimate} onSelect={setCountEstimate} />
          </div>

          <div className="flex gap-2.5 py-7 pb-14">
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="rounded-full bg-cs-accent px-7 py-3 text-sm font-semibold text-cs-bg transition-all hover:bg-cs-accent-hover"
            >
              Continue &rarr;
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="mb-3.5 text-[11px] font-semibold uppercase tracking-wider text-cs-text-muted">
            {STEP_LABELS[2]}
          </p>
          <h1 className="mb-2 font-serif text-3xl font-bold text-cs-text text-balance">
            Which categories do you know?
          </h1>
          <p className="mb-9 text-sm text-cs-text-muted">
            Select all that apply. You&apos;ll only see venues from the categories you pick.
          </p>

          <div className="mb-9 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {EXPERT_CATEGORIES.map((cat) => {
              const isOn = selectedCategoryIds.has(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`relative rounded-lg border p-4 text-left transition-colors ${
                    isOn
                      ? "border-cs-accent bg-cs-accent/10"
                      : "border-cs-border bg-cs-surface hover:border-cs-text-subtle hover:bg-cs-surface-elevated"
                  }`}
                >
                  <span className="absolute right-3.5 top-3.5 text-xs font-bold text-cs-accent">{isOn ? "✓" : ""}</span>
                  <div className="mb-1.5 text-lg leading-none">{cat.icon}</div>
                  <div className={`text-sm font-medium leading-snug ${isOn ? "text-cs-accent" : "text-cs-text"}`}>
                    {cat.name}
                  </div>
                  <div className="mt-0.5 text-xs text-cs-text-muted">
                    {cat.venues.length} venue{cat.venues.length !== 1 ? "s" : ""}
                  </div>
                </button>
              );
            })}
          </div>

          {categoryWarning && (
            <p className="mb-3 text-sm text-red-500 dark:text-red-400">
              Please select at least one category you know.
            </p>
          )}

          <div className="flex gap-2.5 py-7 pb-14">
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="rounded-full border border-cs-border px-5 py-3 text-sm font-medium text-cs-text-muted transition-colors hover:border-cs-text-subtle hover:text-cs-text"
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={() => goToStep(3)}
              className="rounded-full bg-cs-accent px-7 py-3 text-sm font-semibold text-cs-bg transition-all hover:bg-cs-accent-hover"
            >
              Continue &rarr;
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="mb-3.5 text-[11px] font-semibold uppercase tracking-wider text-cs-text-muted">
            {STEP_LABELS[3]}
          </p>
          <h1 className="mb-2 font-serif text-3xl font-bold text-cs-text text-balance">Rate the venues you know.</h1>
          <p className="mb-9 text-sm text-cs-text-muted">
            Tap &quot;Been here&quot; on places you&apos;ve visited. Leave the rest, we don&apos;t need guesses.
          </p>

          <div className="mb-7 rounded-lg border border-cs-border bg-cs-surface p-4 text-sm leading-relaxed text-cs-text-muted">
            <b className="font-medium text-cs-text">The insider tip is the most important field.</b> Write it like
            you&apos;re texting a friend going tomorrow: the specific dish, the right table, when to go, what nobody
            tells you online.
          </div>

          {selectedCategories.map((cat) => (
            <div key={cat.id} className="mb-11">
              <div className="mb-0.5 flex items-baseline gap-2.5 border-b border-cs-border pb-3">
                <span className="font-serif text-lg font-semibold text-cs-text">{cat.name}</span>
                <span className="text-xs text-cs-text-muted">{cat.venues.length} venues</span>
              </div>

              {cat.venues.map((venue) => {
                const vid = venueId(cat.id, venue.name);
                return (
                  <VenueRow
                    key={vid}
                    venue={venue}
                    categoryColor={cat.color}
                    visited={visitedVenues.has(vid)}
                    rating={ratings[vid]}
                    onToggleVisited={() => toggleVisited(vid)}
                    onChangeRating={(patch) => patchRating(vid, patch)}
                    onToggleBestFor={(option) => toggleBestFor(vid, option)}
                  />
                );
              })}

              <div className="mt-4">
                <label className="mb-2 block text-xs font-medium text-cs-text-muted">
                  Any {cat.name} spots you&apos;d recommend that aren&apos;t on this list?
                </label>
                <textarea
                  value={suggestions[cat.id] ?? ""}
                  onChange={(e) => setSuggestions((prev) => ({ ...prev, [cat.id]: e.target.value }))}
                  placeholder="Venue name, neighbourhood, and why it belongs on the list…"
                  className="min-h-[64px] w-full resize-y rounded-lg border border-dashed border-cs-border bg-transparent px-3.5 py-3 text-sm text-cs-text placeholder:italic placeholder:text-cs-text-subtle outline-none transition-colors focus:border-cs-accent"
                />
              </div>
            </div>
          ))}

          {submitWarning && (
            <p className="mb-3 text-sm text-red-500 dark:text-red-400">
              Mark at least one venue as visited before submitting.
            </p>
          )}
          {submitStatus === "error" && submitError && (
            <p className="mb-3 text-sm text-red-500 dark:text-red-400">{submitError}</p>
          )}

          <div className="flex gap-2.5 py-7 pb-14">
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="rounded-full border border-cs-border px-5 py-3 text-sm font-medium text-cs-text-muted transition-colors hover:border-cs-text-subtle hover:text-cs-text"
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitStatus === "submitting"}
              className="rounded-full bg-cs-accent px-7 py-3 text-sm font-semibold text-cs-bg transition-all hover:bg-cs-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitStatus === "submitting" ? "Submitting…" : "Submit responses"}
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <div className="pb-14 pt-16 text-center">
            <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-cs-accent/30 bg-cs-accent/10 text-xl text-cs-accent">
              ✓
            </div>
            <h1 className="mb-3 font-serif text-4xl font-bold text-cs-text">Thank you.</h1>
            <p className="mx-auto mb-2.5 max-w-sm text-sm text-cs-text-muted">
              Your knowledge is part of how CitySpak curates the city now.
            </p>
            <p className="text-sm text-cs-text-subtle">We&apos;ll be in touch when early access opens.</p>
          </div>

          {respondedVenues.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-cs-border bg-cs-surface text-left">
              <div className="border-b border-cs-border px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-cs-text-muted">
                Your responses <span className="normal-case tracking-normal text-cs-text-subtle">
                  ({respondedVenues.length} venue{respondedVenues.length !== 1 ? "s" : ""})
                </span>
              </div>
              <div className="max-h-[280px] overflow-y-auto py-1.5">
                {respondedVenues.map((row) => (
                  <div key={row.vid} className="flex items-center gap-2.5 border-b border-cs-border px-5 py-2.5 last:border-b-0">
                    <VenueAvatar name={row.name} instagramHandle={row.instagramHandle} color={row.color} size={30} dim={false} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-cs-text">{row.name}</div>
                      {row.tip && <div className="truncate text-xs text-cs-text-muted">{row.tip}</div>}
                    </div>
                    <div className="flex flex-shrink-0 gap-px">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span key={n} className={`text-[11px] ${n <= row.score ? "text-cs-accent" : "text-cs-border"}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
