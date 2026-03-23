// src/data/briefQuestions.ts
import type { ProjectType } from "./briefTypes";

export interface QuestionOption {
  key: string;
}

export const projectTypeOptions: QuestionOption[] = [
  { key: "site-vitrine" },
  { key: "application-web" },
  { key: "application-mobile" },
  { key: "landing-page" },
  { key: "refonte" },
  { key: "developpement-sur-mesure" },
  { key: "maintenance" },
];

export const objectiveOptions = [
  "visibility", "clients", "automation", "replace-tool", "client-service", "new-product",
] as const;

export const siteVitrinePages = [
  "home", "about", "services", "portfolio", "blog", "contact", "faq", "legal",
] as const;

export const siteVitrineFeatures = [
  "contact-form", "booking", "google-maps", "gallery", "testimonials",
  "social-links", "newsletter", "chat", "seo", "multilingual",
] as const;

export const contentAutonomyOptions = ["yes", "no", "unsure"] as const;

export const appWebUserTypes = [
  "admin", "employees", "clients", "partners", "public",
] as const;

export const appWebFeatures = [
  "auth", "dashboard", "orders", "payment", "notifications",
  "file-upload", "calendar", "messaging", "export", "integrations",
] as const;

export const userVolumeOptions = [
  "just-me", "2-10", "10-50", "50-500", "500+", "unsure",
] as const;

export const mobilePlatformOptions = [
  "iphone", "android", "both", "unsure",
] as const;

export const mobilePhoneFeatures = [
  "camera", "gps", "push-notifications", "contacts",
  "calendar", "microphone", "bluetooth", "none",
] as const;

export const offlineModeOptions = ["yes", "no", "unsure"] as const;
export const storePublishingOptions = ["yes", "no-internal", "unsure"] as const;

export const landingPageObjectives = [
  "sell-product", "promote-event", "generate-leads", "launch-offer",
] as const;

export const landingPageFeatures = [
  "form", "payment", "countdown", "testimonials", "video", "faq",
] as const;

export const refonteProblems = [
  "outdated-design", "slow", "not-mobile", "hard-to-update",
  "bad-seo", "doesnt-reflect-business",
] as const;

export const devIntegrations = [
  "third-party-api", "database", "existing-software", "automation",
] as const;

export const maintenanceInterventions = [
  "bug-fixes", "security-updates", "new-features",
  "content-changes", "performance",
] as const;

export const maintenanceFrequency = [
  "one-time", "monthly", "weekly", "unsure",
] as const;

export const identityOptions = [
  "logo-and-brand", "logo-only", "nothing",
] as const;

export const ambianceOptions = [
  "modern-clean", "professional-corporate", "warm-friendly",
  "creative-bold", "luxurious-elegant", "simple-accessible",
  "young-dynamic", "sober-minimalist",
] as const;

export const textsReadyOptions = ["yes", "drafts", "need-help"] as const;
export const visualsAvailableOptions = ["pro-photos", "amateur-photos", "nothing"] as const;
export const keepContentOptions = ["yes", "partially", "no"] as const;

export const budgetRanges = [
  "under-1k", "1k-3k", "3k-5k", "5k-10k", "10k-20k", "over-20k", "unsure",
] as const;

export const deadlineOptions = [
  "urgent", "2-3-months", "6-months", "no-deadline",
] as const;

export const communicationOptions = [
  "email", "phone", "video", "in-person", "no-preference",
] as const;

export const contentVariant: Record<ProjectType, "full" | "light" | "none"> = {
  "site-vitrine": "full",
  "application-web": "light",
  "application-mobile": "light",
  "developpement-sur-mesure": "none",
  "landing-page": "full",
  "refonte": "full",
  "maintenance": "none",
};

export const showDesignStep: Record<ProjectType, boolean> = {
  "site-vitrine": true,
  "application-web": true,
  "application-mobile": true,
  "developpement-sur-mesure": false,
  "landing-page": true,
  "refonte": true,
  "maintenance": false,
};
