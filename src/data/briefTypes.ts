// src/data/briefTypes.ts

export const PROJECT_TYPES = [
  "site-vitrine",
  "application-web",
  "application-mobile",
  "developpement-sur-mesure",
  "landing-page",
  "refonte",
  "maintenance",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export interface BriefFile {
  url: string;
  name: string;
  size: number;
  type: string;
}

export interface BriefCompany {
  name: string;
  description: string;
  target: string;
  hasWebsite: boolean;
  websiteUrl?: string;
  inspirations?: string;
}

export interface BriefGoals {
  objectives: string[];
  objectiveOther?: string;
  problem: string;
  successCriteria: string;
}

export interface FeaturesSiteVitrine {
  pages: string[];
  features: string[];
  contentAutonomy: string;
  other?: string;
}

export interface FeaturesAppWeb {
  dailyUsage: string;
  userTypes: string[];
  features: string[];
  currentTools: string;
  userVolume: string;
  other?: string;
}

export interface FeaturesAppMobile {
  platforms: string;
  usage: string;
  phoneFeatures: string[];
  offlineMode: string;
  storePublishing: string;
  userVolume: string;
  other?: string;
}

export interface FeaturesLandingPage {
  objective: string;
  features: string[];
  other?: string;
}

export interface FeaturesRefonte {
  currentUrl: string;
  problems: string[];
  toKeep?: string;
  newFeatures?: string;
}

export interface FeaturesDevSurMesure {
  description: string;
  integrations: string[];
  other?: string;
}

export interface FeaturesMaintenance {
  appUrl: string;
  interventionTypes: string[];
  frequency: string;
  other?: string;
}

export type BriefFeatures =
  | FeaturesSiteVitrine
  | FeaturesAppWeb
  | FeaturesAppMobile
  | FeaturesLandingPage
  | FeaturesRefonte
  | FeaturesDevSurMesure
  | FeaturesMaintenance;

export interface BriefDesign {
  existingIdentity: string;
  ambiance: string[];
  colorPreferences?: string;
  designInspirations?: string;
  files: BriefFile[];
}

export interface BriefContent {
  textsReady?: string;
  visualsAvailable?: string;
  keepExistingContent?: string;
  files: BriefFile[];
}

export interface BriefBudget {
  range: string;
  deadline: string;
  communicationPreference: string[];
}

export interface BriefContact {
  fullName: string;
  email: string;
  phone?: string;
}

export interface BriefData {
  projectType: ProjectType | null;
  company: BriefCompany;
  goals: BriefGoals;
  features: BriefFeatures | null;
  design: BriefDesign | null;
  content: BriefContent | null;
  budget: BriefBudget;
  contact: BriefContact;
  freeComment?: string;
  locale: "fr" | "en";
}

export interface BriefDraft {
  version: number;
  updatedAt: number;
  currentStep: number;
  data: Partial<BriefData>;
}

export const BRIEF_DRAFT_VERSION = 1;
export const BRIEF_DRAFT_KEY = "jbr-brief-draft";
export const BRIEF_DRAFT_MAX_AGE_DAYS = 30;

export const STEPS_BY_PROJECT_TYPE: Record<ProjectType, number[]> = {
  "site-vitrine": [1, 2, 3, 4, 5, 6, 7, 8],
  "application-web": [1, 2, 3, 4, 5, 6, 7, 8],
  "application-mobile": [1, 2, 3, 4, 5, 6, 7, 8],
  "developpement-sur-mesure": [1, 2, 3, 4, 7, 8],
  "landing-page": [1, 2, 3, 4, 5, 6, 7, 8],
  "refonte": [1, 2, 3, 4, 5, 6, 7, 8],
  "maintenance": [1, 2, 3, 4, 7, 8],
};

export const LIMITS = {
  name: 100,
  description: 2000,
  target: 2000,
  inspirations: 2000,
  problem: 3000,
  successCriteria: 3000,
  dailyUsage: 5000,
  currentTools: 3000,
  technicalDescription: 5000,
  colorPreferences: 1000,
  designInspirations: 2000,
  freeComment: 3000,
  other: 3000,
  fullName: 100,
  email: 254,
  phone: 20,
  fileMaxSize: 5 * 1024 * 1024,
  fileMaxCount: 5,
  ambianceMax: 3,
} as const;

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;
