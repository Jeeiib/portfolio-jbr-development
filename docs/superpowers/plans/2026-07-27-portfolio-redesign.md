# Plan A — Refonte portfolio JBR Development (design, tarifs, conversion, analytics)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **RÈGLE SPÉCIALE DESIGN (JB)** : les tâches marquées **[DESIGN — coordinateur]** sont exécutées par le coordinateur lui-même avec le skill `frontend-design` réellement invoqué, JAMAIS par un subagent. Les tâches GSAP exigent en plus la doc **Context7** à jour + les skills `gsap-skills:*`.

**Goal:** Refondre le site jbrdevelopment.fr pour convertir des TPE/PME lilloises : design hybride « preuve + chantier vivant », prix affichés, brief promu, analytics sans cookies.

**Architecture:** Next.js 16 App Router existant conservé (next-intl fr/en, Tailwind 4, Resend). On ajoute GSAP pour le hero, Vercel Analytics/Speed Insights en remplacement de GA4, une page `/tarifs`, et on redessine les composants de sections. Données en TS dans `src/data/`, copy dans `src/messages/{fr,en}.json`.

**Tech Stack:** Next.js 16.1.1, React 19, Tailwind 4, next-intl 4.7, GSAP + @gsap/react, @vercel/analytics, @vercel/speed-insights, vitest.

**Spec:** `docs/superpowers/specs/2026-07-27-portfolio-redesign-seo-design.md`

## Global Constraints

- **Charte couleurs INTOUCHABLE** — dark : `--background:#1a1a1a`, `--background-secondary:#232323`, `--background-card:#2a2a2a`, `--foreground:#f5f5f5`, `--accent:#34d399`, hover `#10b981` ; light : `--accent:#047857`. Light + dark conservés.
- **Discipline émeraude** : `--accent` uniquement sur preuves (chiffres, avis, résultats) et CTA. Jamais en décoration.
- **Téléphone public : `+33618972250`** (tel: et WhatsApp `https://wa.me/33618972250`).
- **Prix : vitrine dès 1 190 € HT · sur-mesure dès 3 900 € HT · maintenance 79 € HT/mois.**
- **GSAP** : avant d'écrire du code GSAP, consulter Context7 (`resolve-library-id` "gsap" puis `query-docs`) + invoquer `gsap-skills:gsap-react` (et `gsap-core`/`gsap-performance` si utile). Pas de GSAP de mémoire.
- `prefers-reduced-motion` respecté sur toute animation ; focus clavier visible ; responsive ≥ 360 px.
- Copy : français d'abord (ton direct, zéro jargon, compréhensible par un gérant de TPE) ; en.json = traduction fonctionnelle. Pas de tirets longs. Pas d'emojis dans le code.
- Budget perf : LCP < 2 s sur la home (hero compris).
- Package manager : **pnpm**. Commits sans mention de Claude. Type-check : tout fichier touché doit sortir sans erreur TS (`pnpm exec tsc --noEmit`).
- Le brief `/brief` reste **noindex**.

---

### Task 1 : Dépendances, config de site, vitest

**Files:**
- Modify: `package.json`
- Create: `src/data/siteConfig.ts`
- Create: `vitest.config.ts`
- Create: `src/data/__tests__/siteConfig.test.ts`

**Interfaces:**
- Produces: `siteConfig` (objet const exporté) — utilisé par toutes les tâches suivantes :
  ```ts
  siteConfig.phone            // "+33618972250"
  siteConfig.phoneDisplay     // "06 18 97 22 50"
  siteConfig.whatsappUrl      // "https://wa.me/33618972250"
  siteConfig.email            // string
  siteConfig.city             // "Lille"
  siteConfig.responseTimeHours // 24
  siteConfig.googleReviewsUrl // lien avis Google existant
  siteConfig.prices.vitrine   // { from: 1190, currency: "EUR" }
  siteConfig.prices.surMesure // { from: 3900, typicalMin: 5000, typicalMax: 9000 }
  siteConfig.prices.maintenance // { monthly: 79 }
  ```

- [ ] **Step 1 : Installer les dépendances**

```bash
pnpm add gsap @gsap/react @vercel/analytics @vercel/speed-insights
pnpm add -D vitest
```

- [ ] **Step 2 : Ajouter le script test et vitest.config.ts**

Dans `package.json`, ajouter `"test": "vitest run"` aux scripts. Créer `vitest.config.ts` :

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: { include: ["src/**/*.test.ts"] },
});
```

- [ ] **Step 3 : Test échouant pour siteConfig**

`src/data/__tests__/siteConfig.test.ts` :

```ts
import { describe, it, expect } from "vitest";
import { siteConfig } from "@/data/siteConfig";

describe("siteConfig", () => {
  it("expose le téléphone au format E.164 et l'URL WhatsApp assortie", () => {
    expect(siteConfig.phone).toBe("+33618972250");
    expect(siteConfig.whatsappUrl).toBe("https://wa.me/33618972250");
  });
  it("expose la grille tarifaire validée", () => {
    expect(siteConfig.prices.vitrine.from).toBe(1190);
    expect(siteConfig.prices.surMesure.from).toBe(3900);
    expect(siteConfig.prices.maintenance.monthly).toBe(79);
  });
});
```

Run : `pnpm test` — Expected : FAIL (module inexistant).

- [ ] **Step 4 : Créer src/data/siteConfig.ts**

```ts
export const siteConfig = {
  name: "JBR Development",
  url: "https://jbrdevelopment.fr",
  phone: "+33618972250",
  phoneDisplay: "06 18 97 22 50",
  whatsappUrl: "https://wa.me/33618972250",
  email: "contact@jbrdevelopment.fr", // vérifier la vraie adresse dans src/components/sections/Contact.tsx et l'utiliser
  city: "Lille",
  responseTimeHours: 24,
  googleReviewsUrl: "https://share.google/TrBD8GioYeNPAUJ37", // lien "Voir sur Google" déjà présent dans messages/fr.json (testimonial.viewOnGoogle)
  prices: {
    vitrine: { from: 1190, currency: "EUR" as const },
    surMesure: { from: 3900, typicalMin: 5000, typicalMax: 9000, currency: "EUR" as const },
    maintenance: { monthly: 79, currency: "EUR" as const },
  },
} as const;

export type SiteConfig = typeof siteConfig;
```

Avant de committer : vérifier l'email réel (`grep -rn "@" src/components/sections/Contact.tsx src/messages/fr.json | grep -i mail`) et corriger la valeur.

- [ ] **Step 5 : Vérifier et committer**

Run : `pnpm test && pnpm exec tsc --noEmit`
Expected : PASS, 0 erreur TS sur les fichiers créés.

```bash
git add package.json pnpm-lock.yaml vitest.config.ts src/data/siteConfig.ts src/data/__tests__/siteConfig.test.ts
git commit -m "feat(config): config de site centralisée + outillage vitest"
```

---

### Task 2 : Remplacer GA4 par Vercel Analytics + Speed Insights (zéro cookie)

**Files:**
- Modify: `src/app/layout.tsx` (retirer GoogleAnalytics, ajouter Analytics + SpeedInsights)
- Delete: `src/components/GoogleAnalytics.tsx`
- Rewrite: `src/hooks/useAnalytics.ts`
- Modify: call sites — `src/components/ui/ContactForm.tsx`, `src/components/sections/Contact.tsx`, `src/components/sections/Projects.tsx`, `src/components/sections/Hero.tsx`
- Modify: config CSP (localiser : `grep -rn "google-analytics\|gtag\|Content-Security" next.config.* vercel.json src/proxy.ts 2>/dev/null`)

**Interfaces:**
- Produces: `useAnalytics()` renvoie `{ trackEvent }` avec :
  ```ts
  type EventName =
    | "brief_start" | "brief_step" | "brief_submit"
    | "contact_submit" | "tel_click" | "whatsapp_click"
    | "google_review_click" | "project_view" | "cta_brief_click";
  trackEvent(name: EventName, props?: Record<string, string | number>): void
  ```
  Toutes les tâches UI suivantes utilisent CETTE signature.

- [ ] **Step 1 : Réécrire le hook**

`src/hooks/useAnalytics.ts` :

```ts
"use client";

import { track } from "@vercel/analytics";

export type EventName =
  | "brief_start" | "brief_step" | "brief_submit"
  | "contact_submit" | "tel_click" | "whatsapp_click"
  | "google_review_click" | "project_view" | "cta_brief_click";

export function useAnalytics() {
  function trackEvent(name: EventName, props?: Record<string, string | number>) {
    track(name, props);
  }
  return { trackEvent };
}
```

Adapter les 4 call sites existants à cette signature (lire chaque fichier, remplacer l'appel GA par `trackEvent("<event du mapping ci-dessus>")` — mapper l'ancien nom d'événement GA vers l'EventName le plus proche ; si aucun ne correspond, étendre l'union plutôt que d'envoyer une string libre).

- [ ] **Step 2 : Root layout**

Dans `src/app/layout.tsx` : supprimer l'import et le rendu de `GoogleAnalytics`, ajouter :

```tsx
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
// ...dans le <body>, après {children} :
<Analytics />
<SpeedInsights />
```

Supprimer `src/components/GoogleAnalytics.tsx`. Retirer les domaines gtag/google-analytics de la CSP localisée au préalable (et vérifier que `va.vercel-scripts.com` n'est pas bloqué par la CSP — si la CSP liste les script-src, ajouter ce domaine).

- [ ] **Step 3 : Vérifier**

Run : `grep -rn "gtag\|GoogleAnalytics\|GA_MEASUREMENT" src/ && echo "RESTES" || echo "PROPRE"` — Expected : PROPRE.
Run : `pnpm exec tsc --noEmit && pnpm build` — Expected : succès.

- [ ] **Step 4 : Commit**

```bash
git add -A
git commit -m "feat(analytics): Vercel Analytics + Speed Insights, suppression GA4 (zéro cookie)"
```

---

### Task 3 : Offres (3) et moteur d'estimation du brief

**Files:**
- Create: `src/data/offers.ts`
- Create: `src/lib/estimate.ts`
- Create: `src/lib/__tests__/estimate.test.ts`
- Note: `src/data/services.ts` reste en place (consommé par les landings) jusqu'à la Task 10.

**Interfaces:**
- Consumes: `siteConfig.prices` (Task 1) ; types `BriefData`, `ProjectType` de `src/data/briefTypes.ts` (existant — lire ce fichier d'abord pour les valeurs exactes de `ProjectType` et la forme de `BriefFeatures`).
- Produces:
  ```ts
  // offers.ts
  export interface Offer { id: "vitrine" | "sur-mesure" | "maintenance"; icon: string;
    priceFrom: number; monthly?: number; delayWeeks?: [number, number]; }
  export const offers: Offer[];
  // Les libellés/descriptions/inclus vivent dans messages/{fr,en}.json sous "offers.items.<id>.*"
  // estimate.ts
  export function estimateFromBrief(data: Pick<BriefData, "projectType" | "features">): { min: number; max: number };
  ```

- [ ] **Step 1 : Tests échouants de l'estimation**

`src/lib/__tests__/estimate.test.ts` — adapter les valeurs de `projectType` aux littéraux réels de `briefTypes.ts` après lecture :

```ts
import { describe, it, expect } from "vitest";
import { estimateFromBrief } from "@/lib/estimate";

describe("estimateFromBrief", () => {
  it("un site vitrine simple part du prix d'appel", () => {
    const r = estimateFromBrief({ projectType: "vitrine", features: { selected: [], other: "" } } as never);
    expect(r.min).toBe(1190);
    expect(r.max).toBeGreaterThanOrEqual(1500);
  });
  it("chaque fonctionnalité cochée augmente la fourchette", () => {
    const base = estimateFromBrief({ projectType: "vitrine", features: { selected: [], other: "" } } as never);
    const plus = estimateFromBrief({ projectType: "vitrine", features: { selected: ["a", "b", "c"], other: "" } } as never);
    expect(plus.min).toBeGreaterThan(base.min);
    expect(plus.max).toBeGreaterThan(base.max);
  });
  it("une application sur mesure part de 3900 minimum", () => {
    const r = estimateFromBrief({ projectType: "application", features: { selected: [], other: "" } } as never);
    expect(r.min).toBeGreaterThanOrEqual(3900);
  });
  it("arrondit à la centaine", () => {
    const r = estimateFromBrief({ projectType: "vitrine", features: { selected: ["a"], other: "" } } as never);
    expect(r.min % 100).toBe(0);
    expect(r.max % 100).toBe(0);
  });
});
```

Run : `pnpm test` — Expected : FAIL (`estimate.ts` inexistant).

- [ ] **Step 2 : Implémenter estimate.ts + offers.ts**

`src/lib/estimate.ts` (logique : base par type de projet depuis `siteConfig.prices`, +15 % du prix de base par fonctionnalité cochée sur le min, +25 % sur le max, arrondi à la centaine ; lire `briefTypes.ts` et faire correspondre les VRAIS littéraux `ProjectType` — si les valeurs réelles diffèrent de "vitrine"/"application", utiliser les réelles dans le code ET les tests) :

```ts
import { siteConfig } from "@/data/siteConfig";
import type { BriefData } from "@/data/briefTypes";

const round100 = (n: number) => Math.round(n / 100) * 100;

export function estimateFromBrief(
  data: Pick<BriefData, "projectType" | "features">
): { min: number; max: number } {
  const p = siteConfig.prices;
  const isApp = data.projectType !== "vitrine"; // ajuster selon les littéraux réels de ProjectType
  const baseMin = isApp ? p.surMesure.from : p.vitrine.from;
  const baseMax = isApp ? p.surMesure.typicalMin : 1500;
  const featureCount = data.features?.selected?.length ?? 0;
  const min = baseMin * (1 + 0.15 * featureCount);
  const max = baseMax * (1 + 0.25 * featureCount);
  return { min: round100(min), max: round100(Math.max(max, min * 1.25)) };
}
```

`src/data/offers.ts` :

```ts
import { siteConfig } from "@/data/siteConfig";

export interface Offer {
  id: "vitrine" | "sur-mesure" | "maintenance";
  icon: string;
  priceFrom: number;
  monthly?: number;
  delayWeeks?: [number, number];
}

export const offers: Offer[] = [
  { id: "vitrine", icon: "globe", priceFrom: siteConfig.prices.vitrine.from, delayWeeks: [2, 3] },
  { id: "sur-mesure", icon: "layout", priceFrom: siteConfig.prices.surMesure.from, delayWeeks: [4, 8] },
  { id: "maintenance", icon: "tool", priceFrom: 0, monthly: siteConfig.prices.maintenance.monthly },
];
```

- [ ] **Step 3 : Vérifier et committer**

Run : `pnpm test && pnpm exec tsc --noEmit` — Expected : PASS.

```bash
git add src/data/offers.ts src/lib/estimate.ts src/lib/__tests__/estimate.test.ts
git commit -m "feat(offres): 3 offres tarifées + moteur d'estimation du brief"
```

---

### Task 4 : [DESIGN — coordinateur] Tokens typo/motion et langage « chantier »

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/lib/motion.ts` (enregistrement GSAP centralisé)
- Create: `src/components/ui/Reveal.tsx`

**Interfaces:**
- Produces (utilisés par TOUTES les tâches design suivantes) :
  - Classes CSS : `.display-2xl` (clamp 2.5rem→4.5rem, weight 700, letter-spacing -0.03em), `.display-xl`, `.annotation` (JetBrains Mono, 0.75rem, uppercase, letter-spacing 0.08em, `--foreground-secondary`), `.annotation-accent` (idem, couleur `--accent`), `.proof` (valeur chiffrée en accent), `.tag-chantier` (étiquette bordée façon plan).
  - `<Reveal>` : wrapper client `{ children, delay?: number }` — révélation au scroll unique et sobre (opacity + translateY 16px, 0.5s), inerte si `prefers-reduced-motion`.
  - `src/lib/motion.ts` : `export { gsap, useGSAP }` après `gsap.registerPlugin(useGSAP)` — SEUL point d'import GSAP de l'app.

**Procédure impérative :** invoquer `frontend-design` + `gsap-skills:gsap-react` + Context7 (gsap) AVANT d'écrire le code. Ajouter la police JetBrains Mono via `next/font` dans `src/app/layout.tsx` (variable `--font-jetbrains-mono`), comme Space Grotesk existant.

- [ ] **Step 1 :** Invoquer les skills, lire `globals.css` en entier, écrire tokens + classes + Reveal + motion.ts. Ne PAS supprimer les keyframes existants (encore consommés) — le nettoyage est en Task 12.
- [ ] **Step 2 :** Page de test visuel jetable non commitée (`src/app/[locale]/design-test/page.tsx`) montrant chaque token ; vérifier en light/dark et reduced-motion via chrome-devtools (`emulate`), puis supprimer la page.
- [ ] **Step 3 :** Run `pnpm exec tsc --noEmit && pnpm build` — Expected : succès. Commit :

```bash
git add src/app/globals.css src/lib/motion.ts src/components/ui/Reveal.tsx src/app/layout.tsx
git commit -m "feat(design): tokens chantier, annotations mono, Reveal et socle GSAP"
```

---

### Task 5 : [DESIGN — coordinateur] Navigation + Footer

**Files:**
- Rewrite: `src/components/ui/Navigation.tsx`
- Rewrite: `src/components/sections/Footer.tsx`
- Modify: `src/messages/fr.json` + `src/messages/en.json` (clés `nav.*`, `footer.*`)

**Interfaces:**
- Consumes: `siteConfig` (T1), `useAnalytics` (T2), tokens (T4).
- Produces: liens de nav vers `/#projets`, `/services`, `/tarifs` (page créée en T9 — le lien peut atterrir 404 en dev jusqu'à T9, acceptable), `/a-propos`, `/#contact` + CTA `brief`.

**Spécification :** CTA principal « Estimer mon projet — 3 min » (accent, `trackEvent("cta_brief_click", { from: "nav" })`) ; lien tel visible desktop (`tel:` + `trackEvent("tel_click", { from: "nav" })`) ; menu mobile plein écran sobre ; footer avec NAP complet (JBR Development, Lille, `siteConfig.phoneDisplay`, email), lien avis Google (`google_review_click`), liens légaux existants conservés, langue + thème conservés.

- [ ] **Step 1 :** Invoquer `frontend-design`, lire les composants actuels, réécrire.
- [ ] **Step 2 :** Vérif chrome-devtools : desktop 1440, mobile 375, clavier (tab visible), light/dark. `pnpm build` OK.
- [ ] **Step 3 :** Commit `feat(nav): navigation orientée conversion + footer NAP`.

---

### Task 6 : [DESIGN — coordinateur] Hero « chantier vivant » (GSAP)

**Files:**
- Rewrite: `src/components/sections/Hero.tsx`
- Create: `src/components/hero/ChantierScene.tsx` (client)
- Modify: `src/messages/fr.json` / `en.json` (clés `hero.*`)

**Interfaces:**
- Consumes: `src/lib/motion.ts` (T4 — unique import GSAP), `siteConfig`, `useAnalytics`.
- Produces: rien de consommé ailleurs.

**Spécification (validée en brainstorm) :**
- Séquence orchestrée ~4 s au chargement : un mini-site de commerce lillois passe par 3 états — wireframe tracé (traits pointillés) → design habillé (blocs gris charte) → site fini (accents émeraude + « en ligne ✓ »). Éléments = DOM/SVG légers exclusivement (AUCUNE image lourde ni vidéo ; le LCP doit rester le H1).
- Titre : « Votre site pourrait se construire là, sous vos yeux. » + sous-titre bénéfice TPE + CTA brief et lien tel visibles DÈS la première frame (aucun contenu d'action n'attend la fin de l'animation).
- Bouton « rejouer » discret (`.annotation`). `prefers-reduced-motion` : rendre directement l'état final statique, aucune timeline.
- Timeline unique `gsap.timeline()` via `useGSAP` avec cleanup automatique ; pas de ScrollTrigger ici.

**Procédure impérative :** Context7 gsap (`useGSAP`, timeline, reduced motion) + `gsap-skills:gsap-react` + `gsap-skills:gsap-performance` AVANT d'écrire. `frontend-design` pour la scène.

- [ ] **Step 1 :** Skills + docs, puis implémenter.
- [ ] **Step 2 :** Vérifs chrome-devtools : screenshot des 3 états, émulation reduced-motion (état final direct), mobile 375 (scène lisible ou simplifiée), trace performance (`performance_start_trace`) — LCP < 2 s en local.
- [ ] **Step 3 :** `pnpm build` OK. Commit `feat(hero): hero chantier vivant GSAP avec fallback reduced-motion`.

---

### Task 7 : [DESIGN — coordinateur] Bandeau de preuve + Mur de preuves (fusion Projects/Testimonial)

**Files:**
- Create: `src/components/sections/ProofStrip.tsx`
- Rewrite: `src/components/sections/Projects.tsx` → mur de preuves (cartes histoires)
- Modify: `src/data/projects.ts` (enrichissement)
- Modify: `src/app/[locale]/page.tsx` (ordre : Hero, ProofStrip, Projects, Services, Process, FAQ, Contact ; retirer `<About />` de la home si redondant avec a-propos, retirer `<Testimonial />`)
- Delete: `src/components/sections/Testimonial.tsx` (contenu absorbé)
- Modify: `src/messages/fr.json` / `en.json`

**Interfaces:**
- Consumes: `siteConfig`, tokens T4, `Reveal`.
- Produces: `Project` étendu — champs ajoutés à l'interface existante de `src/data/projects.ts` :
  ```ts
  clientName: string;      // "Thierry Dehon" | "REV Comptabilité" | "Nicolas Steinberg"
  clientRole: string;      // "Gérant de RDP Glass" etc. (reprendre messages/fr.json testimonial.items)
  quote: string;           // citation Google réelle (reprendre testimonial.items.*.quote + quoteHighlight)
  googleReviewUrl: string; // liens share.google existants
  problem: string;         // 1-2 phrases : le problème du patron
  delivered: string;       // 1-2 phrases : ce qui a été livré, sans jargon
  result: string;          // le résultat concret mesurable
  ```
  Remplir ces champs pour les 3 projets en réutilisant les témoignages EXISTANTS de `messages/fr.json` (clé `testimonial.items`) — ne rien inventer : si un « résultat chiffré » n'existe pas, utiliser un fait vrai (ex. Steinberg : « Lighthouse 97/100, site livré en 3 semaines »).

**Spécification :** ProofStrip = bande fine sous le hero : « ★ 5,0 sur Google · 3 entreprises accompagnées · Lille et métropole · réponse sous 24 h » (chiffres en `.proof`, lien avis → `google_review_click`). Mur de preuves = 3 cartes horizontales alternées : screenshot du site (image existante `/projects/*.webp` via `next/image`) + histoire Problème → Livré → Résultat (annotations `.tag-chantier` « livré le… ») + citation client avec lien Google. Lien vers `/projets/[slug]`.

- [ ] **Step 1 :** `frontend-design`, enrichir `projects.ts`, créer les composants, câbler la home.
- [ ] **Step 2 :** Vérifs chrome-devtools (desktop/mobile/dark/light) ; `grep -rn "Testimonial" src/` → PROPRE ; `pnpm exec tsc --noEmit && pnpm build` OK.
- [ ] **Step 3 :** Commit `feat(preuves): bandeau et mur de preuves, fusion témoignages/projets`.

---

### Task 8 : [DESIGN — coordinateur] Offres affichées + Process chantier + FAQ anti-objections + CTA réutilisable

**Files:**
- Rewrite: `src/components/sections/Services.tsx` → section Offres (3 cartes tarifées depuis `offers.ts`)
- Rewrite: `src/components/sections/Process.tsx` (4 phases façon chantier : 1 Devis & plan, 2 Fondations & design, 3 Construction, 4 Remise des clés & entretien)
- Rewrite: `src/components/sections/FAQ.tsx` + contenu
- Create: `src/components/ui/BriefCTA.tsx` (bloc CTA réutilisable)
- Modify: `src/app/[locale]/page.tsx` (insérer `<BriefCTA />` après le mur de preuves et après la FAQ)
- Modify: `src/messages/fr.json` / `en.json`

**Interfaces:**
- Consumes: `offers` (T3), `siteConfig`, `useAnalytics`, tokens.
- Produces: `<BriefCTA from="home-proof" | "home-faq" | string />` — titre + bouton brief (`cta_brief_click` avec `{ from }`) + rappel tel/WhatsApp (`tel_click`/`whatsapp_click`).

**Contenu FAQ (fr, 6 entrées — recopier tel quel dans fr.json, adapter en.json)** :
1. « Combien ça coûte, concrètement ? » → grille + renvoi /tarifs + brief pour estimation immédiate.
2. « Combien de temps ça prend ? » → vitrine 2-3 semaines, sur-mesure 4-8, planning fixé au devis.
3. « Je n'y connais rien en technique, c'est un problème ? » → non : interlocuteur unique, zéro jargon, formation à la remise des clés.
4. « Qui s'occupe du site après la mise en ligne ? » → maintenance 79 €/mois : hébergement, mises à jour, évolutions mineures.
5. « Pourquoi pas Wix ou un site généré par IA ? » → honnête : pour démarrer seul c'est valable ; ce que ça ne fait pas : sur-mesure, SEO local sérieux, un humain responsable du résultat.
6. « Travaillez-vous uniquement à Lille ? » → métropole en présentiel, toute la France à distance.

- [ ] **Step 1 :** `frontend-design`, réécrire les 4 composants + contenu.
- [ ] **Step 2 :** Vérifs chrome-devtools + `pnpm build` OK. Prix affichés = valeurs `offers.ts` (aucun prix en dur dans le JSX).
- [ ] **Step 3 :** Commit `feat(home): offres tarifées, process chantier, FAQ anti-objections, CTA brief`.

---

### Task 9 : [DESIGN — coordinateur] Page /tarifs + SEO associé

**Files:**
- Create: `src/app/[locale]/tarifs/page.tsx`
- Create: `src/components/tarifs/PricingTable.tsx`, `src/components/tarifs/PricingFAQ.tsx`
- Modify: `src/app/sitemap.ts` (ajouter /tarifs fr+en)
- Modify: `src/messages/fr.json` / `en.json` (`tarifs.*`)

**Interfaces:**
- Consumes: `offers`, `siteConfig`, `BriefCTA` (T8), tokens.
- Produces: route `/{locale}/tarifs`.

**Spécification :**
- Metadata : title « Tarifs — création de site internet à Lille dès 1 190 € | JBR Development », description avec prix, canonical + alternates fr/en (copier le pattern de `src/app/[locale]/page.tsx:17-34`).
- Contenu : H1 orienté requête (« Tarifs clairs, sans surprise »), grille 3 offres avec « inclus » détaillés, encart honnête « à partir de : qu'est-ce qui fait varier le prix ? », comparatif 3 segments (DIY/IA ~0-200 €, low-cost 300-1 500 €, JBR sur-mesure) présenté SANS dénigrement, FAQ prix (4 questions), `BriefCTA from="tarifs"`.
- JSON-LD dans la page (script `application/ld+json`) : `Service` + `offers` avec `priceSpecification` :

```tsx
const offersJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "JBR Development",
  url: "https://jbrdevelopment.fr",
  telephone: "+33618972250",
  makesOffer: [
    { "@type": "Offer", name: "Site vitrine (création ou refonte)",
      priceSpecification: { "@type": "PriceSpecification", price: 1190, priceCurrency: "EUR", valueAddedTaxIncluded: false } },
    { "@type": "Offer", name: "Application ou outil sur mesure",
      priceSpecification: { "@type": "PriceSpecification", price: 3900, priceCurrency: "EUR", valueAddedTaxIncluded: false } },
    { "@type": "Offer", name: "Maintenance et accompagnement",
      priceSpecification: { "@type": "UnitPriceSpecification", price: 79, priceCurrency: "EUR", unitText: "mois", valueAddedTaxIncluded: false } },
  ],
};
```

- [ ] **Step 1 :** `frontend-design`, créer la page + composants + sitemap.
- [ ] **Step 2 :** Vérifs : chrome-devtools, validation JSON-LD (coller dans https://validator.schema.org via WebFetch ou vérification manuelle de structure), `pnpm build`, `curl localhost:3000/fr/tarifs` en dev → 200.
- [ ] **Step 3 :** Commit `feat(tarifs): page tarifs avec grille, FAQ prix et JSON-LD Offer`.

---

### Task 10 : [DESIGN — coordinateur] Refonte /projets/[slug], /services et 4 landings au nouveau langage

**Files:**
- Rewrite: `src/app/[locale]/projets/[slug]/page.tsx` (format histoire : problème → livré → résultat, citation Google, `next/image`, maillage vers /tarifs + /brief)
- Modify: `src/app/[locale]/services/page.tsx` + les 4 landings (`application-web-sur-mesure`, `creation-site-internet-lille`, `developpeur-web-lille`, `freelance-react-nextjs`) : appliquer tokens/typo/CTA (`BriefCTA`), aligner tous les prix mentionnés sur `offers.ts`, renforcer l'unicité du contenu de chaque landing (aucun paragraphe dupliqué entre landings — reformuler par intention de recherche)
- Modify: `src/data/landingPages.ts` et `src/data/services.ts` si les prix/textes y vivent
- Modify: `src/messages/fr.json` / `en.json`

**Interfaces:**
- Consumes: `Project` étendu (T7), `BriefCTA` (T8), `offers` (T3).

- [ ] **Step 1 :** `frontend-design` ; lire chaque page avant réécriture ; travailler page par page (projets → services hub → 4 landings), un commit par page.
- [ ] **Step 2 :** Vérif par page : chrome-devtools + `pnpm build`. Vérifier qu'aucun prix en dur ne diverge de la grille : `grep -rn "1 190\|1190\|3 900\|3900\|79 €" src/ --include="*.tsx" --include="*.json"` — chaque occurrence JSX doit venir de `offers.ts`/`siteConfig` (les occurrences dans messages/*.json sont tolérées pour la FAQ, en cohérence avec la grille).
- [ ] **Step 3 :** Commits `feat(projets|services|landing): ...` par page.

---

### Task 11 : [DESIGN — coordinateur] /a-propos + brief wizard conversion (estimation immédiate)

**Files:**
- Modify: `src/app/[locale]/a-propos/page.tsx` (photo réelle de JB via `next/image`, histoire courte ancrée Lille, renvoi preuves)
- Modify: `src/components/brief/steps/SummaryStep.tsx` (afficher l'estimation AVANT l'envoi)
- Modify: `src/components/brief/BriefWizard.tsx` (tracking : `brief_start` au premier pas, `brief_step` avec `{ step }` à chaque transition, `brief_submit` à l'envoi ; écran de succès : fourchette rappelée + tel/WhatsApp)
- Modify: `src/messages/fr.json` / `en.json`

**Interfaces:**
- Consumes: `estimateFromBrief` (T3), `useAnalytics` (T2), `siteConfig`.

**⚠ BLOQUANT ENTRANT :** demander à JB sa photo professionnelle AVANT cette tâche (question ouverte spec §13.3). Si indisponible le jour J : implémenter tout sauf le bloc photo et créer une tâche de suivi.

**Spécification estimation :** dans `SummaryStep`, avant le bouton d'envoi, encart accent : « Estimation indicative : entre {min} € et {max} € HT » (`estimateFromBrief`), avec mention « affinée dans le devis, sans engagement ». L'écran de succès la rappelle et propose l'appel direct.

- [ ] **Step 1 :** Lire `SummaryStep.tsx` et `BriefWizard.tsx` en entier, implémenter, `frontend-design` pour l'encart et a-propos.
- [ ] **Step 2 :** Test manuel complet du wizard en dev (chrome-devtools : remplir les étapes, vérifier estimation affichée et événements dans la console réseau Vercel Analytics en mode debug), `pnpm test && pnpm build` OK.
- [ ] **Step 3 :** Commits `feat(brief): estimation immédiate + tracking tunnel` et `feat(a-propos): refonte`.

---

### Task 12 : Migration next/image + nettoyage des styles morts

**Files:**
- Modify: tout `<img` restant (`grep -rn "<img" src/ --include="*.tsx"`) → `next/image` avec `width/height` ou `fill` + `sizes`
- Modify: `src/app/globals.css` — supprimer les keyframes et classes non référencés (vérifier chaque nom : `grep -rn "<nom>" src/`) ; supprimer les styles terminal/syntax (`--terminal-*`, `--syntax-*`) si plus consommés après la refonte du hero
- Delete: composants orphelins (`grep` d'usage avant chaque suppression : `SmoothScrollLink`, `useScrollAnimation`, `LandingFAQ` si absorbé…)

- [ ] **Step 1 :** Inventaire par grep, migrer les images une par une (`pnpm build` après chaque lot).
- [ ] **Step 2 :** Supprimer uniquement ce dont le grep d'usage renvoie zéro occurrence. `pnpm exec tsc --noEmit && pnpm build` — Expected : succès.
- [ ] **Step 3 :** Commit `refactor(perf): migration next/image et purge des styles hérités`.

---

### Task 13 : SEO final + vérification globale

**Files:**
- Modify: `src/components/StructuredData.tsx` : ajouter `telephone: "+33618972250"` au ProfessionalService, vérifier la cohérence NAP avec le footer (T5), mettre à jour l'ItemList des services vers les 3 offres
- Modify: `src/messages/{fr,en}.json` clé `metadata.*` : descriptions réécrites orientées bénéfice + prix
- Verify: sitemap complet (home, services, 4 landings, tarifs, projets×3, a-propos, ×2 locales)

- [ ] **Step 1 :** Implémenter les modifs SEO ci-dessus.
- [ ] **Step 2 : Batterie de vérification finale** (skill `superpowers:verification-before-completion`) :
  - `pnpm test && pnpm exec tsc --noEmit && pnpm lint && pnpm build` — tous verts.
  - chrome-devtools `lighthouse_audit` sur `/fr` et `/fr/tarifs` : Perf ≥ 90 mobile, SEO = 100, LCP < 2 s.
  - Émulation reduced-motion : hero statique. Clavier : parcours tab complet home. 375 px : aucune coupe.
  - Dark ET light sur chaque page modifiée.
- [ ] **Step 3 :** Commit `feat(seo): structured data et metadata alignés sur la nouvelle offre`. Push + déploiement préversion Vercel, revue par JB sur l'URL de preview AVANT production.

---

## Hors plan (rappels)

- Plan B (moteur de contenu /conseils + agent hebdo + Search Console) : fichier séparé.
- Ops non-code : vérification propriété Search Console, optimisation fiche Google Business — checklist dans le plan B.
- Question ouverte restante : compte/plan Vercel du site (événements custom Analytics = plan Pro ?) — à vérifier avec JB au moment de la Task 2 (fallback : pageviews seuls, événements ajoutés après upgrade).
