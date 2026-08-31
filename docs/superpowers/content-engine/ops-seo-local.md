# Ops SEO local — jbrdevelopment.fr

Journal des actions SEO hors code : audits reçus, citations obtenues, Search Console, fiche Google Business. Complété au fil de l'eau, notamment lors de la boucle mensuelle (plan B, Task 5).

---

## Audit externe reçu le 31/08/2026 (prospection non sollicitée)

Email de démarchage d'un consultant SEO parisien (Recreasoft, SIREN 417 934 106, société réelle créée en 1998), annonçant « 24 pages analysées sur 47 critères », un score de 74/100 en technique et 20/100 en notoriété. Passé au crible avant toute réponse. Un constat sur trois était fondé.

### Constat fondé, corrigé

**Aucune donnée structurée dans le HTML.** Vrai et vérifié : `grep -c '<script type="application/ld+json"'` sur le HTML servi retournait **0**, alors que le code déclarait 5 schémas. Cause : `next/script` en `strategy="afterInteractive"`, qui injecte après hydratation. Corrigé sur 6 fichiers, commit `fdf5770` (plan B, Task 0). Le bug était toujours présent sur la branche `refonte-portfolio` : sans ce correctif, la refonte aurait été mergée avec le défaut.

### Constats infondés, écartés

**« Trust Flow de 0, donc Google vous fait passer derrière des concurrents. »** Le Trust Flow est une métrique propriétaire de Majestic, calculée par Majestic. Google ne l'utilise pas et ne l'a jamais utilisée. Présenter un score d'outil tiers comme la cause d'un classement Google est une confusion, volontaire ou non. **Ne pas suivre cette métrique** : suivre les impressions, positions et clics de Search Console.

**« Sans balisage, Google ne peut afficher ni vos avis, ni vos coordonnées, ni vos horaires. »** Faux pour les avis, exagéré pour le reste. Pour une entreprise locale, coordonnées et horaires affichés dans les résultats viennent de la **fiche Google Business**, pas du JSON-LD du site. Et les avis auto-déclarés en JSON-LD ne sont plus affichés depuis 2019, ce qui a d'ailleurs motivé le retrait de notre `aggregateRating`.

### Sur l'offre commerciale

L'offre portait sur « l'acquisition de liens de confiance, par lots ». Acheter des liens contredit directement les Spam Policies de Google (link spam) et expose à une dévaluation SpamBrain ou à une action manuelle. **Décision : ne pas donner suite.** Le fond de son argument reste juste (le nombre de domaines référents distincts est bien le premier frein), mais la réponse saine est la voie propre du Step 4 ci-dessous.

Note : la prospection elle-même était légale (adresse professionnelle publiée, B2B, opt-out fourni), même si le lien de désinscription paramétré (`stop.php?e=<email en base64>&s=<hash>`) montre un envoi de masse automatisé et non l'analyse manuelle annoncée.

---

## Registre des citations locales

Objectif : 10 à 15 domaines référents distincts sur 6 mois, obtenus uniquement par voie propre. Point de départ au 31/08/2026 : **2 domaines**.

| Date | Domaine | Page cible | Type | Statut |
|------|---------|-----------|------|--------|
| | | | | |

Pistes à traiter dans l'ordre : fiche Google Business, pages « réalisé par » chez les clients existants (RDP Glass, REV Comptabilité, Nicolas Steinberg), CCI Grand Lille, réseaux d'entrepreneurs locaux, annuaires professionnels légitimes, écosystème tech lillois, associations professionnelles.

---

## Search Console

À compléter lors de la Task 5, Step 1 (session avec JB) : date de vérification de la propriété, méthode, date de soumission du sitemap, état de couverture.

## Fiche Google Business

À compléter lors de la Task 5, Step 2 : catégorie principale, description, photos, premier post, modèle de demande d'avis post-projet.

## Boucle mensuelle

Chaque 1er du mois, 15 min : lecture du rapport Search Console (requêtes en hausse, pages faibles), mise à jour des priorités du calendrier éditorial, mise à jour du registre de citations ci-dessus.
