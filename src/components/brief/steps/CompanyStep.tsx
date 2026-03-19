"use client";

import { useTranslations } from "next-intl";
import TextInput from "@/components/brief/ui/TextInput";
import TextArea from "@/components/brief/ui/TextArea";
import SingleSelect from "@/components/brief/ui/SingleSelect";
import type { BriefCompany } from "@/data/briefTypes";
import { LIMITS } from "@/data/briefTypes";

interface CompanyStepProps {
  data: BriefCompany;
  onChange: (data: BriefCompany) => void;
  errors: Record<string, string>;
}

export default function CompanyStep({ data, onChange, errors }: CompanyStepProps) {
  const t = useTranslations("brief");

  const update = (field: keyof BriefCompany, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  const hasWebsiteLabels: Record<string, string> = {
    yes: t("steps.company.questions.hasWebsite.yes"),
    no: t("steps.company.questions.hasWebsite.no"),
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          {t("steps.company.title")}
        </h2>
        <p className="text-[var(--foreground-secondary)]">
          {t("steps.company.subtitle")}
        </p>
      </div>

      <div className="space-y-8">
        {/* Company name */}
        <TextInput
          id="company-name"
          label={t("steps.company.questions.name.label")}
          value={data.name}
          onChange={(v) => update("name", v)}
          placeholder={t("steps.company.questions.name.placeholder")}
          maxLength={LIMITS.name}
          required
          error={errors.name}
        />

        {/* Activity description */}
        <TextArea
          id="company-description"
          label={t("steps.company.questions.description.label")}
          value={data.description}
          onChange={(v) => update("description", v)}
          placeholder={t("steps.company.questions.description.placeholder")}
          maxLength={LIMITS.description}
          required
          error={errors.description}
        />

        {/* Target audience */}
        <TextArea
          id="company-target"
          label={t("steps.company.questions.target.label")}
          value={data.target}
          onChange={(v) => update("target", v)}
          placeholder={t("steps.company.questions.target.placeholder")}
          maxLength={LIMITS.target}
          required
          error={errors.target}
        />

        {/* Has existing website? */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            {t("steps.company.questions.hasWebsite.label")}
            <span className="text-[var(--accent)] ml-1">*</span>
          </label>
          <SingleSelect
            id="company-has-website"
            options={["yes", "no"]}
            selected={data.hasWebsite === true ? "yes" : data.hasWebsite === false ? "no" : null}
            onChange={(v) => {
              const hasWebsite = v === "yes";
              onChange({
                ...data,
                hasWebsite,
                websiteUrl: hasWebsite ? data.websiteUrl : "",
              });
            }}
            labels={hasWebsiteLabels}
          />

          {/* Website URL (shown when hasWebsite is true) */}
          {data.hasWebsite && (
            <div className="animate-fade-in">
              <TextInput
                id="company-website-url"
                label={t("steps.company.questions.websiteUrl.label")}
                value={data.websiteUrl ?? ""}
                onChange={(v) => update("websiteUrl", v)}
                placeholder={t("steps.company.questions.websiteUrl.placeholder")}
                maxLength={200}
                error={errors.websiteUrl}
              />
            </div>
          )}
        </div>

        {/* Inspiration sites */}
        <TextArea
          id="company-inspirations"
          label={t("steps.company.questions.inspirations.label")}
          value={data.inspirations ?? ""}
          onChange={(v) => update("inspirations", v)}
          placeholder={t("steps.company.questions.inspirations.placeholder")}
          maxLength={LIMITS.inspirations}
          error={errors.inspirations}
        />
      </div>
    </div>
  );
}
