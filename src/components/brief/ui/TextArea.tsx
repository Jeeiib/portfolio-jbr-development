"use client";

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength: number;
  required?: boolean;
  error?: string;
  id: string;
  rows?: number;
}

export default function TextArea({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  required,
  error,
  id,
  rows = 4,
}: TextAreaProps) {
  const errorId = `${id}-error`;
  const countId = `${id}-count`;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-[var(--foreground)]">
        {label}
        {required && <span className="text-[var(--accent)] ml-1">*</span>}
      </label>

      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        rows={rows}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`
          w-full px-4 py-3 rounded-lg resize-none
          bg-[var(--background)] border text-[var(--foreground)]
          placeholder:text-[var(--foreground-secondary)]/50
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)]
          ${error
            ? "border-red-400/70 focus:ring-red-400/30 focus:border-red-400/70"
            : "border-[var(--border)] hover:border-[var(--foreground-secondary)]/30"
          }
        `}
      />

      <div className="flex items-center justify-between min-h-[1.25rem]">
        {error ? (
          <p id={errorId} role="alert" className="text-sm text-red-400/90">
            {error}
          </p>
        ) : (
          <span />
        )}
        <span
          id={countId}
          className={`text-xs tabular-nums transition-colors duration-200 ${
            value.length >= maxLength
              ? "text-red-400/90"
              : value.length >= maxLength * 0.9
                ? "text-yellow-400/70"
                : "text-[var(--foreground-secondary)]/50"
          }`}
        >
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}
