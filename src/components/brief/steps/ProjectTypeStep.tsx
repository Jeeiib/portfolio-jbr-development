"use client";

import { useTranslations } from "next-intl";
import { projectTypeOptions } from "@/data/briefQuestions";
import type { ProjectType } from "@/data/briefTypes";

interface ProjectTypeStepProps {
  selected: ProjectType | null;
  onChange: (type: ProjectType) => void;
}

// SVG icons for each project type — clean, consistent stroke style
const projectTypeIcons: Record<string, React.ReactNode> = {
  "site-vitrine": (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9 9 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  ),
  "application-web": (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
    </svg>
  ),
  "application-mobile": (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  ),
  "landing-page": (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  "refonte": (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" />
    </svg>
  ),
  "developpement-sur-mesure": (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  "maintenance": (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
    </svg>
  ),
};

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
              <div
                className={`transition-colors duration-200 ${
                  isSelected
                    ? "text-[var(--accent)]"
                    : "text-[var(--foreground-secondary)] group-hover:text-[var(--accent)]"
                }`}
                aria-hidden="true"
              >
                {projectTypeIcons[option.key]}
              </div>
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
