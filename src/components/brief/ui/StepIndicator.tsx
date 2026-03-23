"use client";

import { useTranslations } from "next-intl";

interface StepIndicatorProps {
  steps: { number: number; title: string }[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const t = useTranslations("brief.ui");

  const progressPercent = steps.length <= 1
    ? 0
    : ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <nav aria-label="Progress" className="w-full">
      {/* Progress bar */}
      <div className="relative mb-8">
        <div className="h-0.5 bg-[var(--border)]/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <ol className="flex items-start justify-between gap-1">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <li
              key={step.number}
              className="flex flex-col items-center flex-1 min-w-0"
              aria-current={isCurrent ? "step" : undefined}
            >
              {/* Step dot/circle */}
              <div
                className={`
                  flex items-center justify-center
                  transition-all duration-500
                  ${isCompleted
                    ? "w-7 h-7 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]"
                    : isCurrent
                      ? "w-9 h-9 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] ring-[3px] ring-[var(--accent)]/15"
                      : "w-7 h-7 rounded-full bg-[var(--background-secondary)] text-[var(--foreground-secondary)]/40 border border-[var(--border)]/60"
                  }
                `}
                style={{
                  transitionDelay: `${index * 30}ms`,
                }}
              >
                {isCompleted ? (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={`text-xs font-semibold ${isCurrent ? "text-sm" : ""}`}>
                    {step.number}
                  </span>
                )}
              </div>

              {/* Step title — desktop only */}
              <span
                className={`
                  hidden md:block mt-2.5 text-[0.65rem] text-center leading-tight
                  max-w-[5.5rem] truncate tracking-wide uppercase
                  transition-all duration-300
                  ${isCompleted
                    ? "text-[var(--accent)]/80"
                    : isCurrent
                      ? "text-[var(--foreground)] font-semibold"
                      : "text-[var(--foreground-secondary)]/30"
                  }
                `}
                title={step.title}
              >
                {step.title}
              </span>

              {/* Screen reader label */}
              <span className="sr-only">
                {isCompleted
                  ? `${step.title} - ${t("stepCompleted")}`
                  : isCurrent
                    ? `${step.title} - ${t("stepCurrent")}`
                    : `${step.title} - ${t("stepUpcoming")}`}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
