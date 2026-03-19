"use client";

interface SingleSelectProps {
  options: string[];
  selected: string | null;
  onChange: (value: string) => void;
  labels: Record<string, string>;
  id: string;
}

export default function SingleSelect({
  options,
  selected,
  onChange,
  labels,
  id,
}: SingleSelectProps) {
  return (
    <div id={id} className="flex flex-wrap gap-2" role="group" aria-label={id}>
      {options.map((option) => {
        const isSelected = selected === option;

        return (
          <button
            key={option}
            type="button"
            role="button"
            aria-pressed={isSelected}
            onClick={() => onChange(option)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium
              border transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:ring-offset-1 focus:ring-offset-[var(--background)]
              ${isSelected
                ? "bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--accent)] scale-[1.02] shadow-sm shadow-[var(--accent)]/20"
                : "bg-[var(--background-secondary)] text-[var(--foreground-secondary)] border-[var(--border)] hover:border-[var(--accent)]/50 hover:text-[var(--foreground)] active:scale-[0.98]"
              }
            `}
          >
            {labels[option] ?? option}
          </button>
        );
      })}
    </div>
  );
}
