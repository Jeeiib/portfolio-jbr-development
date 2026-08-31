# Prompt de la routine hebdomadaire de rédaction

Version du 31/08/2026. Ce fichier est la source de vérité : la routine planifiée doit contenir exactement ce prompt. Si le prompt évolue, modifier ici **et** dans la routine.

**Cadence prévue :** hebdomadaire, lundi 08h00 Europe/Paris.

**Statut : armée le 31/08/2026.** Routine `trig_01MLSRD1ZXuf1iNSQkmmGQ4c`, cron `0 6 * * 1` (lundi 8h à Paris en heure d'été), environnement `Default`, modèle `claude-sonnet-5`, outils Bash/Read/Write/Edit/Glob/Grep. Sa création exigeait de connecter le compte GitHub à claude.ai, sans quoi l'API renvoie `401`.

Le prompt ci-dessous a été durci pour la création : ajout de `pnpm install` avant les tests, et rappel que le JSON-LD doit rester en balise `<script>` native, son test de non-régression ne devant pas être contourné.

## Prompt

```
Tu travailles sur le repo Portfolio (jbrdevelopment.fr). Mission hebdomadaire :

0. PUBLIE L'ARTICLE DE LA SEMAINE PRECEDENTE. Avant de rediger quoi que ce soit,
   liste les PR ouvertes dont la branche commence par conseils/ :
   `gh pr list --state open --json number,headRefName,createdAt,comments,reviews`.
   Pour chaque PR ouverte depuis au moins 6 jours :
   - Si la CI est verte (`gh pr checks <n>`) et qu'elle ne porte AUCUN commentaire
     ni review, fusionne-la : `gh pr merge <n> --squash --delete-branch`. C'est la
     publication de la semaine, elle n'attend aucune validation supplementaire.
   - Si la CI est rouge, ou si la PR porte le moindre commentaire ou review, NE LA
     FUSIONNE PAS : quelqu'un a quelque chose a dire. Signale-le dans ton resume
     final et passe a la suite.
   Une PR ouverte depuis moins de 6 jours reste en attente : son delai de relecture
   n'est pas ecoule. Une PR fermee a la main est un refus, ne la reouvre jamais.


1. Ensuite, lis docs/superpowers/content-engine/calendrier-editorial.md et prends le premier
   sujet non coché, dans l'ordre. Ne choisis pas un sujet plus loin dans la liste.

2. Lis deux articles existants de content/conseils/ pour capter le ton : direct,
   zéro jargon, ancré Lille et TPE/PME, honnête y compris quand la réponse
   n'est pas de vendre une prestation. Pas de tirets longs. Pas d'emoji.

3. Rédige l'article MDX complet dans content/conseils/<slug>.mdx :
   - frontmatter obligatoire : title, description, date (YYYY-MM-DD, date du jour),
     keywords (liste de chaînes). Un champ manquant fait échouer le build.
   - au moins 800 mots utiles et au moins 4 titres de niveau H2, pour que le
     sommaire de la page s'affiche.
   - maillage interne vers /fr/tarifs et /fr/brief, plus les liens indiqués dans
     la ligne du calendrier.
   - AUCUN fait ni chiffre inventé. Les seuls chiffres utilisables sans source
     externe sont ceux du dépôt : segments de marché de tarifs.compare dans
     src/messages/fr.json, grille 1 190 / 3 900 / 79 € HT, délais 2-3 semaines
     (vitrine) et 4-8 semaines (sur-mesure), réponse sous 24 h, devis sous 48 h.
     Voir aussi docs/superpowers/specs/2026-07-27-portfolio-redesign-seo-design.md §6.
     Si tu as besoin d'une statistique que tu ne peux pas sourcer, remplace-la par
     un raisonnement. Ne cite un client que sur ce qui est déjà public sur le site.

4. Lance `pnpm test` et `pnpm build`. Les deux doivent passer avant de committer.

5. Coche le sujet dans le calendrier éditorial, dans le même commit que l'article.

6. Crée une branche conseils/<slug>, commit sans aucune mention d'IA ni
   co-auteur, pousse, et ouvre une PR titrée "content(conseils): <titre>" avec
   un résumé de trois lignes et la mention "Relecture requise avant merge".

7. NE MERGE JAMAIS ta propre PR. Si le calendrier ne contient plus de sujet non
   coché, n'invente pas de sujet : ouvre à la place une PR qui ajoute quatre
   sujets proposés au calendrier, tirés des requêtes en hausse de Search Console.
```

## Ce qui autorise la publication

La relecture humaine n'est plus un passage obligé, parce qu'elle est encodée en tests. `.github/workflows/ci.yml` lance typage, lint, tests et build sur chaque PR, et `src/lib/__tests__/conseils-conformite.test.ts` vérifie, pour chaque article publié : au moins 800 mots et 4 sections, maillage vers `/fr/tarifs` et `/fr/brief`, liens internes pointant vers des routes réelles, aucun tiret long, aucun emoji, un frontmatter exploitable pour le SEO, et surtout **aucun montant en euros absent de la liste blanche du dépôt**. Ce dernier test est la protection principale contre l'invention de chiffres : il a d'ailleurs attrapé un « 0 à 20 000 € » que j'avais écrit moi-même dans l'article sur les prix.

À l'ouverture d'une PR `conseils/*`, et seulement si ces vérifications passent, un job envoie un mail à `jb@jbrdevelopment.fr` via Resend annonçant l'article et la date de publication automatique. Fermer la PR ou la commenter suffit à bloquer la publication.

## Vérification de la première exécution

Avant de laisser la routine tourner seule : la déclencher une fois manuellement, relire la PR produite avec JB, et contrôler trois points qui sont les plus susceptibles de déraper.

- **Aucun chiffre non sourcé.** C'est le risque principal d'un agent qui rédige du contenu commercial.
- **Le frontmatter est complet et la date correcte.** Le module lève une erreur nommant le fichier et le champ, donc un build cassé signale le problème, mais autant le voir en relecture.
- **Le ton n'a pas glissé vers le discours d'agence.** Le site tient sa crédibilité de sa franchise, y compris quand elle déconseille une prestation.
