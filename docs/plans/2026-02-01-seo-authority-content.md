# Plan SEO - Autorité & Contenu

**Date:** 2026-02-01
**Status:** En cours
**Author:** Jean-Baptiste Renart + Claude

## Objectif Principal

**Apparaître en première position sur "Jean-Baptiste Renart"** et améliorer le référencement global sur les termes clés (développeur web Lille, freelance React, etc.)

## Diagnostic Actuel

| Aspect | État | Score |
|--------|------|-------|
| Technique (robots, sitemap, schema) | Excellent | 9/10 |
| On-page (meta, titles, H1) | Bon | 7/10 |
| Autorité externe (backlinks) | Critique | 2/10 |
| Contenu (pages indexables) | Faible | 4/10 |
| Visibilité Google | Critique | 2/10 |

**Problème principal** : Le site a d'excellentes bases techniques mais manque d'autorité externe et de contenu.

---

## Phase 1 : Actions Manuelles (Hors Code)

### 1.1 Google Search Console
- [ ] Vérifier que le site est bien indexé
- [ ] Soumettre manuellement le sitemap si nécessaire
- [ ] Analyser les requêtes de recherche actuelles

### 1.2 LinkedIn (15 min)
- [ ] Ajouter le lien https://jbrdevelopment.fr dans le profil
- [ ] Mettre à jour le titre : "Développeur Web Freelance | JBR Development"
- [ ] Ajouter une publication épinglée présentant le site

### 1.3 Plateformes Freelance
- [ ] Malt.fr - Créer profil complet
- [ ] Welovedevs.com - Créer profil
- [ ] Free-Work.com - Créer profil
- [ ] Collective.work - Créer profil

### 1.4 Demander des Avis Clients
- [ ] Contacter Jay
- [ ] Contacter Nicolas Steinberg
- [ ] Contacter RDP Glass
- [ ] Créer Google Business Profile

---

## Phase 2 : Implémentation Code

### 2.1 Page "À Propos" Dédiée

**Statut:** [x] Terminé

**Fichier:** `src/app/[locale]/a-propos/page.tsx`

**Objectif:** Page dédiée optimisée pour "Jean-Baptiste Renart"

**Contenu requis:**
- [x] Title : "Jean-Baptiste Renart | Développeur Web Freelance Lille"
- [x] H1 : "Jean-Baptiste Renart"
- [x] Biographie détaillée (500+ mots)
- [x] Parcours professionnel (timeline animée)
- [x] Compétences techniques (section Stack)
- [x] Valeurs et approche (3 piliers)
- [x] Photo professionnelle
- [x] Liens sociaux (LinkedIn, GitHub)
- [x] Schema.org Person enrichi

**Fichiers créés/modifiés:**
- [x] `src/app/[locale]/a-propos/page.tsx` - Page principale
- [x] `src/components/about/AboutTimeline.tsx` - Timeline animée
- [x] `src/messages/fr.json` - namespace "aboutPage"
- [x] `src/messages/en.json` - namespace "aboutPage"
- [x] `src/components/sections/About.tsx` - Ajout lien "En savoir plus"

---

### 2.2 Blog

**Statut:** [ ] Non commencé

**Structure:**
```
src/app/[locale]/blog/
├── page.tsx          # Liste des articles
└── [slug]/
    └── page.tsx      # Article individuel

src/data/
└── blogPosts.ts      # Données des articles

src/components/blog/
├── BlogCard.tsx      # Carte article pour la liste
└── BlogPost.tsx      # Composant article complet
```

**Fichiers à créer:**
- [ ] `src/app/[locale]/blog/page.tsx`
- [ ] `src/app/[locale]/blog/[slug]/page.tsx`
- [ ] `src/data/blogPosts.ts`
- [ ] `src/components/blog/BlogCard.tsx`
- [ ] `src/components/blog/BlogPost.tsx`
- [ ] `src/messages/fr.json` - ajouter section "blog"
- [ ] `src/messages/en.json` - ajouter section "blog"

**Articles prioritaires à rédiger (après implémentation):**
1. "Guide : Créer un site internet à Lille en 2026"
2. "React vs Next.js : Quel framework choisir ?"
3. "Combien coûte un site web sur mesure ?"
4. "SEO pour les PME : Les bases essentielles"
5. "Pourquoi choisir un développeur freelance ?"

---

### 2.3 Navigation

**Statut:** [x] Partiellement fait

**Fichier:** `src/components/ui/Navigation.tsx`

**Modifications:**
- [x] Lien "À Propos" existant (ancre `#a-propos` vers teaser homepage)
- [x] Lien "Découvrir mon parcours" ajouté dans la section About → page dédiée
- [ ] Ajouter lien "Blog" (quand blog implémenté)

---

### 2.4 Sitemap

**Statut:** [x] Terminé pour À Propos

**Fichier:** `src/app/sitemap.ts`

**Modifications:**
- [x] Ajouter `/fr/a-propos` et `/en/a-propos`
- [ ] Ajouter `/fr/blog` et `/en/blog`
- [ ] Ajouter les articles de blog dynamiquement

---

### 2.5 Structured Data

**Statut:** [x] Terminé pour À Propos

**Fichier:** `src/app/[locale]/a-propos/page.tsx` (inline)

**Ajouts:**
- [ ] Schema Article pour les articles de blog
- [ ] Schema BreadcrumbList amélioré
- [x] Schema Person enrichi pour la page À Propos

---

## Phase 3 : Contenu & Backlinks (Post-Code)

### 3.1 Rédiger les articles de blog
| Article | Mots-clés cibles | Statut |
|---------|------------------|--------|
| Guide création site Lille | création site internet lille | [ ] |
| React vs Next.js | développeur react, next.js freelance | [ ] |
| Coût site web | prix site internet, devis site web | [ ] |
| SEO pour PME | référencement lille, seo local | [ ] |
| Développeur freelance | freelance vs agence | [ ] |

### 3.2 Obtenir des backlinks
| Source | Type | Statut |
|--------|------|--------|
| LinkedIn | Profil | [ ] |
| GitHub | Profil | [ ] |
| Malt | Profil | [ ] |
| Pages Jaunes | Annuaire | [ ] |
| Guest posts | Contenu | [ ] |

---

## Vérification Finale

### Tests à effectuer après implémentation
- [x] `npm run build` - Build passe (31 pages générées)
- [ ] `npm run start` - Tester en local
- [x] Vérifier `/fr/a-propos` - Page générée
- [ ] Vérifier `/fr/blog` - Non implémenté
- [x] Valider `/sitemap.xml` - Page À Propos ajoutée
- [ ] Tester structured data : https://validator.schema.org/
- [ ] Lighthouse SEO score : objectif 100/100

---

## Résultats Attendus

| Délai | Résultat |
|-------|----------|
| 1 semaine | Profils créés sur Malt, LinkedIn optimisé |
| 2 semaines | Page À Propos + Blog en ligne |
| 4 semaines | 5 articles publiés, premiers backlinks |
| 8 semaines | Apparition sur "Jean-Baptiste Renart" |
| 12 semaines | Top 10 sur "développeur web lille" |

---

## Journal d'Implémentation

### Session 1 - 2026-02-01
- Création du document de plan
- Exploration du codebase existant

### Session 2 - 2026-02-01 (suite)
- Brainstorming positionnement : "L'exigence 5 étoiles appliquée au code"
- Prototypage timeline (5 versions itératives)
- Implémentation page À Propos complète :
  - `src/app/[locale]/a-propos/page.tsx` - Page principale avec Hero, Timeline, Approach, Stack, CTA
  - `src/components/about/AboutTimeline.tsx` - Timeline animée au scroll avec effet ripple
  - Traductions FR/EN ajoutées (namespace `aboutPage`)
  - Schema.org Person enrichi
  - Sitemap mis à jour
  - Lien "Découvrir mon parcours" ajouté dans section About homepage

**Prochaine étape:** Implémenter le blog ou tester la page en local

---

## Notes Techniques

### Patterns identifiés
- [x] Structure des pages : Server Components async avec `params: Promise<>`
- [x] Système de traduction : next-intl avec `getTranslations()` côté serveur, `useTranslations()` côté client
- [x] Composants réutilisables : Navigation, Footer, sections
- [x] Style CSS : Tailwind + CSS variables pour theming (dark/light)
- [x] Animations : CSS transitions + IntersectionObserver pour scroll-triggered

### Dépendances
- [ ] Vérifier les dépendances pour le blog (MDX?) - À explorer dans prochaine session
