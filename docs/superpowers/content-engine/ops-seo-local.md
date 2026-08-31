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

À faire en session avec JB, qui a les accès. Rien de tout cela n'est utile avant le déploiement de la refonte.

1. **Vérifier la propriété** en méthode domaine (enregistrement DNS), pas en préfixe d'URL : la méthode domaine couvre `jbrdevelopment.fr`, `www`, http et https d'un coup, ce qui évite d'avoir quatre propriétés à surveiller.
2. **Soumettre le sitemap** `https://jbrdevelopment.fr/sitemap.xml`. Il est servi en 200 sur le domaine canonique, vérifié le 31/08/2026.
3. **Demander l'indexation** des pages qui comptent, une par une : `/fr/tarifs`, `/fr/conseils` et les trois articles, `/fr/services/developpeur-web-lille`, `/fr/services/creation-site-internet-lille`.
4. **Contrôler la couverture** une semaine plus tard : pages indexées contre pages soumises, et lire les motifs d'exclusion. Les `/en/conseils` doivent apparaître en 404 volontaires, ce n'est pas une anomalie à corriger.

À consigner ici : date de vérification, méthode retenue, date de soumission du sitemap, nombre de pages indexées au premier relevé.

## Fiche Google Business

Le levier le plus rentable et le plus rapide, indépendant du site. À faire en session avec JB.

1. **Catégorie principale** : « Concepteur de sites Web ». Secondaires possibles : « Service informatique », « Consultant en informatique ». La principale décide de l'essentiel des requêtes sur lesquelles la fiche sort.
2. **Zone desservie** : Lille, Lambersart, Wambrechies, Saint-André-lez-Lille, Marcq-en-Baroeul, La Madeleine. Des communes réelles, pas « France entière », qui dilue.
3. **Description** : ce qui est fait et où, en langage de client, avec les mots-clés locaux et un lien vers `/fr/tarifs`.
4. **Photos** : réalisations et portrait plutôt que le logo seul, ajoutées régulièrement plutôt qu'en une seule fois.
5. **Premier post** : réutiliser l'article sur la fiche Google Business, qui traite précisément ce sujet.
6. **Cohérence des informations** avec le site : même écriture du nom, même numéro, même adresse partout. C'est un signal de confiance, et c'est aussi ce que le JSON-LD `ProfessionalService` déclare désormais.

### Modèle de demande d'avis après projet

À envoyer juste après la livraison, quand le client est content, jamais des semaines plus tard. Le lien direct vers le formulaire d'avis compte plus que le texte : chaque clic en moins double les chances de réponse.

> Bonjour [prénom],
>
> Content que le site vous plaise et qu'il soit en ligne.
>
> Si vous avez deux minutes, un avis Google m'aiderait beaucoup : c'est ce que regardent les entreprises qui me contactent avant de me faire confiance. Le lien va directement sur le formulaire : [lien]
>
> Et si quelque chose bouge sur le site, écrivez-moi, je regarde.
>
> Bonne journée,
> Jean-Baptiste

## Boucle mensuelle

Chaque 1er du mois, 15 min avec JB :

1. Lire le rapport Search Console : requêtes en hausse, pages qui reçoivent des impressions sans clic (titre ou description à retravailler), pages sans impression du tout.
2. Réordonner le calendrier éditorial en conséquence : un sujet qui correspond à une requête déjà en impressions passe devant.
3. Mettre à jour le registre de citations ci-dessus, et relancer une piste ouverte.

L'automatisation complète via l'API Search Console reste une amélioration future, hors périmètre.
