"use client";

import { useTranslations } from "next-intl";
import SingleSelect from "@/components/brief/ui/SingleSelect";
import ChipSelect from "@/components/brief/ui/ChipSelect";
import { budgetRanges, deadlineOptions, communicationOptions } from "@/data/briefQuestions";
import type { BriefBudget } from "@/data/briefTypes";

interface BudgetStepProps {
  data: BriefBudget;
  onChange: (data: BriefBudget) => void;
  errors: Record<string, string>;
}

export default function BudgetStep({ data, onChange, errors }: BudgetStepProps) {
  const t = useTranslations("brief");

  const budgetLabels: Record<string, string> = {};
  for (const key of budgetRanges) {
    budgetLabels[key] = t(`steps.budget.questions.range.options.${key}`);
  }

  const deadlineLabels: Record<string, string> = {};
  for (const key of deadlineOptions) {
    deadlineLabels[key] = t(`steps.budget.questions.deadline.options.${key}`);
  }

  const commLabels: Record<string, string> = {};
  for (const key of communicationOptions) {
    commLabels[key] = t(`steps.budget.questions.communication.options.${key}`);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          {t("steps.budget.title")}
        </h2>
        <p className="text-[var(--foreground-secondary)]">
          {t("steps.budget.subtitle")}
        </p>
      </div>

      <div className="space-y-8">
        {/* Budget range */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            {t("steps.budget.questions.range.label")}
            <span className="text-[var(--accent)] ml-1">*</span>
          </label>
          {t.has("steps.budget.questions.range.hint") && (
            <p className="text-xs text-[var(--foreground-secondary)]/70">
              {t("steps.budget.questions.range.hint")}
            </p>
          )}
          <SingleSelect
            id="budget-range"
            options={[...budgetRanges]}
            selected={data.range || null}
            onChange={(v) => onChange({ ...data, range: v })}
            labels={budgetLabels}
          />
          {errors.range && (
            <p role="alert" className="text-sm text-red-400/90">
              {errors.range}
            </p>
          )}
        </div>

        {/* Deadline */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            {t("steps.budget.questions.deadline.label")}
            <span className="text-[var(--accent)] ml-1">*</span>
          </label>
          <SingleSelect
            id="budget-deadline"
            options={[...deadlineOptions]}
            selected={data.deadline || null}
            onChange={(v) => onChange({ ...data, deadline: v })}
            labels={deadlineLabels}
          />
          {errors.deadline && (
            <p role="alert" className="text-sm text-red-400/90">
              {errors.deadline}
            </p>
          )}
        </div>

        {/* Communication preference */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            {t("steps.budget.questions.communication.label")}
            <span className="text-[var(--accent)] ml-1">*</span>
          </label>
          {t.has("steps.budget.questions.communication.hint") && (
            <p className="text-xs text-[var(--foreground-secondary)]/70">
              {t("steps.budget.questions.communication.hint")}
            </p>
          )}
          <ChipSelect
            id="budget-communication"
            options={[...communicationOptions]}
            selected={data.communicationPreference}
            onChange={(communicationPreference) =>
              onChange({ ...data, communicationPreference })
            }
            labels={commLabels}
          />
          {errors.communicationPreference && (
            <p role="alert" className="text-sm text-red-400/90">
              {errors.communicationPreference}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
