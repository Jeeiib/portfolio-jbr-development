"use client";

import { useTranslations } from "next-intl";

interface StepIndicatorProps {
  steps: { number: number; title: string }[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const t = useTranslations("brief.ui");
  return (
    <nav aria-label="Progress" className="w-full">
      {/* Progress bar background */}
      <div className="relative mb-6">
        <div className="h-1 bg-[var(--border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${steps.length <= 1 ? 0 : ((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Steps */}
      <ol className="flex items-start justify-between gap-1">
        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isUpcoming = step.number > currentStep;

          return (
            <li
              key={step.number}
              className="flex flex-col items-center flex-1 min-w-0"
              aria-current={isCurrent ? "step" : undefined}
            >
              {/* Step circle */}
              <div
                className={`
                  flex items-center justify-center
                  w-8 h-8 rounded-full text-xs font-bold
                  transition-all duration-300
                  ${isCompleted
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-sm shadow-[var(--accent)]/25"
                    : isCurrent
                      ? "bg-[var(--accent)] text-[var(--accent-foreground)] ring-4 ring-[var(--accent)]/20 shadow-sm shadow-[var(--accent)]/25 scale-110"
                      : "bg-[var(--background-secondary)] text-[var(--foreground-secondary)]/50 border border-[var(--border)]"
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>

              {/* Step title - hidden on mobile, visible on desktop */}
              <span
                className={`
                  hidden md:block mt-2 text-xs text-center leading-tight max-w-[5rem] truncate
                  transition-colors duration-200
                  ${isCompleted
                    ? "text-[var(--accent)]"
                    : isCurrent
                      ? "text-[var(--foreground)] font-medium"
                      : "text-[var(--foreground-secondary)]/50"
                  }
                `}
                title={step.title}
              >
                {step.title}
              </span>

              {/* Accessible label for screen readers */}
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
