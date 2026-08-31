# Plan B — Moteur de contenu /conseils + boucle SEO locale

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Prérequis :** Plan A terminé (tokens design T4, BriefCTA T8, nav T5). Les tâches marquées **[DESIGN — coordinateur]** suivent la même règle que le plan A (skill `frontend-design`, jamais de subagent).

**Goal:** Une section `/conseils` alimentée chaque semaine par un agent qui rédige en PR, JB valide en 10 minutes, et la donnée Search Console guide les sujets.

**Architecture:** Articles MDX dans `content/conseils/*.mdx` (frontmatter + corps), lus par un module `src/lib/conseils.ts` (fs + compilation MDX côté RSC). Pages App Router `/conseils` et `/conseils/[slug]` avec JSON-LD Article. Un agent planifié (Claude Code routine hebdo) rédige un brouillon en branche + PR. Ops : Search Console vérifiée, fiche Google Business optimisée.

**Tech Stack:** next-mdx-remote (RSC) ou équivalent validé via Context7 au moment de l'implémentation, gray-matter, vitest.

**Spec:** `docs/superpowers/specs/2026-07-27-portfolio-redesign-seo-design.md` (§7)

## Global Constraints

- Mêmes contraintes globales que le plan A (charte, copy FR d'abord, pnpm, commits sans Claude).
- **Jamais de publication sans validation humaine** : l'agent ne merge JAMAIS ses propres PR.
- Chaque article : ≥ 800 mots utiles, ancré dans le réel (projets clients, contexte lillois), maillage interne vers `/tarifs` et `/brief`, zéro remplissage IA générique.
- **JSON-LD toujours rendu côté serveur** : balise `<script type="application/ld+json">` native dans le composant, **jamais `next/script`**. `next/script` injecte après hydratation : le JSON-LD reste absent du HTML source et invisible pour tout crawler qui n'exécute pas le JS. C'est la seule forme recommandée par la doc Next.js (`next/script` est conçu pour du JS exécutable, pas pour des données). Garde-fou automatique : `src/lib/__tests__/structured-data.test.ts`.
- **Aucun avis auto-attribué** dans les données structurées (`aggregateRating` ou `Review` que l'on se décerne soi-même) : Google ne les affiche pas depuis 2019 et peut sanctionner la pratique. La note vient de la fiche Google Business.
- Français uniquement pour /conseils (pas de version EN — hors périmètre spec §11) : les pages /conseils ne rendent que la locale fr ; en anglais, la section n'apparaît pas dans la nav.

---

### Task 0 : Données structurées rendues côté serveur — FAIT (31/08/2026)

Déclenché par un audit externe non sollicité (prospection SEO) dont le seul constat fondé était : aucune donnée structurée dans le HTML de jbrdevelopment.fr. Vérifié, confirmé, corrigé. Les deux autres constats du même audit étaient infondés (voir `docs/superpowers/content-engine/ops-seo-local.md`).

**Diagnostic :** les 5 schémas de `StructuredData.tsx` et les schémas `FAQPage`/`Person` de 5 pages passaient par `next/script` en `strategy="afterInteractive"`. Mesure sur le HTML prérendu : **0 balise `<script type="application/ld+json">`**. Le JSON-LD n'existait que comme descripteur de composant dans le payload RSC.

**Livré (commit `fdf5770`) :**
- [x] Bascule des 6 fichiers sur la balise `<script>` native. Après : 5 schémas sur l'accueil, 6 sur les pages internes, tous JSON valides.
- [x] Retrait de l'`aggregateRating` auto-attribué (5/5 sur 3 avis) de `StructuredData.tsx`.
- [x] Retrait du bloc `offersJsonLd` de `/tarifs` : redondant avec `StructuredData` sous le même `@id`, et non localisé — sur `/en/tarifs` il injectait des noms d'offres en français en conflit avec ceux du layout.
- [x] Test de non-régression `src/lib/__tests__/structured-data.test.ts`, vérifié failing puis passing. Il couvre aussi les futures pages `/conseils` de la Task 2.

**Reste ouvert (hors périmètre de ce plan) :** `src/context/ThemeProvider.tsx:19` fait échouer `pnpm lint` (`react-hooks/set-state-in-effect`). Erreur antérieure à ce correctif, à traiter quand on ouvrira ce fichier.

---

### Task 1 : Infrastructure MDX + module conseils

**Files:**
- Modify: `package.json` (deps MDX — **vérifier via Context7 la lib recommandée pour App Router RSC en Next 16** avant d'installer ; candidat par défaut : `next-mdx-remote` + `gray-matter`)
- Create: `content/conseils/.gitkeep`, `src/lib/conseils.ts`, `src/lib/__tests__/conseils.test.ts`, `content/conseils/exemple-fixture.mdx` (fixture de test, préfixée `_` ou filtrée si draft)

**Interfaces:**
- Produces:
  ```ts
  export interface ArticleMeta { slug: string; title: string; description: string;
    date: string; /* ISO */ keywords: string[]; draft?: boolean; }
  export function getAllArticles(): ArticleMeta[]           // triés date desc, drafts exclus
  export function getArticle(slug: string): { meta: ArticleMeta; content: string } | null
  ```
  Frontmatter MDX obligatoire : `title`, `description`, `date`, `keywords`, optionnel `draft: true`.

- [ ] **Step 1 : Tests échouants** — `src/lib/__tests__/conseils.test.ts` :

```ts
import { describe, it, expect } from "vitest";
import { getAllArticles, getArticle } from "@/lib/conseils";

describe("conseils", () => {
  it("liste les articles non-draft triés du plus récent au plus ancien", () => {
    const all = getAllArticles();
    expect(all.length).toBeGreaterThanOrEqual(1);
    const dates = all.map((a) => a.date);
    expect([...dates].sort().reverse()).toEqual(dates);
    expect(all.every((a) => !a.draft)).toBe(true);
  });
  it("retourne null pour un slug inconnu", () => {
    expect(getArticle("nexiste-pas")).toBeNull();
  });
  it("retourne meta + contenu pour un slug existant", () => {
    const first = getAllArticles()[0];
    const art = getArticle(first.slug);
    expect(art?.meta.title).toBeTruthy();
    expect(art?.content.length).toBeGreaterThan(100);
  });
});
```

Run `pnpm test` → FAIL. Créer la fixture MDX (200 mots minimum, frontmatter complet).

- [ ] **Step 2 : Implémenter `src/lib/conseils.ts`** — `fs.readdirSync(path.join(process.cwd(), "content/conseils"))`, filtre `.mdx`, `gray-matter` pour le frontmatter, slug = nom de fichier sans extension. Aucune compilation MDX ici (le rendu se fait dans la page) — ce module ne fait que lister/lire.
- [ ] **Step 3 :** `pnpm test && pnpm exec tsc --noEmit` → PASS. Commit `feat(conseils): module de lecture des articles MDX`.

---

### Task 2 : [DESIGN — coordinateur] Pages /conseils et /conseils/[slug]

**Files:**
- Create: `src/app/[locale]/conseils/page.tsx` (index), `src/app/[locale]/conseils/[slug]/page.tsx`
- Create: `src/components/conseils/ArticleCard.tsx`
- Modify: `src/app/sitemap.ts` (articles dynamiques via `getAllArticles()`, fr uniquement), `src/components/ui/Navigation.tsx` (lien « Conseils », fr uniquement), `src/messages/fr.json`

**Interfaces:**
- Consumes: `getAllArticles`/`getArticle` (T1), tokens plan A, `BriefCTA`.

**Spécification :**
- Index : H1 « Conseils pour votre présence en ligne », annotation chantier, cartes (titre, description, date), metadata + canonical.
- Article : rendu MDX (lib validée Context7), typo lisible (mesure ~70ch), sommaire si ≥ 4 H2, `BriefCTA from="conseils"` en fin, date de publication visible, JSON-LD :

```tsx
const articleJsonLd = (meta: ArticleMeta) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: meta.title,
  description: meta.description,
  datePublished: meta.date,
  inLanguage: "fr-FR",
  author: { "@type": "Person", name: "Jean-Baptiste Renart", url: "https://jbrdevelopment.fr/fr/a-propos" },
  publisher: { "@type": "Organization", name: "JBR Development" },
  mainEntityOfPage: `https://jbrdevelopment.fr/fr/conseils/${meta.slug}`,
});
```

- Locale en : `generateStaticParams` ne produit que fr pour ces routes ; accès direct `/en/conseils` → `notFound()`.
- `generateStaticParams` sur [slug] depuis `getAllArticles()` ; `dynamicParams = false`.

- [ ] **Step 1 :** Context7 (lib MDX choisie) + `frontend-design`, implémenter.
- [ ] **Step 2 :** Vérifs : chrome-devtools (index + article, mobile/desktop/dark/light), `pnpm build` (routes statiques générées), sitemap contient l'article fixture ? → NON : exclure les fixtures/drafts du sitemap (test manuel).
- [ ] **Step 3 :** Commit `feat(conseils): pages index et article avec JSON-LD`.

---

### Task 3 : Trois premiers articles (socle de lancement)

**Files:**
- Create: `content/conseils/combien-coute-un-site-internet-lille-2026.mdx`
- Create: `content/conseils/fiche-google-business-tpe-10-minutes.mdx`
- Create: `content/conseils/site-wix-ia-ou-sur-mesure-que-choisir.mdx`
- Delete: `content/conseils/exemple-fixture.mdx` (remplacer la fixture des tests par un des vrais articles)

**Rédaction par le coordinateur** (ton du site, spec §3) : chaque article ≥ 800 mots, structure H2/H3, chiffres réels de l'étude de marché commanditée (segments DIY 0-200 €, low-cost 300-1 500 €, sur-mesure 1 500-8 000 €, grille JBR), exemples ancrés (RDP Glass, REV Comptabilité — sans divulguer d'info privée), maillage vers `/tarifs` et `/brief`, keywords frontmatter alignés sur l'intention (« prix site internet Lille », « fiche Google Business artisan », « wix ou développeur »).

- [ ] **Step 1 :** Rédiger les 3 articles, frontmatter daté du jour de rédaction.
- [ ] **Step 2 :** `pnpm test && pnpm build` → PASS (tests conseils passent sur les vrais articles). Relecture JB des 3 articles AVANT commit (gate humain — le premier contenu donne le ton du moteur).
- [ ] **Step 3 :** Commit `content(conseils): trois articles de lancement`.

---

### Task 4 : Agent hebdomadaire de rédaction (routine planifiée)

**Files:**
- Create: `docs/superpowers/content-engine/calendrier-editorial.md` (backlog de 12 sujets priorisés avec intention de recherche + angle + maillage cible)
- Create: `docs/superpowers/content-engine/routine-hebdo-prompt.md` (prompt versionné de la routine)
- Setup: routine cloud via le skill `schedule` (hebdo, ex. lundi 08h00 Europe/Paris)

**Spécification du prompt de routine (contenu de routine-hebdo-prompt.md, à recopier dans la routine)** :

```
Tu travailles sur le repo Portfolio (jbrdevelopment.fr). Mission hebdomadaire :
1. Lis docs/superpowers/content-engine/calendrier-editorial.md et prends le premier sujet non traité.
2. Lis 2 articles existants dans content/conseils/ pour capter le ton (direct, zéro jargon, ancré Lille/TPE, pas de tirets longs).
3. Rédige l'article MDX complet (≥ 800 mots, frontmatter title/description/date/keywords, maillage interne /tarifs et /brief, aucun fait inventé : si tu cites un chiffre, source-le ou utilise ceux de docs/superpowers/specs/2026-07-27-portfolio-redesign-seo-design.md §6).
4. Coche le sujet dans le calendrier éditorial.
5. Crée une branche conseils/<slug>, commit (sans mention d'IA), push, ouvre une PR titrée "content(conseils): <titre>" avec un résumé de 3 lignes et la mention "Relecture requise avant merge".
6. NE MERGE JAMAIS. Si le calendrier est vide, ouvre une PR qui ajoute 4 nouveaux sujets proposés au calendrier à la place.
```

- [ ] **Step 1 :** Rédiger le calendrier éditorial (12 sujets : prix/coûts, Google Business, choix de solution, erreurs de site TPE, SEO local par métier — expert-comptable, artisan, commerce…, maintenance/sécurité, brief efficace).
- [ ] **Step 2 :** Invoquer le skill `schedule` pour créer la routine hebdo avec le prompt ci-dessus. Vérifier la première exécution en la déclenchant manuellement (run once) et relire la PR produite avec JB.
- [ ] **Step 3 :** Commit des deux docs `docs(content-engine): calendrier éditorial et prompt de routine`.

---

### Task 5 : Ops — Search Console + fiche Google Business (avec JB)

Pas de code : session guidée avec JB, résultats consignés dans `docs/superpowers/content-engine/ops-seo-local.md`.

- [ ] **Step 1 : Search Console** — vérifier la propriété `jbrdevelopment.fr` (JB a les accès ; méthode domaine via DNS de préférence), soumettre `sitemap.xml`, contrôler couverture/indexation des nouvelles pages (/tarifs, /conseils), demander l'indexation manuelle des pages clés.
- [ ] **Step 2 : Fiche Google Business** — catégorie principale « Concepteur de sites Web », description avec mots-clés locaux, lien vers /tarifs, ajout de photos, publier un premier post (réutiliser l'article 1), activer la collecte d'avis : modèle de message de demande d'avis post-projet consigné dans le doc ops.
- [ ] **Step 4 : Citations locales (domaines référents)** — le site n'est cité que par 2 domaines, ce qui est effectivement le premier frein sur les requêtes concurrentielles. Voie propre uniquement, **aucun lien acheté ni échangé par lots** (contraire aux Spam Policies de Google, risque de dévaluation ou d'action manuelle) : fiche Google Business, annuaires professionnels légitimes, CCI Grand Lille et réseaux d'entrepreneurs locaux, pages « réalisé par » chez les clients existants (RDP Glass, REV Comptabilité, Nicolas Steinberg), associations professionnelles, écosystème tech lillois. Cible réaliste : 10 à 15 domaines distincts sur 6 mois. Consigner chaque citation obtenue dans le doc ops (date, domaine, page cible, type). Ne PAS suivre le Trust Flow : métrique propriétaire Majestic, pas un signal Google — suivre les impressions et positions Search Console.
- [ ] **Step 3 : Boucle mensuelle** — consigner la procédure : chaque 1er du mois, session de 15 min (JB + agent) : lecture du rapport Search Console (requêtes en hausse, pages faibles), mise à jour des priorités du calendrier éditorial en conséquence. Automatisation complète (API GSC) = amélioration future, hors périmètre.

---

## Definition of done (plan B)

- `/conseils` en ligne avec 3 articles réels, JSON-LD valide, sitemap à jour.
- Routine hebdo active ayant produit au moins 1 PR relue et mergée par JB.
- Search Console vérifiée avec sitemap soumis ; fiche Google Business optimisée.
