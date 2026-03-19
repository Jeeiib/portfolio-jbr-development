"use client";

import { useTranslations } from "next-intl";
import SingleSelect from "@/components/brief/ui/SingleSelect";
import FileUpload from "@/components/brief/ui/FileUpload";
import { contentVariant, textsReadyOptions, visualsAvailableOptions, keepContentOptions } from "@/data/briefQuestions";
import type { ProjectType, BriefContent, BriefFile } from "@/data/briefTypes";
import { LIMITS } from "@/data/briefTypes";

interface ContentStepProps {
  projectType: ProjectType;
  data: BriefContent | null;
  onChange: (data: BriefContent) => void;
  errors: Record<string, string>;
}

const defaultContent: BriefContent = {
  textsReady: "",
  visualsAvailable: "",
  keepExistingContent: "",
  files: [],
};

export default function ContentStep({ projectType, data, onChange, errors }: ContentStepProps) {
  const t = useTranslations("brief");
  const d = data ?? defaultContent;
  const variant = contentVariant[projectType];

  const handleFileUpload = (file: BriefFile) => {
    onChange({ ...d, files: [...d.files, file] });
  };

  const handleFileRemove = (url: string) => {
    onChange({ ...d, files: d.files.filter((f) => f.url !== url) });
  };

  if (variant === "light") {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            {t("steps.content.title")}
          </h2>
          <p className="text-[var(--foreground-secondary)]">
            {t("steps.content.subtitle")}
          </p>
        </div>

        <div className="space-y-8">
          {/* Documents upload */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-[var(--foreground)]">
              {t("steps.content.light.filesUpload.label")}
            </label>
            {t.has("steps.content.light.filesUpload.hint") && (
              <p className="text-xs text-[var(--foreground-secondary)]/70">
                {t("steps.content.light.filesUpload.hint")}
              </p>
            )}
            <FileUpload
              files={d.files}
              onUpload={handleFileUpload}
              onRemove={handleFileRemove}
              maxFiles={LIMITS.fileMaxCount}
            />
          </div>
        </div>
      </div>
    );
  }

  // "full" variant (site-vitrine, landing-page, refonte)
  const textsLabels: Record<string, string> = {};
  for (const key of textsReadyOptions) {
    textsLabels[key] = t(`steps.content.full.textsReady.options.${key}`);
  }

  const visualsLabels: Record<string, string> = {};
  for (const key of visualsAvailableOptions) {
    visualsLabels[key] = t(`steps.content.full.visualsAvailable.options.${key}`);
  }

  const keepLabels: Record<string, string> = {};
  for (const key of keepContentOptions) {
    keepLabels[key] = t(`steps.content.full.keepContent.options.${key}`);
  }

  const isRefonte = projectType === "refonte";

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          {t("steps.content.title")}
        </h2>
        <p className="text-[var(--foreground-secondary)]">
          {t("steps.content.subtitle")}
        </p>
      </div>

      <div className="space-y-8">
        {/* Texts ready? */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            {t("steps.content.full.textsReady.label")}
            <span className="text-[var(--accent)] ml-1">*</span>
          </label>
          <SingleSelect
            id="content-texts-ready"
            options={[...textsReadyOptions]}
            selected={d.textsReady || null}
            onChange={(v) => onChange({ ...d, textsReady: v })}
            labels={textsLabels}
          />
          {errors.textsReady && (
            <p role="alert" className="text-sm text-red-400/90">
              {errors.textsReady}
            </p>
          )}
        </div>

        {/* Visuals available? */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            {t("steps.content.full.visualsAvailable.label")}
            <span className="text-[var(--accent)] ml-1">*</span>
          </label>
          <SingleSelect
            id="content-visuals-available"
            options={[...visualsAvailableOptions]}
            selected={d.visualsAvailable || null}
            onChange={(v) => onChange({ ...d, visualsAvailable: v })}
            labels={visualsLabels}
          />
          {errors.visualsAvailable && (
            <p role="alert" className="text-sm text-red-400/90">
              {errors.visualsAvailable}
            </p>
          )}
        </div>

        {/* Keep existing content? (refonte only) */}
        {isRefonte && (
          <div className="space-y-3 animate-fade-in">
            <label className="block text-sm font-medium text-[var(--foreground)]">
              {t("steps.content.full.keepContent.label")}
              <span className="text-[var(--accent)] ml-1">*</span>
            </label>
            <SingleSelect
              id="content-keep"
              options={[...keepContentOptions]}
              selected={d.keepExistingContent || null}
              onChange={(v) => onChange({ ...d, keepExistingContent: v })}
              labels={keepLabels}
            />
            {errors.keepExistingContent && (
              <p role="alert" className="text-sm text-red-400/90">
                {errors.keepExistingContent}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
