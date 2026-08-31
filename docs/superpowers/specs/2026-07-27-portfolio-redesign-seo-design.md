# Spec — Refonte portfolio JBR Development : design distinctif, SEO local, conversion

Date : 2026-07-27 · Validé en brainstorm avec JB

## 1. Contexte et problème

Le site https://jbrdevelopment.fr (Next.js 16 App Router, Tailwind 4, next-intl fr/en) n'a généré **aucun client ni contact** depuis sa mise en ligne. Le socle SEO technique est sain (JSON-LD géolocalisé, hreflang, sitemap, canonicals), mais :

1. Design générique (animations standards, aucune signature visuelle) et codé « développeur » (terminal, syntax highlighting) alors que la cible est non-technique.
2. Contenu sans narration ni preuve : 6 offres techniques nues, sans prix ni délais.
3. Le brief wizard (meilleur outil de conversion) est enterré en bas de page.
4. `next/image` inutilisé, perf fragile.
5. Aucune mesure du tunnel de conversion.

**Cible prioritaire : TPE/PME de Lille et sa métropole, décideurs non-techniques.**

## 2. Objectif de succès

- **2-3 leads qualifiés/mois à 6 mois** (lead = brief complété ou contact sérieux).
- Indicateurs avancés : impressions/clics Search Console, démarrages de brief, clics téléphone/WhatsApp.

## 3. Positionnement et message

**Thèse : « Le développeur lillois qui montre ses preuves et ses prix. »**

- On vend des résultats de patrons (plus de clients, du temps gagné, un interlocuteur unique à Lille), pas de la technique. Le jargon disparaît du parcours principal ; il reste en second niveau dans les études de cas.
- Ton direct, chaleureux, zéro jargon — chaque phrase compréhensible par un gérant de TPE.
- Le français devient l'unique priorité éditoriale et SEO. L'anglais reste fonctionnel, sans investissement.

## 4. Direction design : hybride « Preuve » × « Démo vivante »

**Contrainte non négociable : la charte de couleurs actuelle est conservée** (dark : fond `#1a1a1a`/`#232323`, cartes `#2a2a2a`, texte `#f5f5f5`, accent `#34d399`, hover `#10b981` ; light : blanc, accent `#047857`). Light et dark modes maintenus.

- **Typographie** : Space Grotesk conservé, passé en display XXL à letter-spacing serré pour les titres. JetBrains Mono en micro-annotations (étiquettes, légendes, mesures).
- **Langage « chantier » structurel** : sections titrées comme des phases de chantier, études de cas annotées comme des plans (traits de cote, tampons « livré le… »), brief = « le devis ». La métaphore encode le process réel, elle ne décore pas.
- **Discipline de l'émeraude** : le vert n'apparaît que sur les preuves (chiffres, avis, résultats) et les CTA. Tout le reste vit en niveaux de gris de la charte.
- **Une seule audace — le hero « chantier vivant »** : séquence orchestrée GSAP (~4 s) où le site d'un commerce lillois passe de maquette → design → site en ligne. Rejouable, CTA visible dès la première seconde, fallback statique via `prefers-reduced-motion`, éléments DOM légers (pas de vidéo). Titre : « Votre site pourrait se construire là, sous vos yeux. »
- **Motion ailleurs** : révélations au scroll discrètes + micro-interactions au survol uniquement. Suppression des fadeInUp/slideInLeft génériques actuels.
- **Images** : passage intégral à `next/image`. Vrais screenshots des sites clients dans des cadres d'appareils. Vraie photo de JB.

## 5. Structure des pages

**Accueil** (déroulé validé) :
1. Hero « chantier vivant » + CTA brief
2. Bandeau de preuve immédiat (★ 5,0 Google · clients accompagnés · Lille · réponse sous 24 h)
3. Mur de preuves : 3 études de cas racontées en histoires de patrons (problème → livré → résultat + avis Google réel)
4. Offres avec prix et délais affichés (3 offres, cf. §6)
5. Process en 4 étapes + FAQ anti-objections (« Combien ça coûte ? Et si je n'y connais rien ? Qui s'occupe du site après ? »)
6. CTA brief final

**Pages** :
- `/tarifs` — **nouvelle page**, grille des 3 offres + FAQ prix + JSON-LD `Offer`/`priceSpecification`. Cible « prix/tarif site internet Lille ».
- `/projets/[slug]` — refonte au format histoire, contenu textuel indexable renforcé.
- `/services` + 4 landing pages SEO existantes — redesignées au nouveau template, contenu renforcé (éviter l'effet doorway : contenu réellement unique par page).
- `/conseils` — **nouvelle section** d'articles (cf. §7).
- `/a-propos` — photo réelle, histoire, ancrage local.
- `/brief` — wizard conservé et promu (cf. §8), reste noindex.

## 6. Grille tarifaire (validée par étude de marché contradictoire)

Deux études (baromètres publiés + contre-vérification du marché réel bas) concluent : marché 2026 fragmenté en trois segments — IA/DIY (0-200 €), freelance low-cost (300-1 500 €, ~60 % des commandes TPE), sur-mesure crédible (1 500-8 000 €). Positionnement JBR : **jonction bas du segment sur-mesure**, intouchable par le low-cost, loin sous les agences lilloises (4 000-10 000 €).

| Offre | Prix affiché | Projet type |
|---|---|---|
| Site vitrine — création ou refonte (5 pages, SEO inclus) | **dès 1 190 € HT** | ~1 500 € |
| Application / outil sur mesure | **dès 3 900 € HT** | 5 000 – 9 000 € |
| Maintenance & accompagnement | **79 € HT/mois** | — |

Création et refonte fusionnées volontairement (une TPE ne voit pas la différence) ; « dès » protège les cas complexes. Montants finaux ajustables par JB avant mise en ligne.

## 7. SEO

**Conservé** : JSON-LD (ProfessionalService géolocalisé, Person, WebSite, BreadcrumbList), hreflang, sitemap, robots, canonicals.

**Ajouts** :
- Page `/tarifs` (intention d'achat maximale, concurrents muets sur les prix).
- Études de cas enrichies + maillage interne vers `/tarifs` et `/brief`.
- **Moteur de contenu semi-automatique (option A validée)** : un agent planifié rédige chaque semaine un article `/conseils` ciblé TPE lilloise, ouvre une PR ; JB relit (~10-15 min) et merge ; déploiement auto. JSON-LD `Article`. Sujets guidés par les données Search Console (boucle fermée). Jamais de publication sans validation humaine.
- **SEO local hors-site** : optimisation fiche Google Business Profile (catégories, posts réguliers préparés par l'agent, photos, demande d'avis systématique post-projet), cohérence NAP.
- **Search Console** : vérification de propriété, soumission sitemap, rapport mensuel automatisé (requêtes montantes, pages à retravailler).
- **Perf** : `next/image` partout, budget LCP < 2 s (hero compris), suivi Vercel Speed Insights.

## 8. Conversion

- Brief wizard promu : « Estimer mon projet — 3 min » dans la nav, le hero et après chaque bloc de preuve.
- **Estimation immédiate à l'écran** en fin de wizard (fourchette calculée depuis les réponses et la grille §6), PDF/email conservés en suivi.
- Numéro de téléphone cliquable + bouton WhatsApp visibles, promesse « réponse sous 24 h ».

## 9. Analytics et RGPD (voie « zéro cookie » validée)

- **Suppression de GA4** (déposait des cookies sans bandeau de consentement — non conforme).
- **Vercel Web Analytics** (sans cookies, pas de bandeau) + **Vercel Speed Insights**.
- Événements custom sur tout le tunnel : `brief_start`, `brief_step_N`, `brief_submit`, `contact_submit`, `tel_click`, `whatsapp_click`, `google_review_click`. ⚠ Vérifier que le plan Vercel du site permet les événements custom (sinon : passage Pro ou fallback minimal).

## 10. Contraintes d'implémentation

- Charte de couleurs intouchable (§4).
- **GSAP niveau professionnel : doc Context7 à jour + skills GSAP officiels (core, ScrollTrigger, React, performance) obligatoires à l'implémentation** (exigence JB).
- Design UI réalisé par le coordinateur avec le skill frontend-design (jamais délégué à un subagent — règle JB).
- `prefers-reduced-motion` respecté partout ; focus clavier visible ; responsive mobile complet.
- Stack existante conservée : Next.js 16, Tailwind 4, next-intl, Resend, @vercel/blob.

## 11. Hors périmètre (YAGNI)

- CMS (le contenu reste en TS/MDX dans le repo — le pipeline PR en tient lieu).
- E-commerce, nouvelles langues, refonte éditoriale de la version EN.
- Google Ads (option future si l'objectif §2 n'est pas atteint à 6 mois).

## 12. Risques et garde-fous

| Risque | Garde-fou |
|---|---|
| Hero animé dégrade le LCP mobile | DOM léger, budget perf mesuré (Speed Insights), fallback statique |
| Landing pages perçues comme doorway | Contenu réellement unique par page, pas de génération en masse |
| Contenu IA déclassé par Google | Validation humaine systématique, ancrage dans les vrais projets clients |
| Prix publics attirent des curieux sans budget | « dès » + estimation via brief qui qualifie |

## 13. Questions ouvertes (à trancher avant ou pendant l'implémentation)

1. Montants finaux de la grille (JB confirme ou ajuste les chiffres §6).
2. Numéro de téléphone / WhatsApp à afficher publiquement.
3. Photos : JB doit fournir photo pro + éventuels visuels Lille.
4. Sur quel compte/team Vercel le site est-il déployé (absent de la team visible) et quel plan (événements analytics custom).
5. Accès Search Console : vérification de propriété à faire ensemble.
