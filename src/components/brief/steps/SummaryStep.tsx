"use client";

import { useTranslations } from "next-intl";
import TextInput from "@/components/brief/ui/TextInput";
import TextArea from "@/components/brief/ui/TextArea";
import type {
  ProjectType,
  BriefData,
  BriefContact,
  BriefCompany,
  BriefGoals,
  BriefDesign,
  BriefContent,
  BriefBudget,
  BriefFile,
  BriefFeatures,
} from "@/data/briefTypes";
import { LIMITS, STEPS_BY_PROJECT_TYPE } from "@/data/briefTypes";
import EstimateBox from "@/components/brief/EstimateBox";
import {
  objectiveOptions,
  identityOptions,
  ambianceOptions,
  textsReadyOptions,
  visualsAvailableOptions,
  keepContentOptions,
  budgetRanges,
  deadlineOptions,
  communicationOptions,
  contentVariant,
  showDesignStep,
} from "@/data/briefQuestions";

interface SummaryStepProps {
  data: Partial<BriefData>;
  projectType: ProjectType;
  onEditStep: (step: number) => void;
  contact: BriefContact;
  onContactChange: (data: BriefContact) => void;
  freeComment: string;
  onFreeCommentChange: (value: string) => void;
  honeypot: string;
  onHoneypotChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

// ── Helpers ──

function truncate(text: string | undefined, max = 100): string {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max) + "...";
}

function formatFiles(files: BriefFile[]): string {
  if (files.length === 0) return "";
  return files.map((f) => f.name).join(", ");
}

// ── Recap Section Card ──

function RecapSection({
  title,
  onEdit,
  editLabel,
  children,
}: {
  title: string;
  onEdit: () => void;
  editLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background-secondary)]/50 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="
            text-xs font-medium text-[var(--accent)]
            hover:text-[var(--accent)]/80
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 rounded px-2 py-1
          "
        >
          {editLabel}
        </button>
      </div>
      <div className="space-y-2 text-sm text-[var(--foreground-secondary)]">
        {children}
      </div>
    </div>
  );
}

function RecapRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:gap-2">
      <span className="font-medium text-[var(--foreground)]/70 shrink-0">{label} :</span>
      <span>{value}</span>
    </div>
  );
}

// ── Main Component ──

export default function SummaryStep({
  data,
  projectType,
  onEditStep,
  contact,
  onContactChange,
  freeComment,
  onFreeCommentChange,
  honeypot,
  onHoneypotChange,
  onSubmit,
  isSubmitting,
  errors,
}: SummaryStepProps) {
  const t = useTranslations("brief");
  const editLabel = t("ui.edit");

  // Resolve which logical steps are active for this project type
  const activeSteps = STEPS_BY_PROJECT_TYPE[projectType];
  const hasDesign = showDesignStep[projectType];
  const variant = contentVariant[projectType];

  // ── Label resolvers ──

  function resolveProjectTypeLabel(): string {
    return t(`steps.projectType.options.${projectType}.title`);
  }

  function resolveMultiSelectLabels(
    keys: string[],
    basePath: string,
    optionsList: readonly string[]
  ): string {
    return keys
      .map((key) => {
        if (optionsList.includes(key)) {
          return t(`${basePath}.${key}`);
        }
        return key;
      })
      .join(", ");
  }

  function resolveSingleLabel(key: string | undefined, basePath: string): string {
    if (!key) return "";
    return t(`${basePath}.${key}`);
  }

  // ── Recap sections ──

  const company = data.company as BriefCompany | undefined;
  const goals = data.goals as BriefGoals | undefined;
  const features = data.features as BriefFeatures | undefined;
  const design = data.design as BriefDesign | undefined;
  const content = data.content as BriefContent | undefined;
  const budget = data.budget as BriefBudget | undefined;

  // Find the logical step number for each section
  // Step 1 = projectType, Step 2 = company, Step 3 = goals, Step 4 = features
  // Step 5 = design (if applicable), Step 6 = content (if applicable), Step 7 = budget

  function findStepIndex(logicalStep: number): number {
    const idx = activeSteps.indexOf(logicalStep);
    return idx >= 0 ? idx : 0;
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          {t("steps.summary.title")}
        </h2>
        <p className="text-[var(--foreground-secondary)]">
          {t("steps.summary.subtitle")}
        </p>
      </div>

      {/* ── A. Recap section ── */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          {t("steps.summary.sectionTitle")}
        </h3>

        <div className="space-y-3">
          {/* Project type */}
          <RecapSection
            title={t("steps.summary.recapLabels.projectType")}
            onEdit={() => onEditStep(findStepIndex(1))}
            editLabel={editLabel}
          >
            <RecapRow label={t("steps.summary.recapLabels.projectType")} value={resolveProjectTypeLabel()} />
          </RecapSection>

          {/* Company */}
          {company && (
            <RecapSection
              title={t("steps.summary.recapLabels.company")}
              onEdit={() => onEditStep(findStepIndex(2))}
              editLabel={editLabel}
            >
              <RecapRow
                label={t("steps.company.questions.name.label")}
                value={company.name}
              />
              <RecapRow
                label={t("steps.company.questions.description.label")}
                value={truncate(company.description)}
              />
              <RecapRow
                label={t("steps.company.questions.target.label")}
                value={truncate(company.target)}
              />
              {company.hasWebsite && company.websiteUrl && (
                <RecapRow
                  label={t("steps.company.questions.websiteUrl.label")}
                  value={company.websiteUrl}
                />
              )}
            </RecapSection>
          )}

          {/* Goals */}
          {goals && (
            <RecapSection
              title={t("steps.summary.recapLabels.goals")}
              onEdit={() => onEditStep(findStepIndex(3))}
              editLabel={editLabel}
            >
              {goals.objectives.length > 0 && (
                <RecapRow
                  label={t("steps.goals.questions.objectives.label")}
                  value={resolveMultiSelectLabels(
                    goals.objectives,
                    "steps.goals.options",
                    [...objectiveOptions]
                  )}
                />
              )}
              <RecapRow
                label={t("steps.goals.questions.problem.label")}
                value={truncate(goals.problem)}
              />
              <RecapRow
                label={t("steps.goals.questions.successCriteria.label")}
                value={truncate(goals.successCriteria)}
              />
            </RecapSection>
          )}

          {/* Features */}
          {features && (
            <RecapSection
              title={t("steps.summary.recapLabels.features")}
              onEdit={() => onEditStep(findStepIndex(4))}
              editLabel={editLabel}
            >
              {/* Show a generic summary of features based on type */}
              {"pages" in features && (features as { pages: string[] }).pages.length > 0 && (
                <RecapRow
                  label={t("steps.features.site-vitrine.pages.label")}
                  value={t("steps.summary.recapPages", { count: (features as { pages: string[] }).pages.length })}
                />
              )}
              {"features" in features && (features as { features: string[] }).features.length > 0 && (
                <RecapRow
                  label={t("steps.features.title")}
                  value={t("steps.summary.recapFeatures", { count: (features as { features: string[] }).features.length })}
                />
              )}
              {"dailyUsage" in features && (features as { dailyUsage: string }).dailyUsage && (
                <RecapRow
                  label={t("steps.features.application-web.dailyUsage.label")}
                  value={truncate((features as { dailyUsage: string }).dailyUsage)}
                />
              )}
              {"platforms" in features && (features as { platforms: string }).platforms && (
                <RecapRow
                  label={t("steps.features.application-mobile.platforms.label")}
                  value={(features as { platforms: string }).platforms}
                />
              )}
              {"currentUrl" in features && (features as { currentUrl: string }).currentUrl && (
                <RecapRow
                  label={t("steps.features.refonte.currentUrl.label")}
                  value={(features as { currentUrl: string }).currentUrl}
                />
              )}
              {"description" in features && (features as { description: string }).description && (
                <RecapRow
                  label={t("steps.features.developpement-sur-mesure.description.label")}
                  value={truncate((features as { description: string }).description)}
                />
              )}
              {"appUrl" in features && (features as { appUrl: string }).appUrl && (
                <RecapRow
                  label={t("steps.features.maintenance.appUrl.label")}
                  value={(features as { appUrl: string }).appUrl}
                />
              )}
            </RecapSection>
          )}

          {/* Design */}
          {hasDesign && design && (
            <RecapSection
              title={t("steps.summary.recapLabels.design")}
              onEdit={() => onEditStep(findStepIndex(5))}
              editLabel={editLabel}
            >
              {design.existingIdentity && (
                <RecapRow
                  label={t("steps.design.questions.existingIdentity.label")}
                  value={resolveSingleLabel(
                    design.existingIdentity,
                    "steps.design.questions.existingIdentity.options"
                  )}
                />
              )}
              {design.ambiance.length > 0 && (
                <RecapRow
                  label={t("steps.design.questions.ambiance.label")}
                  value={resolveMultiSelectLabels(
                    design.ambiance,
                    "steps.design.questions.ambiance.options",
                    [...ambianceOptions]
                  )}
                />
              )}
              {design.colorPreferences && (
                <RecapRow
                  label={t("steps.design.questions.colorPreferences.label")}
                  value={truncate(design.colorPreferences)}
                />
              )}
              {design.files.length > 0 && (
                <RecapRow label={t("steps.summary.recapFiles")} value={formatFiles(design.files)} />
              )}
            </RecapSection>
          )}

          {/* Content */}
          {variant !== "none" && content && (
            <RecapSection
              title={t("steps.summary.recapLabels.content")}
              onEdit={() => onEditStep(findStepIndex(6))}
              editLabel={editLabel}
            >
              {variant === "full" && (
                <>
                  {content.textsReady && (
                    <RecapRow
                      label={t("steps.content.full.textsReady.label")}
                      value={resolveSingleLabel(
                        content.textsReady,
                        "steps.content.full.textsReady.options"
                      )}
                    />
                  )}
                  {content.visualsAvailable && (
                    <RecapRow
                      label={t("steps.content.full.visualsAvailable.label")}
                      value={resolveSingleLabel(
                        content.visualsAvailable,
                        "steps.content.full.visualsAvailable.options"
                      )}
                    />
                  )}
                  {content.keepExistingContent && (
                    <RecapRow
                      label={t("steps.content.full.keepContent.label")}
                      value={resolveSingleLabel(
                        content.keepExistingContent,
                        "steps.content.full.keepContent.options"
                      )}
                    />
                  )}
                </>
              )}
              {content.files.length > 0 && (
                <RecapRow label={t("steps.summary.recapFiles")} value={formatFiles(content.files)} />
              )}
            </RecapSection>
          )}

          {/* Budget */}
          {budget && (
            <RecapSection
              title={t("steps.summary.recapLabels.budget")}
              onEdit={() => onEditStep(findStepIndex(7))}
              editLabel={editLabel}
            >
              {budget.range && (
                <RecapRow
                  label={t("steps.budget.questions.range.label")}
                  value={resolveSingleLabel(
                    budget.range,
                    "steps.budget.questions.range.options"
                  )}
                />
              )}
              {budget.deadline && (
                <RecapRow
                  label={t("steps.budget.questions.deadline.label")}
                  value={resolveSingleLabel(
                    budget.deadline,
                    "steps.budget.questions.deadline.options"
                  )}
                />
              )}
              {budget.communicationPreference.length > 0 && (
                <RecapRow
                  label={t("steps.budget.questions.communication.label")}
                  value={resolveMultiSelectLabels(
                    budget.communicationPreference,
                    "steps.budget.questions.communication.options",
                    [...communicationOptions]
                  )}
                />
              )}
            </RecapSection>
          )}
        </div>
      </div>

      {/* ── B. Contact section ── */}
      <div className="space-y-6 pt-6 border-t border-[var(--border)]">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            {t("steps.summary.contact.title")}
          </h3>
          <p className="text-sm text-[var(--foreground-secondary)]">
            {t("steps.summary.contact.subtitle")}
          </p>
        </div>

        <div className="space-y-6">
          <TextInput
            id="contact-full-name"
            label={t("steps.summary.contact.fullName.label")}
            value={contact.fullName}
            onChange={(v) => onContactChange({ ...contact, fullName: v })}
            placeholder={t("steps.summary.contact.fullName.placeholder")}
            maxLength={LIMITS.fullName}
            required
            error={errors.fullName}
          />

          <TextInput
            id="contact-email"
            label={t("steps.summary.contact.email.label")}
            value={contact.email}
            onChange={(v) => onContactChange({ ...contact, email: v })}
            placeholder={t("steps.summary.contact.email.placeholder")}
            maxLength={LIMITS.email}
            required
            error={errors.email}
          />

          <TextInput
            id="contact-phone"
            label={t("steps.summary.contact.phone.label")}
            value={contact.phone ?? ""}
            onChange={(v) => onContactChange({ ...contact, phone: v })}
            placeholder={t("steps.summary.contact.phone.placeholder")}
            maxLength={LIMITS.phone}
            error={errors.phone}
          />
        </div>
      </div>

      {/* ── C. Free comment ── */}
      <div className="space-y-4">
        <TextArea
          id="summary-free-comment"
          label={t("steps.summary.freeComment.label")}
          value={freeComment}
          onChange={onFreeCommentChange}
          placeholder={t("steps.summary.freeComment.placeholder")}
          maxLength={LIMITS.freeComment}
          error={errors.freeComment}
          rows={5}
        />
      </div>

      {/* ── D. Honeypot (anti-bot trap -- hidden from real users and screen readers) ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: 0,
          height: 0,
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <label htmlFor="website_url">Website URL</label>
        <input
          type="text"
          id="website_url"
          name="website_url"
          tabIndex={-1}
          value={honeypot}
          onChange={(e) => onHoneypotChange(e.target.value)}
          autoComplete="off"
        />
      </div>

      {/* ── E. Estimation immédiate ── */}
      <EstimateBox data={data} />

      {/* ── F. Submit button ── */}
      <div className="pt-4">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`
            w-full sm:w-auto sm:min-w-[280px] sm:mx-auto sm:block
            px-8 py-4 rounded-xl text-base font-semibold
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:ring-offset-2 focus:ring-offset-[var(--background)]
            ${isSubmitting
              ? "bg-[var(--accent)]/60 text-[var(--accent-foreground)]/80 cursor-wait"
              : "bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90 active:scale-[0.98] shadow-lg shadow-[var(--accent)]/20 hover:shadow-xl hover:shadow-[var(--accent)]/30"
            }
          `}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {t("steps.summary.submitting")}
            </span>
          ) : (
            t("steps.summary.submit")
          )}
        </button>
      </div>
    </div>
  );
}
