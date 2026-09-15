/** Per-venue rating state while the wizard is open. Mirrors the prototype's
 * S.venues[vid] shape, `bestFor` stays a Set client-side for cheap toggling,
 * joined to a comma-separated string only when building the submit payload. */
export interface VenueRatingState {
  visitType: string;
  lastVisited: string;
  score: number;
  bestFor: Set<string>;
  recommend: string;
  tip: string;
}

/** One venue entry inside the submit payload's `venues` map. */
export interface VenueSubmission {
  category: string;
  visit_type: string;
  last_visited: string;
  score: number;
  best_for: string;
  recommend: string;
  tip: string;
}

/** The exact POST body shape, per the brief's payload spec. Field names and
 * casing (snake_case) are kept as specified, not camelCased, since a
 * downstream webhook/sheet may already expect them this way. */
export interface ExpertsSurveyPayload {
  submitted_at: string;
  name: string;
  handle: string;
  content_focus: string;
  venues_visited_estimate: string;
  venues: Record<string, VenueSubmission>;
  suggested_additions: Record<string, string>;
}
