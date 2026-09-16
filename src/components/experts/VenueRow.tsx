import { ChipGroup } from "./ChipGroup";
import { VenueAvatar } from "./VenueAvatar";
import { BEST_FOR_OPTIONS, LAST_VISITED_OPTIONS, RECOMMEND_OPTIONS, VISIT_TYPE_OPTIONS } from "@/lib/experts-data";
import type { VenueEntry } from "@/lib/experts-data";
import type { VenueRatingState } from "@/lib/experts-types";

interface VenueRowProps {
  venue: VenueEntry;
  categoryColor: string;
  visited: boolean;
  rating: VenueRatingState | undefined;
  /** True after a failed submit attempt, so this row can flag its own
   * missing required fields (everything except the tip). */
  showIncompleteWarning: boolean;
  onToggleVisited: () => void;
  onChangeRating: (patch: Partial<VenueRatingState>) => void;
  onToggleBestFor: (option: string) => void;
}

const starClass = "cursor-pointer select-none text-2xl leading-none transition-transform hover:scale-110";
const fieldWarningClass = "mt-1.5 text-xs text-red-500 dark:text-red-400";

export function VenueRow({
  venue,
  categoryColor,
  visited,
  rating,
  showIncompleteWarning,
  onToggleVisited,
  onChangeRating,
  onToggleBestFor,
}: VenueRowProps) {
  return (
    <div className="border-b border-cs-border">
      <div className="flex items-center gap-2.5 py-2.5">
        <VenueAvatar name={venue.name} instagramHandle={venue.instagramHandle} color={categoryColor} dim={!visited} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-cs-text">{venue.name}</div>
          <div className="mt-0.5 text-xs text-cs-text-muted">{venue.location}</div>
          {venue.closed && <div className="mt-0.5 text-xs text-red-500 dark:text-red-400">Temporarily closed</div>}
        </div>
        <button
          type="button"
          onClick={onToggleVisited}
          className={`flex-shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
            visited
              ? "border-cs-accent bg-cs-accent/10 text-cs-accent"
              : "border-cs-border bg-transparent text-cs-text-muted hover:border-cs-text-subtle hover:text-cs-text"
          }`}
        >
          Been here
        </button>
      </div>

      {visited && rating && (
        <div className="pb-[18px]">
          <div className="mb-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-cs-text-muted">
              Visit type
            </div>
            <ChipGroup
              options={VISIT_TYPE_OPTIONS}
              value={rating.visitType}
              onSelect={(option) => onChangeRating({ visitType: option })}
              size="sm"
            />
            {showIncompleteWarning && !rating.visitType && <p className={fieldWarningClass}>Required.</p>}
          </div>

          <div className="mb-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-cs-text-muted">
              When did you last visit?
            </div>
            <ChipGroup
              options={LAST_VISITED_OPTIONS}
              value={rating.lastVisited}
              onSelect={(option) => onChangeRating({ lastVisited: option })}
              size="sm"
            />
            {showIncompleteWarning && !rating.lastVisited && <p className={fieldWarningClass}>Required.</p>}
          </div>

          <div className="mb-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-cs-text-muted">
              Overall score
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  role="button"
                  tabIndex={0}
                  aria-label={`${n} star${n === 1 ? "" : "s"}`}
                  onClick={() => onChangeRating({ score: n })}
                  onKeyDown={(e) => e.key === "Enter" && onChangeRating({ score: n })}
                  className={`${starClass} ${n <= rating.score ? "text-cs-accent" : "text-cs-border"}`}
                >
                  ★
                </span>
              ))}
            </div>
            {showIncompleteWarning && rating.score === 0 && <p className={fieldWarningClass}>Required.</p>}
          </div>

          <div className="mb-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-cs-text-muted">
              Best for <span className="font-normal normal-case tracking-normal text-cs-text-subtle">(all that apply)</span>
            </div>
            <ChipGroup options={BEST_FOR_OPTIONS} selected={rating.bestFor} onToggle={onToggleBestFor} size="sm" />
            {showIncompleteWarning && rating.bestFor.size === 0 && <p className={fieldWarningClass}>Select at least one.</p>}
          </div>

          <div className="mb-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-cs-text-muted">
              Would you recommend to a close friend?
            </div>
            <ChipGroup
              options={RECOMMEND_OPTIONS}
              value={rating.recommend}
              onSelect={(option) => onChangeRating({ recommend: option })}
              size="sm"
            />
            {showIncompleteWarning && !rating.recommend && <p className={fieldWarningClass}>Required.</p>}
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-cs-text-muted">
              Insider tip <span className="font-normal normal-case tracking-normal text-cs-text-subtle">(optional)</span>
            </div>
            <textarea
              value={rating.tip}
              onChange={(e) => onChangeRating({ tip: e.target.value })}
              placeholder="Write like you're texting a friend going tomorrow…"
              className="min-h-[88px] w-full resize-y rounded-lg border border-cs-border bg-cs-surface px-3.5 py-3 text-sm text-cs-text placeholder:italic placeholder:text-cs-text-subtle outline-none transition-colors focus:border-cs-accent"
            />
          </div>
        </div>
      )}
    </div>
  );
}
