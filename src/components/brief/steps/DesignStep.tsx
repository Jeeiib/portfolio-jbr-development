"use client";

import { useTranslations } from "next-intl";
import SingleSelect from "@/components/brief/ui/SingleSelect";
import ChipSelect from "@/components/brief/ui/ChipSelect";
import TextArea from "@/components/brief/ui/TextArea";
import FileUpload from "@/components/brief/ui/FileUpload";
import { identityOptions, ambianceOptions } from "@/data/briefQuestions";
import type { BriefDesign, BriefFile } from "@/data/briefTypes";
import { LIMITS } from "@/data/briefTypes";

interface DesignStepProps {
  data: BriefDesign | null;
  onChange: (data: BriefDesign) => void;
  errors: Record<string, string>;
}

const defaultDesign: BriefDesign = {
  existingIdentity: "",
  ambiance: [],
  colorPreferences: "",
  designInspirations: "",
  files: [],
};

export default function DesignStep({ data, onChange, errors }: DesignStepProps) {
  const t = useTranslations("brief");
  const d = data ?? defaultDesign;

  const identityLabels: Record<string, string> = {};
  for (const key of identityOptions) {
    identityLabels[key] = t(`steps.design.questions.existingIdentity.options.${key}`);
  }

  const ambianceLabels: Record<string, string> = {};
  for (const key of ambianceOptions) {
    ambianceLabels[key] = t(`steps.design.questions.ambiance.options.${key}`);
  }

  const showFileUpload =
    d.existingIdentity === "logo-and-brand" || d.existingIdentity === "logo-only";

  const handleFileUpload = (file: BriefFile) => {
    onChange({ ...d, files: [...d.files, file] });
  };

  const handleFileRemove = (url: string) => {
    onChange({ ...d, files: d.files.filter((f) => f.url !== url) });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          {t("steps.design.title")}
        </h2>
        <p className="text-[var(--foreground-secondary)]">
          {t("steps.design.subtitle")}
        </p>
      </div>

      <div className="space-y-8">
        {/* Existing identity */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            {t("steps.design.questions.existingIdentity.label")}
            <span className="text-[var(--accent)] ml-1">*</span>
          </label>
          {t.has("steps.design.questions.existingIdentity.hint") && (
            <p className="text-xs text-[var(--foreground-secondary)]/70">
              {t("steps.design.questions.existingIdentity.hint")}
            </p>
          )}
          <SingleSelect
            id="design-identity"
            options={[...identityOptions]}
            selected={d.existingIdentity || null}
            onChange={(v) => onChange({ ...d, existingIdentity: v })}
            labels={identityLabels}
          />
          {errors.existingIdentity && (
            <p role="alert" className="text-sm text-red-400/90">
              {errors.existingIdentity}
            </p>
          )}

          {/* File upload (shown when logo or brand exists) */}
          {showFileUpload && (
            <div className="animate-fade-in space-y-3">
              <label className="block text-sm font-medium text-[var(--foreground)]">
                {t("steps.design.questions.filesUpload.label")}
              </label>
              {t.has("steps.design.questions.filesUpload.hint") && (
                <p className="text-xs text-[var(--foreground-secondary)]/70">
                  {t("steps.design.questions.filesUpload.hint")}
                </p>
              )}
              <FileUpload
                files={d.files}
                onUpload={handleFileUpload}
                onRemove={handleFileRemove}
                maxFiles={LIMITS.fileMaxCount}
              />
            </div>
          )}
        </div>

        {/* Ambiance */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            {t("steps.design.questions.ambiance.label")}
            <span className="text-[var(--accent)] ml-1">*</span>
          </label>
          {t.has("steps.design.questions.ambiance.hint") && (
            <p className="text-xs text-[var(--foreground-secondary)]/70">
              {t("steps.design.questions.ambiance.hint")}
            </p>
          )}
          <ChipSelect
            id="design-ambiance"
            options={[...ambianceOptions]}
            selected={d.ambiance}
            onChange={(ambiance) => onChange({ ...d, ambiance })}
            labels={ambianceLabels}
            max={LIMITS.ambianceMax}
          />
          {errors.ambiance && (
            <p role="alert" className="text-sm text-red-400/90">
              {errors.ambiance}
            </p>
          )}
        </div>

        {/* Color preferences */}
        <TextArea
          id="design-colors"
          label={t("steps.design.questions.colorPreferences.label")}
          value={d.colorPreferences ?? ""}
          onChange={(v) => onChange({ ...d, colorPreferences: v })}
          placeholder={t("steps.design.questions.colorPreferences.placeholder")}
          maxLength={LIMITS.colorPreferences}
          error={errors.colorPreferences}
        />

        {/* Design inspirations */}
        <TextArea
          id="design-inspirations"
          label={t("steps.design.questions.designInspirations.label")}
          value={d.designInspirations ?? ""}
          onChange={(v) => onChange({ ...d, designInspirations: v })}
          placeholder={t("steps.design.questions.designInspirations.placeholder")}
          maxLength={LIMITS.designInspirations}
          error={errors.designInspirations}
        />
      </div>
    </div>
  );
}
