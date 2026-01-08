# SEO Landing Pages - Design Document

**Date:** 2026-01-08
**Status:** Approved
**Author:** Jean-Baptiste Renart + Claude

## Objectif

Créer des pages landing SEO pour améliorer le positionnement sur les requêtes commerciales locales :
- "développeur web lille"
- "création site internet lille"
- "développeur react nextjs"
- "application web sur mesure"

## Architecture

### Structure Hub & Spoke

```
/fr/services                              → Page hub (liste tous les services)
/fr/services/developpeur-web-lille        → Landing SEO local
/fr/services/creation-site-internet-lille → Landing création site
/fr/services/freelance-react-nextjs       → Landing niche technique
/fr/services/application-web-sur-mesure   → Landing apps web
```

### Navigation

- Lien "Services" dans la nav principale → page hub `/services`
- Page hub liste les 4 services avec liens vers landing pages

## Design des Landing Pages

### Section 1: Hero

- **Label accent** : uppercase, tracking-widest (ex: "DÉVELOPPEUR WEB À LILLE")
- **H1** : Mot-clé principal optimisé SEO
- **Sous-titre** : Mots-clés secondaires + proposition de valeur
- **Badge avis Google** : ★★★★★ 5/5 - 2 avis
- **2 CTA** : Primaire (Demander un devis) + Secondaire (Voir mes projets)
- **Pas de terminal animé** (réservé à la home)

### Section 2: Pourquoi Me Choisir

Grille 3x2 de cards avec arguments différenciants :
1. Basé à Lambersart - RDV présentiel possible
2. Interlocuteur unique - Échanges directs
3. Réponse sous 24h - Disponible et réactif
4. Tarifs freelance - Pas de frais d'agence
5. Accompagnement A à Z - Du brief à la mise en ligne
6. Technologies modernes - React, Next.js, TypeScript

### Section 3: Mes Services

3 cards verticales avec :
- Icône
- Titre du service
- Description
- Liste de features (✓)
- Tarif : "Sur devis - Devis gratuit sous 24h"

### Section 4: FAQ

5 questions par page en accordion (même composant que FAQ existante).

**Page developpeur-web-lille:**
1. Pourquoi choisir un développeur web à Lille ?
2. Combien coûte un site internet à Lille ?
3. Freelance ou agence web : que choisir ?
4. Quel est le délai pour créer un site web ?
5. Travaillez-vous avec des clients hors de Lille ?

**Page creation-site-internet-lille:**
1. Quel est le prix d'un site vitrine en 2025 ?
2. Que comprend la création d'un site internet ?
3. Mon site sera-t-il optimisé pour Google (SEO) ?
4. Puis-je modifier mon site moi-même après livraison ?
5. Proposez-vous un accompagnement après la mise en ligne ?

**Page freelance-react-nextjs:**
1. Pourquoi choisir Next.js plutôt que React seul ?
2. Un site Next.js est-il meilleur pour le SEO ?
3. Quelle différence entre un site WordPress et Next.js ?
4. Next.js convient-il aux petites entreprises ?
5. Combien coûte un site en React/Next.js ?

**Page application-web-sur-mesure:**
1. Qu'est-ce qu'une application web sur mesure ?
2. Quelle différence entre site web et application web ?
3. Combien coûte le développement d'une application web ?
4. Combien de temps faut-il pour développer une app web ?
5. Quelles technologies utilisez-vous ?

Schema.org FAQPage ajouté automatiquement pour rich snippets.

### Section 5: Contact

Layout 2 colonnes :
- **Gauche** : Texte + coordonnées (adresse, email jb@jbrdevelopment.fr, téléphone) + badge avis Google
- **Droite** : Formulaire de contact intégré (même composant que home)

## Contraintes Techniques

- Réutiliser les composants existants (cards, FAQ accordion, formulaire contact)
- Respecter le design system (CSS variables, Space Grotesk, animations scroll)
- Traductions fr/en via next-intl
- Schema.org JSON-LD pour chaque page (LocalBusiness + FAQPage)
- Mettre à jour le sitemap.ts

## Pages à Créer

| Fichier | Description |
|---------|-------------|
| `src/app/[locale]/services/page.tsx` | Hub services |
| `src/app/[locale]/services/developpeur-web-lille/page.tsx` | Landing 1 |
| `src/app/[locale]/services/creation-site-internet-lille/page.tsx` | Landing 2 |
| `src/app/[locale]/services/freelance-react-nextjs/page.tsx` | Landing 3 |
| `src/app/[locale]/services/application-web-sur-mesure/page.tsx` | Landing 4 |
| `src/messages/fr.json` | Ajouter traductions landing pages |
| `src/messages/en.json` | Ajouter traductions EN |
| `src/app/sitemap.ts` | Ajouter nouvelles pages |

## SEO Checklist

- [ ] H1 unique par page avec mot-clé principal
- [ ] Meta title optimisé (< 60 caractères)
- [ ] Meta description avec CTA (< 160 caractères)
- [ ] Schema.org LocalBusiness + FAQPage
- [ ] Liens internes vers home et autres services
- [ ] Images optimisées avec alt text
- [ ] URL canoniques
- [ ] Hreflang fr/en
