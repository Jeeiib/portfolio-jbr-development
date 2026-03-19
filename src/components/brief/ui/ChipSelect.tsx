"use client";

import { useState } from "react";

interface ChipSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  max?: number;
  labels: Record<string, string>;
  hasOther?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
  id: string;
}

export default function ChipSelect({
  options,
  selected,
  onChange,
  max,
  labels,
  hasOther = false,
  otherValue = "",
  onOtherChange,
  id,
}: ChipSelectProps) {
  const [otherSelected, setOtherSelected] = useState(
    hasOther && selected.includes("autre")
  );
  const isMaxReached = max !== undefined && selected.length >= max;

  const handleToggle = (option: string) => {
    if (option === "autre") {
      if (otherSelected) {
        setOtherSelected(false);
        onChange(selected.filter((s) => s !== "autre"));
        onOtherChange?.("");
      } else {
        if (isMaxReached) return;
        setOtherSelected(true);
        onChange([...selected, "autre"]);
      }
      return;
    }

    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      if (isMaxReached) return;
      onChange([...selected, option]);
    }
  };

  return (
    <div id={id} className="space-y-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label={id}>
        {options.map((option) => {
          const isSelected = selected.includes(option);
          const isDisabled = !isSelected && isMaxReached;

          return (
            <button
              key={option}
              type="button"
              role="button"
              aria-pressed={isSelected}
              disabled={isDisabled}
              onClick={() => handleToggle(option)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium
                border transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:ring-offset-1 focus:ring-offset-[var(--background)]
                ${isSelected
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--accent)] scale-[1.02] shadow-sm shadow-[var(--accent)]/20"
                  : isDisabled
                    ? "bg-[var(--background-secondary)] text-[var(--foreground-secondary)]/40 border-[var(--border)]/50 cursor-not-allowed"
                    : "bg-[var(--background-secondary)] text-[var(--foreground-secondary)] border-[var(--border)] hover:border-[var(--accent)]/50 hover:text-[var(--foreground)] active:scale-[0.98]"
                }
              `}
            >
              {labels[option] ?? option}
            </button>
          );
        })}

        {hasOther && (
          <button
            type="button"
            role="button"
            aria-pressed={otherSelected}
            disabled={!otherSelected && isMaxReached}
            onClick={() => handleToggle("autre")}
            className={`
              px-4 py-2 rounded-full text-sm font-medium
              border transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:ring-offset-1 focus:ring-offset-[var(--background)]
              ${otherSelected
                ? "bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--accent)] scale-[1.02] shadow-sm shadow-[var(--accent)]/20"
                : !otherSelected && isMaxReached
                  ? "bg-[var(--background-secondary)] text-[var(--foreground-secondary)]/40 border-[var(--border)]/50 cursor-not-allowed"
                  : "bg-[var(--background-secondary)] text-[var(--foreground-secondary)] border-[var(--border)] hover:border-[var(--accent)]/50 hover:text-[var(--foreground)] active:scale-[0.98]"
              }
            `}
          >
            {labels["autre"] ?? "Autre"}
          </button>
        )}
      </div>

      {/* "Autre" text input - revealed when Autre chip is selected */}
      {hasOther && otherSelected && (
        <div className="animate-fade-in">
          <input
            type="text"
            value={otherValue}
            onChange={(e) => onOtherChange?.(e.target.value)}
            placeholder={labels["autrePlaceholder"] ?? "Precisez..."}
            aria-label={labels["autreLabel"] ?? "Autre - precisez"}
            className="
              w-full px-4 py-3 rounded-lg
              bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)]
              placeholder:text-[var(--foreground-secondary)]/50
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)]
              hover:border-[var(--foreground-secondary)]/30
            "
          />
        </div>
      )}

      {/* Max selection hint */}
      {max !== undefined && (
        <p className="text-xs text-[var(--foreground-secondary)]/60">
          {selected.length}/{max} {selected.length >= max ? "(maximum atteint)" : ""}
        </p>
      )}
    </div>
  );
}
