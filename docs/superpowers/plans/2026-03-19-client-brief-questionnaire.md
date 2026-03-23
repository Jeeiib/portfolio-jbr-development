# Client Brief Questionnaire — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multi-step wizard questionnaire integrated into the portfolio, allowing prospects to submit structured project briefs that generate PDF recaps sent via email.

**Architecture:** Wizard multi-étapes client-side (React state + localStorage persistence), conditionnel selon le type de projet, avec upload de fichiers via Vercel Blob et soumission via API route qui génère un PDF (@react-pdf/renderer) et envoie les emails (Resend).

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, next-intl, Resend, @react-pdf/renderer, @vercel/blob

**Spec:** `docs/superpowers/specs/2026-03-19-client-brief-questionnaire-design.md`

**Design:** Use `impeccable:frontend-design` skill for all UI component design.

---

## File Map

### New files to create

| File | Responsibility |
|------|---------------|
| `src/data/briefTypes.ts` | TypeScript types/interfaces for brief data model |
| `src/data/briefQuestions.ts` | Question configuration: options, conditions, validation rules |
| `src/components/brief/ui/StepIndicator.tsx` | Progress bar showing current step |
| `src/components/brief/ui/ChipSelect.tsx` | Multi-select pill/tag component |
| `src/components/brief/ui/SingleSelect.tsx` | Single-select button group |
| `src/components/brief/ui/FileUpload.tsx` | Drag & drop file upload with Vercel Blob |
| `src/components/brief/ui/TextInput.tsx` | Text input with character counter |
| `src/components/brief/ui/TextArea.tsx` | Textarea with character counter |
| `src/components/brief/steps/ProjectTypeStep.tsx` | Step 1: project type cards |
| `src/components/brief/steps/CompanyStep.tsx` | Step 2: company info |
| `src/components/brief/steps/GoalsStep.tsx` | Step 3: project goals |
| `src/components/brief/steps/FeaturesStep.tsx` | Step 4: features (conditional) |
| `src/components/brief/steps/DesignStep.tsx` | Step 5: visual identity |
| `src/components/brief/steps/ContentStep.tsx` | Step 6: content availability |
| `src/components/brief/steps/BudgetStep.tsx` | Step 7: budget & timeline |
| `src/components/brief/steps/SummaryStep.tsx` | Step 8: recap + contact + submit |
| `src/components/brief/BriefWizard.tsx` | Wizard orchestrator: state, navigation, localStorage |
| `src/app/[locale]/brief/page.tsx` | Page: metadata (noindex), layout, BriefWizard |
| `src/app/api/brief/upload/route.ts` | File upload → Vercel Blob |
| `src/lib/briefPdf.tsx` | PDF template with @react-pdf/renderer |
| `src/app/api/brief/route.ts` | Brief submission: validate, PDF, email, cleanup |

### Files to modify

| File | Change |
|------|--------|
| `src/messages/fr.json` | Add `brief.*` translation keys |
| `src/messages/en.json` | Add `brief.*` translation keys |
| `src/app/robots.ts` | Add `/fr/brief`, `/en/brief` to disallow |
| `src/app/sitemap.ts` | Exclude `/brief` routes |
| `package.json` | Add `@react-pdf/renderer`, `@vercel/blob` |

---

## Task 1: Dependencies & Project Setup

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install new dependencies**

```bash
cd "/Users/jayb/Desktop/JBR DEVELOPMENT/Projets/Portfolio"
npm install @react-pdf/renderer @vercel/blob
```

- [ ] **Step 2: Verify installation**

```bash
cat package.json | grep -E "react-pdf|vercel/blob"
```

Expected: Both packages appear in dependencies.

- [ ] **Step 3: Document required environment variables**

Add `BLOB_READ_WRITE_TOKEN` to `.env.example` (or `.env.local` for dev). This token is required for Vercel Blob uploads. Get it from the Vercel dashboard → Storage → Blob → Connect to project, or create a new store.

```bash
echo "# Vercel Blob (file uploads for brief questionnaire)" >> .env.example
echo "BLOB_READ_WRITE_TOKEN=" >> .env.example
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .env.example
git commit -m "chore: add @react-pdf/renderer and @vercel/blob dependencies"
```

---

## Task 2: TypeScript Types & Data Model

**Files:**
- Create: `src/data/briefTypes.ts`

- [ ] **Step 1: Create the brief data model types**

```typescript
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

// Step 4 — each variant has its own shape
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
  keepExistingContent?: string; // Refonte only
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
  locale: string;
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

// Steps visible per project type
export const STEPS_BY_PROJECT_TYPE: Record<ProjectType, number[]> = {
  "site-vitrine": [1, 2, 3, 4, 5, 6, 7, 8],
  "application-web": [1, 2, 3, 4, 5, 6, 7, 8],
  "application-mobile": [1, 2, 3, 4, 5, 6, 7, 8],
  "developpement-sur-mesure": [1, 2, 3, 4, 7, 8],
  "landing-page": [1, 2, 3, 4, 5, 6, 7, 8],
  "refonte": [1, 2, 3, 4, 5, 6, 7, 8],
  "maintenance": [1, 2, 3, 4, 7, 8],
};

// Validation limits
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
  fileMaxSize: 5 * 1024 * 1024, // 5 Mo
  fileMaxCount: 5,
  ambianceMax: 3,
} as const;

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;
```

- [ ] **Step 2: Verify the file compiles**

```bash
cd "/Users/jayb/Desktop/JBR DEVELOPMENT/Projets/Portfolio"
npx tsc --noEmit src/data/briefTypes.ts 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/data/briefTypes.ts
git commit -m "feat(brief): add TypeScript types and data model"
```

---

## Task 3: Question Configuration Data

**Files:**
- Create: `src/data/briefQuestions.ts`

- [ ] **Step 1: Create question configuration**

This file defines all question option keys for each step. The actual display text comes from i18n. Each option is a string key that maps to a translation.

```typescript
// src/data/briefQuestions.ts
import type { ProjectType } from "./briefTypes";

export interface QuestionOption {
  key: string;
  icon?: string;
}

export const projectTypeOptions: QuestionOption[] = [
  { key: "site-vitrine", icon: "🌐" },
  { key: "application-web", icon: "💻" },
  { key: "application-mobile", icon: "📱" },
  { key: "landing-page", icon: "⚡" },
  { key: "refonte", icon: "🔄" },
  { key: "developpement-sur-mesure", icon: "🔧" },
  { key: "maintenance", icon: "🛠️" },
];

export const objectiveOptions = [
  "visibility",
  "clients",
  "automation",
  "replace-tool",
  "client-service",
  "new-product",
] as const;

export const siteVitrinePages = [
  "home",
  "about",
  "services",
  "portfolio",
  "blog",
  "contact",
  "faq",
  "legal",
] as const;

export const siteVitrineFeatures = [
  "contact-form",
  "booking",
  "google-maps",
  "gallery",
  "testimonials",
  "social-links",
  "newsletter",
  "chat",
  "seo",
  "multilingual",
] as const;

export const contentAutonomyOptions = ["yes", "no", "unsure"] as const;

export const appWebUserTypes = [
  "admin",
  "employees",
  "clients",
  "partners",
  "public",
] as const;

export const appWebFeatures = [
  "auth",
  "dashboard",
  "orders",
  "payment",
  "notifications",
  "file-upload",
  "calendar",
  "messaging",
  "export",
  "integrations",
] as const;

export const userVolumeOptions = [
  "just-me",
  "2-10",
  "10-50",
  "50-500",
  "500+",
  "unsure",
] as const;

export const mobilePlatformOptions = [
  "iphone",
  "android",
  "both",
  "unsure",
] as const;

export const mobilePhoneFeatures = [
  "camera",
  "gps",
  "push-notifications",
  "contacts",
  "calendar",
  "microphone",
  "bluetooth",
  "none",
] as const;

export const offlineModeOptions = ["yes", "no", "unsure"] as const;
export const storePublishingOptions = ["yes", "no-internal", "unsure"] as const;

export const landingPageObjectives = [
  "sell-product",
  "promote-event",
  "generate-leads",
  "launch-offer",
] as const;

export const landingPageFeatures = [
  "form",
  "payment",
  "countdown",
  "testimonials",
  "video",
  "faq",
] as const;

export const refonteProblems = [
  "outdated-design",
  "slow",
  "not-mobile",
  "hard-to-update",
  "bad-seo",
  "doesnt-reflect-business",
] as const;

export const devIntegrations = [
  "third-party-api",
  "database",
  "existing-software",
  "automation",
] as const;

export const maintenanceInterventions = [
  "bug-fixes",
  "security-updates",
  "new-features",
  "content-changes",
  "performance",
] as const;

export const maintenanceFrequency = [
  "one-time",
  "monthly",
  "weekly",
  "unsure",
] as const;

export const identityOptions = [
  "logo-and-brand",
  "logo-only",
  "nothing",
] as const;

export const ambianceOptions = [
  "modern-clean",
  "professional-corporate",
  "warm-friendly",
  "creative-bold",
  "luxurious-elegant",
  "simple-accessible",
  "young-dynamic",
  "sober-minimalist",
] as const;

export const textsReadyOptions = ["yes", "drafts", "need-help"] as const;
export const visualsAvailableOptions = [
  "pro-photos",
  "amateur-photos",
  "nothing",
] as const;
export const keepContentOptions = ["yes", "partially", "no"] as const;

export const budgetRanges = [
  "under-1k",
  "1k-3k",
  "3k-5k",
  "5k-10k",
  "10k-20k",
  "over-20k",
  "unsure",
] as const;

export const deadlineOptions = [
  "urgent",
  "2-3-months",
  "6-months",
  "no-deadline",
] as const;

export const communicationOptions = [
  "email",
  "phone",
  "video",
  "in-person",
  "no-preference",
] as const;

// Which content variant to show per project type
export const contentVariant: Record<
  ProjectType,
  "full" | "light" | "none"
> = {
  "site-vitrine": "full",
  "application-web": "light",
  "application-mobile": "light",
  "developpement-sur-mesure": "none",
  "landing-page": "full",
  "refonte": "full",
  "maintenance": "none",
};

// Whether to show design step per project type
export const showDesignStep: Record<ProjectType, boolean> = {
  "site-vitrine": true,
  "application-web": true,
  "application-mobile": true,
  "developpement-sur-mesure": false,
  "landing-page": true,
  "refonte": true,
  "maintenance": false,
};
```

- [ ] **Step 2: Verify compilation**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: No errors (file imports from `briefTypes.ts`).

- [ ] **Step 3: Commit**

```bash
git add src/data/briefQuestions.ts
git commit -m "feat(brief): add question configuration data"
```

---

## Task 4: i18n Translation Keys

**Files:**
- Modify: `src/messages/fr.json`
- Modify: `src/messages/en.json`

- [ ] **Step 1: Add brief translation keys to `fr.json`**

Add a `"brief"` key at the top level of `fr.json` containing all translations for the wizard: step titles, questions, options, placeholders, examples, buttons, validation messages, email templates, and confirmation messages. Every option key from `briefQuestions.ts` must have a corresponding translation.

Structure:
```
brief.steps.{stepName}.title
brief.steps.{stepName}.subtitle
brief.steps.projectType.options.{key}.title
brief.steps.projectType.options.{key}.description
brief.steps.company.questions.{field}.label
brief.steps.company.questions.{field}.placeholder
brief.steps.goals.options.{key}
brief.steps.features.{projectType}.{field}.label
... (same pattern for all steps)
brief.ui.next / brief.ui.previous / brief.ui.submit
brief.ui.stepOf (ex: "Étape {current} sur {total}")
brief.validation.required / brief.validation.maxLength / etc.
brief.draft.resumeTitle / brief.draft.resumeMessage / brief.draft.resume / brief.draft.restart
brief.confirmation.title / brief.confirmation.message
```

This is a large translation file (~300-400 lines). Write all the French translations based on the questions defined in the spec. Here are representative examples to establish the tone and structure:

```json
{
  "brief": {
    "steps": {
      "projectType": {
        "title": "Quel type de projet avez-vous en tête ?",
        "subtitle": "Choisissez l'option qui correspond le mieux à votre besoin.",
        "options": {
          "site-vitrine": {
            "title": "Site vitrine",
            "description": "Présenter mon activité, mes services, mon entreprise en ligne"
          },
          "application-web": {
            "title": "Application web",
            "description": "Un outil en ligne sur mesure : tableau de bord, gestion, espace client..."
          }
        }
      },
      "company": {
        "title": "Parlez-nous de vous",
        "subtitle": "Quelques informations sur votre entreprise ou votre projet.",
        "questions": {
          "name": {
            "label": "Comment s'appelle votre entreprise (ou votre projet) ?",
            "placeholder": "Ex : Boulangerie Martin, Studio Créatif, MonProjet..."
          },
          "description": {
            "label": "En quelques mots, que faites-vous ?",
            "placeholder": "Décrivez votre activité comme vous l'expliqueriez à quelqu'un qui ne connaît pas votre métier.",
            "example": "Ex : Nous vendons des pâtisseries artisanales à Lille et livrons dans toute la métropole..."
          }
        }
      }
    },
    "ui": {
      "next": "Continuer",
      "previous": "Retour",
      "submit": "Envoyer mon brief",
      "stepOf": "Étape {current} sur {total}",
      "optional": "(optionnel)",
      "edit": "Modifier"
    },
    "validation": {
      "required": "Ce champ est obligatoire",
      "maxLength": "{count} caractères maximum",
      "invalidEmail": "Adresse email invalide",
      "invalidUrl": "URL invalide"
    },
    "draft": {
      "resumeTitle": "Reprendre votre brief ?",
      "resumeMessage": "Vous avez un brief en cours. Souhaitez-vous le reprendre ou recommencer ?",
      "resume": "Reprendre",
      "restart": "Recommencer"
    },
    "confirmation": {
      "title": "Brief envoyé !",
      "message": "Vous recevrez une copie PDF par email. Je vous recontacte sous 48h pour en discuter."
    }
  }
}
```

Follow this exact pattern for ALL option keys from `briefQuestions.ts`. Refer to the spec for the exact question wording.

- [ ] **Step 2: Add brief translation keys to `en.json`**

Mirror the exact same structure as `fr.json` but with English translations.

- [ ] **Step 3: Verify JSON validity**

```bash
cd "/Users/jayb/Desktop/JBR DEVELOPMENT/Projets/Portfolio"
node -e "JSON.parse(require('fs').readFileSync('src/messages/fr.json','utf8')); console.log('fr.json: valid')"
node -e "JSON.parse(require('fs').readFileSync('src/messages/en.json','utf8')); console.log('en.json: valid')"
```

Expected: Both files valid.

- [ ] **Step 4: Commit**

```bash
git add src/messages/fr.json src/messages/en.json
git commit -m "feat(brief): add FR/EN translation keys for wizard"
```

---

## Task 5: Reusable UI Components

**Files:**
- Create: `src/components/brief/ui/TextInput.tsx`
- Create: `src/components/brief/ui/TextArea.tsx`
- Create: `src/components/brief/ui/ChipSelect.tsx`
- Create: `src/components/brief/ui/SingleSelect.tsx`
- Create: `src/components/brief/ui/StepIndicator.tsx`
- Create: `src/components/brief/ui/FileUpload.tsx`

**Design:** Use `impeccable:frontend-design` skill for the visual design of all these components. They should match the portfolio's dark theme with `--accent` (#34d399) and support light mode via `data-theme="light"`.

- [ ] **Step 1: Create TextInput component**

Controlled text input with label, placeholder, character counter, validation error display, and `aria-describedby` for error messages.

Props: `{ label, value, onChange, placeholder?, maxLength, required?, error?, id }`

- [ ] **Step 2: Create TextArea component**

Same as TextInput but multiline. Shows character count as `{current}/{max}`.

Props: `{ label, value, onChange, placeholder?, maxLength, required?, error?, id, rows? }`

- [ ] **Step 3: Create ChipSelect component**

Multi-select using clickable pills/tags. Supports optional max selection limit. Each chip is a button with `aria-pressed`. Includes "Autre" option that reveals a text input when selected.

Props: `{ options: string[], selected: string[], onChange, max?, labels: Record<string, string>, hasOther?, otherValue?, onOtherChange?, id }`

- [ ] **Step 4: Create SingleSelect component**

Single-select using button group. Only one can be selected. Each option is a button with `aria-pressed`.

Props: `{ options: string[], selected: string | null, onChange, labels: Record<string, string>, id }`

- [ ] **Step 5: Create StepIndicator component**

Horizontal progress bar showing completed, current, and upcoming steps. Uses step numbers and titles. Responsive: shows numbers only on mobile, numbers + short titles on desktop.

Props: `{ steps: { number: number; title: string }[], currentStep: number }`

- [ ] **Step 6: Create FileUpload component**

Drag & drop zone + click to browse. Shows file preview (name, size, type) for selected files. Upload button triggers POST to `/api/brief/upload`. Shows upload progress. Supports remove. Validates file type and size client-side before upload.

Props: `{ files: BriefFile[], onUpload: (file: BriefFile) => void, onRemove: (url: string) => void, maxFiles: number }`

- [ ] **Step 7: Verify all components compile**

```bash
cd "/Users/jayb/Desktop/JBR DEVELOPMENT/Projets/Portfolio"
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 8: Commit**

```bash
git add src/components/brief/ui/
git commit -m "feat(brief): add reusable UI components (TextInput, TextArea, ChipSelect, SingleSelect, StepIndicator, FileUpload)"
```

---

## Task 6: Step Components (Steps 1-4)

**Files:**
- Create: `src/components/brief/steps/ProjectTypeStep.tsx`
- Create: `src/components/brief/steps/CompanyStep.tsx`
- Create: `src/components/brief/steps/GoalsStep.tsx`
- Create: `src/components/brief/steps/FeaturesStep.tsx`

**Design:** Use `impeccable:frontend-design` for all step component layouts.

- [ ] **Step 1: Create ProjectTypeStep**

Renders 7 project type cards in a responsive grid. Each card has an icon, title, and description from i18n. Clicking a card selects it (highlighted border with `--accent` color).

Props: `{ selected: ProjectType | null, onChange: (type: ProjectType) => void }`

Uses `useTranslations("brief")` and `projectTypeOptions` from `briefQuestions.ts`.

- [ ] **Step 2: Create CompanyStep**

Renders 5 questions using TextInput, TextArea, and SingleSelect components.
Question 4 (site web existant?) uses SingleSelect with conditional TextInput for URL.

Props: `{ data: BriefCompany, onChange: (data: BriefCompany) => void, errors: Record<string, string> }`

- [ ] **Step 3: Create GoalsStep**

Renders 3 questions. Q1 uses ChipSelect with "Autre" option. Q2 and Q3 use TextArea with examples in placeholder.

Props: `{ data: BriefGoals, onChange: (data: BriefGoals) => void, errors: Record<string, string> }`

- [ ] **Step 4: Create FeaturesStep**

The most complex step. Renders different question sets based on `projectType`. Uses a switch/map pattern:

```typescript
const featureVariants: Record<ProjectType, React.FC<FeatureStepProps>> = {
  "site-vitrine": SiteVitrineFeatures,
  "application-web": AppWebFeatures,
  // ... etc
};
```

Each variant is a sub-component within the same file that uses ChipSelect, SingleSelect, TextInput, and TextArea as needed. All read from `briefQuestions.ts` for option keys and `useTranslations` for labels.

Props: `{ projectType: ProjectType, data: BriefFeatures | null, onChange: (data: BriefFeatures) => void, errors: Record<string, string> }`

- [ ] **Step 5: Verify compilation**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 6: Commit**

```bash
git add src/components/brief/steps/ProjectTypeStep.tsx src/components/brief/steps/CompanyStep.tsx src/components/brief/steps/GoalsStep.tsx src/components/brief/steps/FeaturesStep.tsx
git commit -m "feat(brief): add step components 1-4 (project type, company, goals, features)"
```

---

## Task 7: Step Components (Steps 5-8)

**Files:**
- Create: `src/components/brief/steps/DesignStep.tsx`
- Create: `src/components/brief/steps/ContentStep.tsx`
- Create: `src/components/brief/steps/BudgetStep.tsx`
- Create: `src/components/brief/steps/SummaryStep.tsx`

**Design:** Use `impeccable:frontend-design` for all step layouts.

- [ ] **Step 1: Create DesignStep**

Q1: SingleSelect for existing identity + conditional FileUpload.
Q2: ChipSelect with max 3 for ambiance.
Q3-Q4: TextArea for color preferences and design inspirations.

Props: `{ data: BriefDesign | null, onChange: (data: BriefDesign) => void, errors: Record<string, string> }`

- [ ] **Step 2: Create ContentStep**

Two variants based on `contentVariant[projectType]`:
- `"full"`: 2-3 SingleSelect questions (texts ready, visuals available, keep content for refonte)
- `"light"`: FileUpload only (documents to share)

Props: `{ projectType: ProjectType, data: BriefContent | null, onChange: (data: BriefContent) => void, errors: Record<string, string> }`

- [ ] **Step 3: Create BudgetStep**

3 questions using SingleSelect (budget range, deadline) and ChipSelect (communication preference).

Props: `{ data: BriefBudget, onChange: (data: BriefBudget) => void, errors: Record<string, string> }`

- [ ] **Step 4: Create SummaryStep**

Most complex render component:
1. **Recap section**: Iterates over all previous answers, displays them organized by section with "Modifier" buttons that trigger `onEditStep(stepNumber)`.
2. **Contact section**: TextInput for name, email, phone.
3. **Free comment**: TextArea.
4. **Honeypot**: Hidden input `website_url` with `aria-hidden="true"`, `tabIndex={-1}`, CSS `position: absolute; left: -9999px`.
5. **Submit button**: Triggers `onSubmit()`. Shows loading state.

Props: `{ data: Partial<BriefData>, projectType: ProjectType, onEditStep: (step: number) => void, contact: BriefContact, onContactChange: (data: BriefContact) => void, freeComment: string, onFreeCommentChange: (value: string) => void, honeypot: string, onHoneypotChange: (value: string) => void, onSubmit: () => void, isSubmitting: boolean, errors: Record<string, string> }`

- [ ] **Step 5: Verify compilation**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 6: Commit**

```bash
git add src/components/brief/steps/DesignStep.tsx src/components/brief/steps/ContentStep.tsx src/components/brief/steps/BudgetStep.tsx src/components/brief/steps/SummaryStep.tsx
git commit -m "feat(brief): add step components 5-8 (design, content, budget, summary)"
```

---

## Task 8: BriefWizard Orchestrator

**Files:**
- Create: `src/components/brief/BriefWizard.tsx`

- [ ] **Step 1: Create the BriefWizard component**

This is the central orchestrator. It manages:

1. **State**: `useState<Partial<BriefData>>` for all answers, `useState<number>` for current step.
2. **Step resolution**: Computes visible steps from `STEPS_BY_PROJECT_TYPE[projectType]`, maps step numbers to components.
3. **Navigation**: Next/Previous buttons. "Next" validates current step before advancing. "Previous" goes back. Step indicator shows progress.
4. **localStorage persistence**:
   - On every state change: save `BriefDraft` to localStorage.
   - On mount: check for existing draft. If found and valid (version match, not expired): show modal "Reprendre votre brief ou recommencer ?".
   - If draft version mismatch or expired: clear and start fresh.
5. **Edit mode**: When SummaryStep triggers `onEditStep(n)`, wizard jumps to step n with a flag `editingFromSummary = true`. After the user clicks "Next" on that step, jump back to summary instead of the next sequential step.
6. **Validation**: Per-step validation before advancing. Errors displayed on fields. Uses `LIMITS` from `briefTypes.ts`.
7. **Submission**: Calls `POST /api/brief` with the full `BriefData` JSON. Handles loading, success (show confirmation), and error states.

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { BriefData, BriefDraft, ProjectType } from "@/data/briefTypes";
import { BRIEF_DRAFT_KEY, BRIEF_DRAFT_VERSION, BRIEF_DRAFT_MAX_AGE_DAYS, STEPS_BY_PROJECT_TYPE } from "@/data/briefTypes";
// ... import all step components and StepIndicator
```

Key behavior:
- `"use client"` directive (localStorage, useState, event handlers)
- All text from `useTranslations("brief")`
- Navigation buttons at the bottom of every step
- Confirmation screen after successful submission (not a new page)

- [ ] **Step 2: Verify compilation**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/components/brief/BriefWizard.tsx
git commit -m "feat(brief): add BriefWizard orchestrator with localStorage persistence"
```

---

## Task 9: Brief Page & SEO Exclusions

**Files:**
- Create: `src/app/[locale]/brief/page.tsx`
- Modify: `src/app/robots.ts`
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Create the brief page**

```typescript
// src/app/[locale]/brief/page.tsx
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import BriefWizard from "@/components/brief/BriefWizard";

export const metadata: Metadata = {
  title: "Brief Projet",
  robots: {
    index: false,
    follow: false,
  },
};

// Required for Next.js 16 static generation with [locale] param
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function BriefPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <BriefWizard />
    </main>
  );
}
```

No Navigation or Footer components — the brief page is standalone.

- [ ] **Step 2: Update robots.ts**

Change `disallow` from a single string to an array to add brief exclusions:

```typescript
// Before: disallow: "/api/",
// After:
disallow: ["/api/", "/fr/brief", "/en/brief"],
```

Note: this changes the type from `string` to `string[]` — both are valid in Next.js `MetadataRoute.Robots`.

- [ ] **Step 3: Verify sitemap.ts**

Check `sitemap.ts` — it uses explicit route lists (home, services, about, projects, landing pages). Since `/brief` is not in any of those lists, it will NOT appear in the sitemap. No code change needed. Just verify by reading the file.

- [ ] **Step 4: Verify the page loads**

```bash
cd "/Users/jayb/Desktop/JBR DEVELOPMENT/Projets/Portfolio"
npm run dev &
sleep 3
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/fr/brief
```

Expected: 200

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/brief/page.tsx src/app/robots.ts src/app/sitemap.ts
git commit -m "feat(brief): add brief page with noindex and SEO exclusions"
```

---

## Task 10: File Upload API Route

**Files:**
- Create: `src/app/api/brief/upload/route.ts`

- [ ] **Step 1: Create the upload endpoint**

Pattern: Follow `/api/contact/route.ts` for CSRF and rate limiting.

```typescript
// src/app/api/brief/upload/route.ts
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

// Match existing /api/contact pattern: localhost only in dev
const ALLOWED_ORIGINS = [
  "https://jbrdevelopment.fr",
  "https://www.jbrdevelopment.fr",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
];

const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo

// Rate limiting: 10 uploads per hour per IP
const uploadRateMap = new Map<string, { count: number; resetAt: number }>();
const UPLOAD_RATE_LIMIT = 10;
const UPLOAD_RATE_WINDOW = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  // 1. CSRF check
  const origin = request.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. Rate limiting
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const rateEntry = uploadRateMap.get(ip);
  if (rateEntry) {
    if (now > rateEntry.resetAt) {
      uploadRateMap.set(ip, { count: 1, resetAt: now + UPLOAD_RATE_WINDOW });
    } else if (rateEntry.count >= UPLOAD_RATE_LIMIT) {
      return NextResponse.json({ error: "Too many uploads" }, { status: 429 });
    } else {
      rateEntry.count++;
    }
  } else {
    uploadRateMap.set(ip, { count: 1, resetAt: now + UPLOAD_RATE_WINDOW });
  }

  // 3. Parse multipart form data
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // 4. Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  // 5. Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  // 6. Upload to Vercel Blob
  try {
    const blob = await put(`brief/${Date.now()}-${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({
      url: blob.url,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Vercel Blob upload failed:", error);
    return NextResponse.json(
      { error: "File upload failed. Please try again." },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Verify compilation**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/brief/upload/route.ts
git commit -m "feat(brief): add file upload API with Vercel Blob"
```

---

## Task 11: PDF Generation

**Files:**
- Create: `src/lib/briefPdf.tsx`

- [ ] **Step 1: Create the PDF template**

Uses `@react-pdf/renderer` to define a React component that renders the brief as a professional PDF document.

Structure:
- Header: "Brief Projet — [Company Name]" with JBR Development branding
- Section per step: Project type, Company, Goals, Features, Design, Content, Budget
- Contact info at the bottom
- Footer: date of submission, generated by jbrdevelopment.fr

All text in the client's locale (FR or EN). Use the `useTranslations` equivalent for PDF — since PDF renders server-side, pass translated strings as props rather than using the hook.

```typescript
// src/lib/briefPdf.tsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { BriefData } from "@/data/briefTypes";

// ... define styles, components, and render logic
```

Key: Use `renderToBuffer` for server-side generation (not the React component directly).

Export a function:
```typescript
export async function generateBriefPdf(
  data: BriefData,
  translations: Record<string, string>
): Promise<Buffer> {
  const { renderToBuffer } = await import("@react-pdf/renderer");
  return renderToBuffer(<BriefPdfDocument data={data} t={translations} />);
}
```

- [ ] **Step 2: Verify compilation**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/briefPdf.tsx
git commit -m "feat(brief): add PDF generation template"
```

---

## Task 12: Brief Submission API Route

**Files:**
- Create: `src/app/api/brief/route.ts`

- [ ] **Step 1: Create the submission endpoint**

Pattern: Follow `/api/contact/route.ts` for CSRF, rate limiting, HTML escaping, Resend integration.

Flow:
1. CSRF origin check
2. Rate limit: 3/hour/IP
3. Parse JSON body
4. Check honeypot field (`website_url`) — if filled, return fake success `{ success: true }`
5. Validate all fields (required, types, lengths, email format, URL format)
6. Download files from Vercel Blob URLs
7. Generate PDF via `generateBriefPdf()`
8. Send email to freelance via Resend (HTML formatted brief + PDF attachment + file attachments)
9. Delete files from Vercel Blob (cleanup)
10. Send confirmation email to client via Resend (PDF attachment + thank you message)
11. Return response based on email results

```typescript
// src/app/api/brief/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { del } from "@vercel/blob";
import { generateBriefPdf } from "@/lib/briefPdf";
import type { BriefData } from "@/data/briefTypes";
import { LIMITS, ALLOWED_FILE_TYPES } from "@/data/briefTypes";

// Lazy getter to avoid build-time crash when env var is missing
// (same pattern as /api/contact/route.ts)
let resendClient: Resend | null = null;
function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// Match existing /api/contact pattern: localhost only in dev
const ALLOWED_ORIGINS = [
  "https://jbrdevelopment.fr",
  "https://www.jbrdevelopment.fr",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
];

// ... CSRF origin check, rate limiting (3/hour/IP), validation, email sending
```

Flow inside `POST` handler:
1. CSRF check with `ALLOWED_ORIGINS`
2. Rate limit (3/hour/IP, same in-memory map pattern as contact route)
3. Parse + validate JSON body (all fields, lengths, types, email/URL format)
4. Check honeypot (`website_url`) — if filled, return `{ success: true }` (fake success, HTTP 200)
5. Download files from Vercel Blob URLs
6. Generate PDF: `const pdf = await generateBriefPdf(data, translations);`
7. Send email to freelance via `getResendClient().emails.send(...)` — HTML formatted brief + PDF + file attachments
8. Delete files from Vercel Blob: `await Promise.all(files.map(f => del(f.url)));`
9. Send confirmation email to client — PDF attached + thank you message
10. If freelance email fails → return error; if client email fails → return success with graceful message

Use `htmlEscape()` function (same as contact route) for all user input in HTML emails.

- [ ] **Step 2: Verify compilation**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/brief/route.ts
git commit -m "feat(brief): add submission API with validation, PDF, and email"
```

---

## Task 13: Design Pass

**Design:** REQUIRED — Use `impeccable:frontend-design` skill for this entire task.

- [ ] **Step 1: Run design audit on all brief components**

Invoke `impeccable:frontend-design` to review and polish:
- BriefWizard layout (spacing, transitions between steps)
- All UI components (ChipSelect, SingleSelect, StepIndicator, FileUpload, TextInput, TextArea)
- All Step components
- Responsive behavior (mobile wizard must be usable)
- Dark/light mode consistency
- Animations (subtle transitions between steps, button hover states)
- Typography hierarchy within the wizard

- [ ] **Step 2: Apply design improvements**

Implement all design feedback from the skill.

- [ ] **Step 3: Commit**

```bash
git add src/components/brief/ src/app/[locale]/brief/
git commit -m "style(brief): design pass with impeccable frontend-design"
```

---

## Task 14: Integration Testing

- [ ] **Step 1: Test the full wizard flow locally**

```bash
cd "/Users/jayb/Desktop/JBR DEVELOPMENT/Projets/Portfolio"
npm run dev
```

Open `http://localhost:3000/fr/brief` and test:
- [ ] All 7 project types show correct conditional steps
- [ ] Navigation (next/previous) works
- [ ] Validation blocks advancing with empty required fields
- [ ] localStorage draft persistence: fill halfway, close tab, reopen → resume prompt
- [ ] File upload works (requires `BLOB_READ_WRITE_TOKEN` env var)
- [ ] Form submission works (requires `RESEND_API_KEY` env var)
- [ ] PDF is generated and attached to emails
- [ ] Honeypot field is invisible but functional
- [ ] Responsive: test on mobile viewport
- [ ] i18n: test `/en/brief` for English version
- [ ] Summary step shows all answers with "Modifier" buttons

- [ ] **Step 2: Test SEO exclusions**

```bash
curl -s http://localhost:3000/robots.txt | grep brief
curl -s http://localhost:3000/sitemap.xml | grep brief
```

Expected: brief in robots disallow, NOT in sitemap.

- [ ] **Step 3: Fix any issues found**

- [ ] **Step 4: Commit fixes**

```bash
git add src/
git commit -m "fix(brief): integration test fixes"
```

---

## Task 15: Vercel Blob Store Configuration

- [ ] **Step 1: Create Vercel Blob store**

In the Vercel dashboard: Storage → Create → Blob Store → Connect to the portfolio project.
Copy the `BLOB_READ_WRITE_TOKEN` to `.env.local` for local dev.

- [ ] **Step 2: Configure abandoned file cleanup**

Vercel Blob does not have built-in TTL per object. For abandoned file cleanup (files uploaded but never submitted), use one of these approaches:

**Option A (recommended for V1):** Accept that abandoned files accumulate slowly. With 5 Mo max per file and 5 files max per brief, the 250 Mo free tier is sufficient for a long time. Clean up manually via the Vercel dashboard periodically.

**Option B (future):** Add a Vercel Cron Job (`vercel.json`) that runs weekly and deletes blobs with a `brief/` prefix older than 7 days via the `list()` and `del()` APIs.

For V1, go with Option A. Document this as a V2 improvement.

- [ ] **Step 3: Verify Blob connection works locally**

```bash
cd "/Users/jayb/Desktop/JBR DEVELOPMENT/Projets/Portfolio"
node -e "const { list } = require('@vercel/blob'); list().then(r => console.log('Blob connected, items:', r.blobs.length)).catch(e => console.error('Blob error:', e.message))"
```

---

## Task 16: Security Audit & Code Review

- [ ] **Step 1: Run security audit**

Use the `security-auditor` agent to review:
- `/api/brief/route.ts` — input validation, CSRF, rate limiting, email injection
- `/api/brief/upload/route.ts` — file type validation, size limits, path traversal
- `BriefWizard.tsx` — XSS in user input rendering
- `briefPdf.tsx` — injection in PDF content
- `SummaryStep.tsx` — honeypot implementation

- [ ] **Step 2: Run code review**

Use the `code-reviewer` agent to review all new files for:
- Code quality and consistency with existing codebase
- TypeScript best practices
- React patterns (unnecessary re-renders, proper key usage)
- Accessibility compliance
- i18n completeness

- [ ] **Step 3: Fix all issues found**

- [ ] **Step 4: Final commit**

```bash
git add src/
git commit -m "fix(brief): security audit and code review fixes"
```

---

## Task Summary

| Task | Description | Estimated Steps |
|------|-------------|:---:|
| 1 | Dependencies & Env Setup | 4 |
| 2 | Types & Data Model | 3 |
| 3 | Question Configuration | 3 |
| 4 | i18n Translations (FR/EN) | 4 |
| 5 | UI Components (6 components) | 8 |
| 6 | Steps 1-4 | 6 |
| 7 | Steps 5-8 | 6 |
| 8 | BriefWizard Orchestrator | 3 |
| 9 | Brief Page & SEO | 5 |
| 10 | Upload API | 3 |
| 11 | PDF Generation | 3 |
| 12 | Submission API | 3 |
| 13 | Design Pass (impeccable) | 3 |
| 14 | Integration Testing | 4 |
| 15 | Vercel Blob Store Config | 3 |
| 16 | Security Audit & Code Review | 4 |
| **Total** | | **65** |
