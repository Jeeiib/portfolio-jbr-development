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

## Après le déploiement du 31/08/2026

La refonte a été mergée (PR #2, 42 commits) et déployée en production. Vérifications faites sur `jbrdevelopment.fr` :

**JSON-LD confirmé en production**, ce qui clôt le sujet ouvert par l'audit : 5 blocs sur l'accueil, `/fr/conseils` et `/fr/tarifs`, 6 sur un article (le schéma `Article` en plus), tous valides au parsing, aucun `aggregateRating` nulle part, et plus de doublon d'offres sur `/en/tarifs`. Point de départ : zéro balise.

**Vercel Analytics opérationnels.** L'écran « Get Started » a disparu, remplacé par des données réelles. La cause était bien que `main` n'embarquait pas `@vercel/analytics` (elle utilisait encore GA4) : rien à corriger, seulement à déployer.

**Sitemap** renvoyé après déploiement : les pages découvertes passent de 20 à **26**, les quatre URL de `/conseils` y figurent.

**Indexation demandée** pour six pages, toutes placées en file d'exploration prioritaire : `/fr`, `/fr/tarifs`, `/fr/conseils` et les trois articles. À recontrôler dans une semaine dans le rapport d'indexation.

**Premier post publié sur la fiche Google**, sur l'article des prix, avec bouton « En savoir plus » vers l'article. En attente de validation. Les horaires posés plus tôt sont désormais actifs sur la fiche (« Ouvert, ferme à 18:00 »).

**Routine hebdomadaire : bloquée, pas armée.** La création échoue en `401` avec « Connect your GitHub account before saving a routine that uses a GitHub repository ». Il faut connecter le compte GitHub à claude.ai (installer l'app GitHub via https://claude.ai/code/onboarding?magic=github-app-setup), ce qui est une autorisation personnelle. Le prompt est prêt et validé dans `routine-hebdo-prompt.md`, la cadence retenue est `0 6 * * 1` (lundi 8h à Paris en heure d'été, 7h en heure d'hiver). À créer dès la connexion faite.

## Relevé Search Console du 31/08/2026

Premier état des lieux mesuré, avant tout déploiement de la refonte.

**Accès :** propriété de type domaine `sc-domain:jbrdevelopment.fr`, déjà vérifiée, sur le compte **renartjeanbaptiste@gmail.com**. Attention, ce n'est pas le compte par défaut du navigateur (`hey@jay-assistant.fr` n'y a pas accès) : utiliser `/u/1/` dans les URL Search Console.

**Trafic :** **8 clics** au total sur les trois derniers mois (29/05 au 21/08). C'est le chiffre qui objective le « zéro client via le site ».

**Indexation : 13 pages indexées contre 28 non indexées.** Motifs :

| Motif | Pages | Lecture |
|---|---|---|
| Explorée, actuellement non indexée | 18 | Le vrai problème. Google a vu ces pages et juge qu'elles ne valent pas d'être indexées. Se corrige par le contenu et l'autorité, pas par la technique. |
| Page avec redirection | 4 | Anciennes URL sans préfixe de langue (`/projets/jay`), d'avant l'i18n. Normal après migration. |
| Page en double, canonique refusée par Google | 4 | `/fr` et les trois pages projets. Nos canoniques sont pourtant correctes (vérifiées en prod). Google préfère la racine, la redirection `/` vers `/fr` étant un 307 temporaire. |
| Introuvable (404) | 2 | Anciennes URL. |

**Sitemap :** soumis le 8 janvier 2026 mais **plus relu depuis le 27 janvier**, sept mois de crawl à l'arrêt. **Renvoyé le 31/08/2026**, relu immédiatement : les pages découvertes passent de 18 à 20. À renvoyer de nouveau après le déploiement, il contiendra alors `/conseils` et les articles.

**Actions manuelles : aucun problème détecté.** Aucune sanction Google, malgré l'`aggregateRating` auto-attribué qui était déclaré dans le code. Il n'a jamais été vu par Google, faute d'être rendu dans le HTML.

**Liens externes : 17 liens depuis 6 domaines référents.**

| Domaine | Liens |
|---|---|
| revcomptabilite.fr | 9 |
| linkedin.com | 4 |
| crunchbase.com | 1 |
| github.com | 1 |
| nicolassteinberg.com | 1 |
| yhype.me | 1 |

**Ce relevé contredit le démarchage du 31/08**, qui annonçait « 2 domaines référents pour 2 liens ». Google en voit six, et 17 liens. Sa mesure venait de Majestic, qui ne crawle qu'une fraction du web. À retenir : les chiffres d'autorité d'un outil tiers ne décrivent pas ce que Google connaît.

Autre enseignement : les deux clients qui citent le site (revcomptabilite.fr et nicolassteinberg.com) pèsent 10 des 17 liens. La piste « pages réalisé par chez les clients » du registre ci-dessous est donc la plus productive, et elle est déjà amorcée.

**Technique vérifiée saine :** canoniques et hreflang corrects sur la prod, sitemap et robots.txt servis en 200 sur le domaine canonique, aucun lien interne non préfixé dans le code. Il n'y a rien à réparer côté technique hors le JSON-LD déjà corrigé.

## Reste à faire en session

## Search Console

À faire en session avec JB, qui a les accès. Rien de tout cela n'est utile avant le déploiement de la refonte.

1. **Vérifier la propriété** en méthode domaine (enregistrement DNS), pas en préfixe d'URL : la méthode domaine couvre `jbrdevelopment.fr`, `www`, http et https d'un coup, ce qui évite d'avoir quatre propriétés à surveiller.
2. **Soumettre le sitemap** `https://jbrdevelopment.fr/sitemap.xml`. Il est servi en 200 sur le domaine canonique, vérifié le 31/08/2026.
3. **Demander l'indexation** des pages qui comptent, une par une : `/fr/tarifs`, `/fr/conseils` et les trois articles, `/fr/services/developpeur-web-lille`, `/fr/services/creation-site-internet-lille`.
4. **Contrôler la couverture** une semaine plus tard : pages indexées contre pages soumises, et lire les motifs d'exclusion. Les `/en/conseils` doivent apparaître en 404 volontaires, ce n'est pas une anomalie à corriger.

À consigner ici : date de vérification, méthode retenue, date de soumission du sitemap, nombre de pages indexées au premier relevé.

## Fiche Google Business

**État constaté le 31/08/2026 :** la fiche **JBR DEVELOPMENT** existe, est revendiquée (des réponses du propriétaire figurent sous les avis) et porte déjà la bonne catégorie principale, « Concepteur de sites Web ». Le point 1 ci-dessous est donc déjà fait.

**Blocage d'accès :** la fiche n'apparaît ni sur `hey@jay-assistant.fr` ni sur `renartjeanbaptiste@gmail.com` (zéro établissement sur les deux). Elle est gérée depuis un troisième compte Google, probablement `jbr.development.pro@gmail.com`. Il faut s'y connecter pour continuer.

**Fait le 31/08/2026** (compte `jbr.development.pro@gmail.com`, `business.google.com/u/2/`) :

- [x] **Horaires ajoutés** : la fiche était en « ouvert sans horaires standards », donc n'affichait aucun horaire, et Google le signalait comme information manquante. Posés lundi-vendredi 9h-18h, samedi et dimanche fermés, à l'identique de ce que déclare `StructuredData.tsx`. En attente de validation Google.
- [x] **Trois services ajoutés** : « Création de site vitrine », « Refonte de site internet » et « Référencement local Google ». Les sept services présents (développement d'applications, applications mobiles, logiciels, e-commerce, maintenance, conseil, design/UX) ne mentionnaient pas l'offre d'appel, ce qui est le comble pour un site vitrine à 1 190 €.
- [x] **Description ajoutée au service Maintenance** : hébergement, mises à jour, sauvegardes, évolutions mensuelles, réponse sous 24 h, 79 € HT par mois sans engagement. Le prix reste hors du champ « Prix », qui n'exprime pas de périodicité et laisserait croire à un montant unique.

**Déjà en place, rien à faire** : catégorie principale « Concepteur de sites Web », description complète avec mots-clés locaux, téléphone, site web, LinkedIn, adresse, photos (logo et devanture), 3 avis 5/5 (Nicolas Steinberg, Thierry Dehon, Corinne Renart pour le cabinet comptable), 301 interactions clients et 80 vues le mois dernier.

- [x] **Zones desservies corrigées** : la fiche déclarait « France », l'erreur exacte que décrit l'article sur la fiche Google. Une zone nationale dilue le signal local sans rien apporter, une fiche ne sortant jamais sur « développeur web Paris ». Remplacée par **Métropole Européenne de Lille** (arbitrage de JB du 31/08 : toute la métropole plutôt qu'une liste de communes), ce qui couvre les 95 communes en une seule entrée. Le travail à distance hors métropole reste porté par la description et le site.

**À faire après le déploiement :** le premier post de la fiche, qui doit pointer vers un article de `/conseils` (inutile tant que la section n'est pas en ligne).

Le levier le plus rentable et le plus rapide, indépendant du site.

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

---

## Test du circuit de notification

PR jetable ouverte le 31/08/2026 sur une branche `conseils/` pour valider que le job de notification envoie bien le mail via Resend une fois le secret `RESEND_API_KEY` posé dans les secrets Actions du dépôt. Cette PR n'apporte aucun contenu et doit être fermée après vérification.
