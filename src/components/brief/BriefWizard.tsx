"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import type {
  BriefData,
  BriefDraft,
  ProjectType,
  BriefCompany,
  BriefGoals,
  BriefFeatures,
  BriefDesign,
  BriefContent,
  BriefBudget,
  BriefContact,
} from "@/data/briefTypes";
import {
  BRIEF_DRAFT_KEY,
  BRIEF_DRAFT_VERSION,
  BRIEF_DRAFT_MAX_AGE_DAYS,
  STEPS_BY_PROJECT_TYPE,
} from "@/data/briefTypes";
import StepIndicator from "@/components/brief/ui/StepIndicator";
import EstimateBox from "@/components/brief/EstimateBox";
import { siteConfig } from "@/data/siteConfig";
import { useAnalytics } from "@/hooks/useAnalytics";
import ProjectTypeStep from "@/components/brief/steps/ProjectTypeStep";
import CompanyStep from "@/components/brief/steps/CompanyStep";
import GoalsStep from "@/components/brief/steps/GoalsStep";
import FeaturesStep from "@/components/brief/steps/FeaturesStep";
import DesignStep from "@/components/brief/steps/DesignStep";
import ContentStep from "@/components/brief/steps/ContentStep";
import BudgetStep from "@/components/brief/steps/BudgetStep";
import SummaryStep from "@/components/brief/steps/SummaryStep";

// ── Default values ──

const defaultCompany: BriefCompany = {
  name: "",
  description: "",
  target: "",
  hasWebsite: false,
  websiteUrl: "",
  inspirations: "",
};

const defaultGoals: BriefGoals = {
  objectives: [],
  objectiveOther: "",
  problem: "",
  successCriteria: "",
};

const defaultBudget: BriefBudget = {
  range: "",
  deadline: "",
  communicationPreference: [],
};

const defaultContact: BriefContact = {
  fullName: "",
  email: "",
  phone: "",
};

// ── Step metadata ──

const STEP_LABELS: Record<number, string> = {
  1: "steps.projectType.title",
  2: "steps.company.title",
  3: "steps.goals.title",
  4: "steps.features.title",
  5: "steps.design.title",
  6: "steps.content.title",
  7: "steps.budget.title",
  8: "steps.summary.title",
};

// ── Validation ──

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUrl(url: string): boolean {
  if (!url) return true; // optional
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

type ValidationErrors = Record<string, string>;

function validateStep(
  logicalStep: number,
  data: Partial<BriefData>,
  t: ReturnType<typeof useTranslations>
): ValidationErrors {
  const errors: ValidationErrors = {};

  switch (logicalStep) {
    case 1: // ProjectType
      if (!data.projectType) {
        errors.projectType = t("validation.required");
      }
      break;

    case 2: { // Company
      const c = data.company;
      if (!c?.name?.trim()) errors.name = t("validation.required");
      if (!c?.description?.trim()) errors.description = t("validation.required");
      if (!c?.target?.trim()) errors.target = t("validation.required");
      if (c?.hasWebsite && !c?.websiteUrl?.trim()) {
        errors.websiteUrl = t("validation.required");
      }
      if (c?.hasWebsite && c?.websiteUrl && !isValidUrl(c.websiteUrl)) {
        errors.websiteUrl = t("validation.invalidUrl");
      }
      break;
    }

    case 3: { // Goals
      const g = data.goals;
      if (!g?.objectives?.length) errors.objectives = t("validation.required");
      if (!g?.problem?.trim()) errors.problem = t("validation.required");
      break;
    }

    case 4: { // Features — require at least the type-specific mandatory fields
      const f = data.features;
      if (!f) {
        errors.features = t("validation.required");
        break;
      }
      if ("pages" in f && !(f as { pages: string[] }).pages.length) {
        errors.pages = t("validation.required");
      }
      if ("dailyUsage" in f && !(f as { dailyUsage: string }).dailyUsage.trim()) {
        errors.dailyUsage = t("validation.required");
      }
      if ("platforms" in f && !(f as { platforms: string }).platforms) {
        errors.platforms = t("validation.required");
      }
      if ("objective" in f && !(f as { objective: string }).objective) {
        errors.objective = t("validation.required");
      }
      if ("currentUrl" in f && !(f as { currentUrl: string }).currentUrl.trim()) {
        errors.currentUrl = t("validation.required");
      }
      if ("description" in f && !(f as { description: string }).description.trim()) {
        errors.description = t("validation.required");
      }
      if ("appUrl" in f && !(f as { appUrl: string }).appUrl.trim()) {
        errors.appUrl = t("validation.required");
      }
      break;
    }

    case 5: { // Design
      const d = data.design;
      if (!d?.existingIdentity) errors.existingIdentity = t("validation.required");
      if (!d?.ambiance?.length) errors.ambiance = t("validation.required");
      break;
    }

    case 6: // Content — mostly optional, no hard requirements
      break;

    case 7: { // Budget
      const b = data.budget;
      if (!b?.range) errors.range = t("validation.required");
      if (!b?.deadline) errors.deadline = t("validation.required");
      break;
    }

    case 8: { // Summary — validate contact
      const ct = data.contact;
      if (!ct?.fullName?.trim()) errors.fullName = t("validation.required");
      if (!ct?.email?.trim()) {
        errors.email = t("validation.required");
      } else if (!isValidEmail(ct.email)) {
        errors.email = t("validation.invalidEmail");
      }
      break;
    }
  }

  return errors;
}

// ── Draft persistence ──

function loadDraft(): BriefDraft | null {
  try {
    const raw = localStorage.getItem(BRIEF_DRAFT_KEY);
    if (!raw) return null;
    const draft: BriefDraft = JSON.parse(raw);
    if (draft.version !== BRIEF_DRAFT_VERSION) return null;
    const age = Date.now() - draft.updatedAt;
    const maxAge = BRIEF_DRAFT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    if (age > maxAge) return null;
    return draft;
  } catch {
    return null;
  }
}

function saveDraft(data: Partial<BriefData>, currentStep: number) {
  try {
    const draft: BriefDraft = {
      version: BRIEF_DRAFT_VERSION,
      updatedAt: Date.now(),
      currentStep,
      data,
    };
    localStorage.setItem(BRIEF_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(BRIEF_DRAFT_KEY);
  } catch {
    // noop
  }
}

// ── Component ──

type WizardStatus = "filling" | "submitting" | "success" | "error";

export default function BriefWizard() {
  const t = useTranslations("brief");
  const locale = useLocale();

  // Core state
  const [data, setData] = useState<Partial<BriefData>>({
    projectType: null,
    company: defaultCompany,
    goals: defaultGoals,
    features: null,
    design: null,
    content: null,
    budget: defaultBudget,
    contact: defaultContact,
    freeComment: "",
    locale: locale as "fr" | "en",
  });
  const { trackEvent } = useAnalytics();
  const briefStartedRef = useRef(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepKey, setStepKey] = useState(0); // triggers re-animation on step change
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<WizardStatus>("filling");
  const [honeypot, setHoneypot] = useState("");

  // Edit-from-summary mode
  const [editingFromSummary, setEditingFromSummary] = useState(false);
  const [summaryStepIndex, setSummaryStepIndex] = useState<number | null>(null);

  // Draft modal
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<BriefDraft | null>(null);

  // ── Active steps based on project type ──

  const activeSteps = useMemo(() => {
    if (!data.projectType) return [1]; // Only show step 1
    return STEPS_BY_PROJECT_TYPE[data.projectType];
  }, [data.projectType]);

  const currentLogicalStep = activeSteps[currentStepIndex] ?? 1;

  const stepIndicatorData = useMemo(() => {
    return activeSteps.map((stepNumber) => ({
      number: stepNumber,
      title: t(STEP_LABELS[stepNumber]),
    }));
  }, [activeSteps, t]);

  // ── Draft loading on mount ──

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setPendingDraft(draft);
      setShowDraftModal(true);
    }
  }, []);

  const handleResumeDraft = useCallback(() => {
    if (pendingDraft) {
      // Fusion défensive champ par champ : un brouillon incomplet ou corrompu
      // ne doit jamais écraser les valeurs par défaut avec undefined
      // (sinon crash au rendu du récapitulatif).
      setData((prev) => {
        const d = pendingDraft.data;
        return {
          ...prev,
          ...d,
          company: { ...defaultCompany, ...prev.company, ...d.company },
          goals: { ...defaultGoals, ...prev.goals, ...d.goals },
          budget: { ...defaultBudget, ...prev.budget, ...d.budget },
          contact: { ...defaultContact, ...prev.contact, ...d.contact },
        };
      });
      const maxIndex = pendingDraft.data.projectType
        ? STEPS_BY_PROJECT_TYPE[pendingDraft.data.projectType].length - 1
        : 0;
      setCurrentStepIndex(Math.min(Math.max(pendingDraft.currentStep, 0), maxIndex));
    }
    setShowDraftModal(false);
    setPendingDraft(null);
  }, [pendingDraft]);

  const handleRestartDraft = useCallback(() => {
    clearDraft();
    setShowDraftModal(false);
    setPendingDraft(null);
  }, []);

  // ── Auto-save draft on data/step changes ──

  useEffect(() => {
    if (status === "filling" && data.projectType) {
      saveDraft(data, currentStepIndex);
    }
  }, [data, currentStepIndex, status]);

  // ── Data updaters ──

  const updateProjectType = useCallback((type: ProjectType) => {
    setData((prev) => ({ ...prev, projectType: type }));
    setErrors({});
  }, []);

  const updateCompany = useCallback((company: BriefCompany) => {
    setData((prev) => ({ ...prev, company }));
  }, []);

  const updateGoals = useCallback((goals: BriefGoals) => {
    setData((prev) => ({ ...prev, goals }));
  }, []);

  const updateFeatures = useCallback((features: BriefFeatures) => {
    setData((prev) => ({ ...prev, features }));
  }, []);

  const updateDesign = useCallback((design: BriefDesign) => {
    setData((prev) => ({ ...prev, design }));
  }, []);

  const updateContent = useCallback((content: BriefContent) => {
    setData((prev) => ({ ...prev, content }));
  }, []);

  const updateBudget = useCallback((budget: BriefBudget) => {
    setData((prev) => ({ ...prev, budget }));
  }, []);

  const updateContact = useCallback((contact: BriefContact) => {
    setData((prev) => ({ ...prev, contact }));
  }, []);

  const updateFreeComment = useCallback((freeComment: string) => {
    setData((prev) => ({ ...prev, freeComment }));
  }, []);

  // ── Navigation ──

  const handleNext = useCallback(() => {
    const validationErrors = validateStep(currentLogicalStep, data, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    // If editing from summary, jump back to summary (pas un pas de tunnel :
    // aucun événement analytics ici)
    if (editingFromSummary && summaryStepIndex !== null) {
      setCurrentStepIndex(summaryStepIndex);
      setEditingFromSummary(false);
      setSummaryStepIndex(null);
      setStepKey((k) => k + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentStepIndex === 0 && !briefStartedRef.current) {
      briefStartedRef.current = true;
      trackEvent("brief_start");
    }
    trackEvent("brief_step", { step: currentLogicalStep });

    if (currentStepIndex < activeSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setStepKey((k) => k + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentLogicalStep, data, t, currentStepIndex, activeSteps.length, editingFromSummary, summaryStepIndex, trackEvent]);

  const handlePrevious = useCallback(() => {
    setErrors({});
    if (editingFromSummary && summaryStepIndex !== null) {
      setCurrentStepIndex(summaryStepIndex);
      setEditingFromSummary(false);
      setSummaryStepIndex(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setStepKey((k) => k + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStepIndex, editingFromSummary, summaryStepIndex]);

  const handleEditFromSummary = useCallback(
    (stepIndex: number) => {
      setSummaryStepIndex(currentStepIndex);
      setEditingFromSummary(true);
      setCurrentStepIndex(stepIndex);
      setStepKey((k) => k + 1);
      setErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [currentStepIndex]
  );

  // ── Submission ──

  const handleSubmit = useCallback(async () => {
    // Validate summary step (contact info)
    const validationErrors = validateStep(8, data, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Honeypot check
    if (honeypot) return;

    setStatus("submitting");
    setErrors({});

    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      clearDraft();
      trackEvent("brief_submit");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, [data, honeypot, t, trackEvent]);

  // ── Render current step ──

  function renderStep() {
    switch (currentLogicalStep) {
      case 1:
        return (
          <ProjectTypeStep
            selected={data.projectType ?? null}
            onChange={updateProjectType}
          />
        );
      case 2:
        return (
          <CompanyStep
            data={data.company ?? defaultCompany}
            onChange={updateCompany}
            errors={errors}
          />
        );
      case 3:
        return (
          <GoalsStep
            data={data.goals ?? defaultGoals}
            onChange={updateGoals}
            errors={errors}
          />
        );
      case 4:
        return (
          <FeaturesStep
            projectType={data.projectType!}
            data={data.features ?? null}
            onChange={updateFeatures}
            errors={errors}
          />
        );
      case 5:
        return (
          <DesignStep
            data={data.design ?? null}
            onChange={updateDesign}
            errors={errors}
          />
        );
      case 6:
        return (
          <ContentStep
            projectType={data.projectType!}
            data={data.content ?? null}
            onChange={updateContent}
            errors={errors}
          />
        );
      case 7:
        return (
          <BudgetStep
            data={data.budget ?? defaultBudget}
            onChange={updateBudget}
            errors={errors}
          />
        );
      case 8:
        return (
          <SummaryStep
            data={data}
            projectType={data.projectType!}
            onEditStep={handleEditFromSummary}
            contact={data.contact ?? defaultContact}
            onContactChange={updateContact}
            freeComment={data.freeComment ?? ""}
            onFreeCommentChange={updateFreeComment}
            honeypot={honeypot}
            onHoneypotChange={setHoneypot}
            onSubmit={handleSubmit}
            isSubmitting={status === "submitting"}
            errors={errors}
          />
        );
      default:
        return null;
    }
  }

  // ── Success screen ──

  if (status === "success") {
    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center py-24 sm:py-32 px-4 text-center">
        <div className="animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-8 animate-success-pulse">
            <svg
              className="w-10 h-10 text-[var(--accent)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4 animate-fade-in-up">
          {t("confirmation.title")}
        </h2>
        <p className="text-lg text-[var(--foreground-secondary)] max-w-lg leading-relaxed animate-fade-in-up delay-100 mb-8">
          {t("confirmation.message")}
        </p>
        <div className="w-full max-w-md animate-fade-in-up delay-200 mb-8">
          <EstimateBox data={data} />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-300">
          <a
            href={`tel:${siteConfig.phone}`}
            onClick={() => trackEvent("tel_click", { from: "brief-success" })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            {siteConfig.phoneDisplay}
          </a>
          <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click", { from: "brief-success" })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    );
  }

  // ── Error screen ──

  if (status === "error") {
    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center py-24 sm:py-32 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-8 animate-scale-in">
          <svg
            className="w-10 h-10 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4 animate-fade-in-up">
          {t("error.title")}
        </h2>
        <p className="text-lg text-[var(--foreground-secondary)] max-w-lg leading-relaxed mb-8 animate-fade-in-up delay-100">
          {t("error.message")}
        </p>
        <button
          type="button"
          onClick={() => setStatus("filling")}
          className="
            px-8 py-3.5 rounded-xl text-sm font-semibold
            bg-[var(--accent)] text-[var(--accent-foreground)]
            hover:bg-[var(--accent-hover)] active:scale-[0.97]
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:ring-offset-2 focus:ring-offset-[var(--background)]
            animate-fade-in-up delay-200
          "
        >
          {t("error.retry")}
        </button>
      </div>
    );
  }

  // ── Main wizard layout ──

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentLogicalStep === 8;

  const nextLabel = editingFromSummary ? t("ui.backToSummary") : t("ui.next");

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Draft resume modal */}
      {showDraftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-backdrop-enter bg-black/60 backdrop-blur-sm">
          <div
            className="
              animate-modal-enter
              bg-[var(--background)] border border-[var(--border)]
              rounded-2xl p-6 sm:p-8 max-w-md w-full
              shadow-2xl shadow-black/30
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="draft-dialog-title"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3
              id="draft-dialog-title"
              className="text-lg font-bold text-[var(--foreground)] mb-2"
            >
              {t("draft.resumeTitle")}
            </h3>
            <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed mb-6">
              {t("draft.resumeMessage")}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleRestartDraft}
                className="
                  flex-1 px-4 py-3 rounded-xl text-sm font-medium
                  border border-[var(--border)] text-[var(--foreground-secondary)]
                  hover:text-[var(--foreground)] hover:border-[var(--foreground-secondary)]/30
                  hover:bg-[var(--background-secondary)]
                  active:scale-[0.97] transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40
                "
              >
                {t("draft.restart")}
              </button>
              <button
                type="button"
                onClick={handleResumeDraft}
                className="
                  flex-1 px-4 py-3 rounded-xl text-sm font-semibold
                  bg-[var(--accent)] text-[var(--accent-foreground)]
                  hover:bg-[var(--accent-hover)] active:scale-[0.97]
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40
                "
              >
                {t("draft.resume")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step indicator */}
      <div className="mb-10">
        <StepIndicator
          steps={stepIndicatorData}
          currentStep={currentLogicalStep}
        />
        {/* Step counter (mobile) */}
        <p className="text-xs text-[var(--foreground-secondary)]/60 text-center mt-4 md:hidden tracking-wide uppercase">
          {t("ui.stepOf", {
            current: currentStepIndex + 1,
            total: activeSteps.length,
          })}
        </p>
      </div>

      {/* Current step content — animated on step change */}
      <div key={stepKey} className="min-h-[420px] animate-step-enter">
        {renderStep()}
      </div>

      {/* Navigation buttons — not shown on summary (it has its own submit) */}
      {!isLastStep && (
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-[var(--border)]/50">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={`
              group flex items-center gap-2
              px-5 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40
              ${isFirstStep
                ? "opacity-0 pointer-events-none"
                : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
              }
            `}
          >
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t("ui.previous")}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="
              group flex items-center gap-2
              px-7 py-3 rounded-xl text-sm font-semibold
              bg-[var(--accent)] text-[var(--accent-foreground)]
              hover:bg-[var(--accent-hover)] active:scale-[0.97]
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:ring-offset-2 focus:ring-offset-[var(--background)]
            "
          >
            {nextLabel}
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
