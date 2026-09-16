interface ChipGroupProps {
  options: string[];
  /** Single-select passes the current value + a setter; multi-select passes
   * the selected Set + a toggle callback. Exactly one pair should be given. */
  value?: string;
  onSelect?: (option: string) => void;
  selected?: Set<string>;
  onToggle?: (option: string) => void;
  size?: "md" | "sm";
}

/** Pill chip row, reused for every single/multi choice field in the survey
 * (content focus, visit count, visit type, best-for, recommend). Replaces
 * the prototype's .chip/.rc CSS classes with cs-* tokens. */
export function ChipGroup({ options, value, onSelect, selected, onToggle, size = "md" }: ChipGroupProps) {
  const padding = size === "sm" ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-sm";

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isOn = onSelect ? value === option : Boolean(selected?.has(option));
        return (
          <button
            key={option}
            type="button"
            onClick={() => (onSelect ? onSelect(option) : onToggle?.(option))}
            className={`rounded-full border font-medium transition-colors ${padding} ${
              isOn
                ? "border-cs-accent bg-cs-accent/10 text-cs-accent"
                : "border-cs-border bg-cs-surface text-cs-text-muted hover:border-cs-text-subtle hover:text-cs-text"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
