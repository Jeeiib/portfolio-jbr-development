"use client";

import { useTranslations } from "next-intl";
import ChipSelect from "@/components/brief/ui/ChipSelect";
import TextArea from "@/components/brief/ui/TextArea";
import { objectiveOptions } from "@/data/briefQuestions";
import type { BriefGoals } from "@/data/briefTypes";
import { LIMITS } from "@/data/briefTypes";

interface GoalsStepProps {
  data: BriefGoals;
  onChange: (data: BriefGoals) => void;
  errors: Record<string, string>;
}

export default function GoalsStep({ data, onChange, errors }: GoalsStepProps) {
  const t = useTranslations("brief");

  const objectiveLabels: Record<string, string> = {};
  for (const key of objectiveOptions) {
    objectiveLabels[key] = t(`steps.goals.options.${key}`);
  }
  objectiveLabels["autre"] = t("ui.other");

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          {t("steps.goals.title")}
        </h2>
        <p className="text-[var(--foreground-secondary)]">
          {t("steps.goals.subtitle")}
        </p>
      </div>

      <div className="space-y-8">
        {/* Main objectives */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            {t("steps.goals.questions.objectives.label")}
            <span className="text-[var(--accent)] ml-1">*</span>
          </label>
          {t.has("steps.goals.questions.objectives.hint") && (
            <p className="text-xs text-[var(--foreground-secondary)]/70">
              {t("steps.goals.questions.objectives.hint")}
            </p>
          )}
          <ChipSelect
            id="goals-objectives"
            options={[...objectiveOptions]}
            selected={data.objectives}
            onChange={(selected) => onChange({ ...data, objectives: selected })}
            labels={objectiveLabels}
            hasOther
            otherValue={data.objectiveOther ?? ""}
            onOtherChange={(v) => onChange({ ...data, objectiveOther: v })}
          />
          {errors.objectives && (
            <p role="alert" className="text-sm text-red-400/90">
              {errors.objectives}
            </p>
          )}
        </div>

        {/* Problem to solve */}
        <TextArea
          id="goals-problem"
          label={t("steps.goals.questions.problem.label")}
          value={data.problem}
          onChange={(v) => onChange({ ...data, problem: v })}
          placeholder={t("steps.goals.questions.problem.placeholder")}
          maxLength={LIMITS.problem}
          required
          error={errors.problem}
          rows={5}
        />

        {/* Success criteria */}
        <TextArea
          id="goals-success-criteria"
          label={t("steps.goals.questions.successCriteria.label")}
          value={data.successCriteria}
          onChange={(v) => onChange({ ...data, successCriteria: v })}
          placeholder={t("steps.goals.questions.successCriteria.placeholder")}
          maxLength={LIMITS.successCriteria}
          required
          error={errors.successCriteria}
          rows={5}
        />
      </div>
    </div>
  );
}
