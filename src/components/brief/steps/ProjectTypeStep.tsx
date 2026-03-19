"use client";

import { useTranslations } from "next-intl";
import { projectTypeOptions } from "@/data/briefQuestions";
import type { ProjectType } from "@/data/briefTypes";

interface ProjectTypeStepProps {
  selected: ProjectType | null;
  onChange: (type: ProjectType) => void;
}

export default function ProjectTypeStep({ selected, onChange }: ProjectTypeStepProps) {
  const t = useTranslations("brief");

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          {t("steps.projectType.title")}
        </h2>
        <p className="text-[var(--foreground-secondary)]">
          {t("steps.projectType.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {projectTypeOptions.map((option) => {
          const isSelected = selected === option.key;

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(option.key as ProjectType)}
              aria-pressed={isSelected}
              className={`
                relative flex flex-col items-center gap-3 p-6 rounded-xl
                border-2 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:ring-offset-2 focus:ring-offset-[var(--background)]
                cursor-pointer group
                ${isSelected
                  ? "border-[var(--accent)] bg-[var(--accent)]/5 scale-[1.02] shadow-lg shadow-[var(--accent)]/10"
                  : "border-[var(--border)] bg-[var(--background-secondary)] hover:border-[var(--accent)]/50 hover:scale-[1.01] hover:shadow-md"
                }
              `}
            >
              <span className="text-3xl" role="img" aria-hidden="true">
                {option.icon}
              </span>
              <div className="text-center space-y-1">
                <span
                  className={`block text-sm font-semibold transition-colors duration-200 ${
                    isSelected
                      ? "text-[var(--accent)]"
                      : "text-[var(--foreground)] group-hover:text-[var(--accent)]"
                  }`}
                >
                  {t(`steps.projectType.options.${option.key}.title`)}
                </span>
                <span className="block text-xs text-[var(--foreground-secondary)] leading-relaxed">
                  {t(`steps.projectType.options.${option.key}.description`)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
