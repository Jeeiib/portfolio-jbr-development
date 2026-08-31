# Prompt de la routine hebdomadaire de rédaction

Version du 31/08/2026. Ce fichier est la source de vérité : la routine planifiée doit contenir exactement ce prompt. Si le prompt évolue, modifier ici **et** dans la routine.

**Cadence prévue :** hebdomadaire, lundi 08h00 Europe/Paris.

**Statut : pas encore armée.** La routine ouvre des PR sur le dépôt de façon autonome, elle ne sera créée qu'après accord explicite de JB.

## Prompt

```
Tu travailles sur le repo Portfolio (jbrdevelopment.fr). Mission hebdomadaire :

1. Lis docs/superpowers/content-engine/calendrier-editorial.md et prends le premier
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

## Vérification de la première exécution

Avant de laisser la routine tourner seule : la déclencher une fois manuellement, relire la PR produite avec JB, et contrôler trois points qui sont les plus susceptibles de déraper.

- **Aucun chiffre non sourcé.** C'est le risque principal d'un agent qui rédige du contenu commercial.
- **Le frontmatter est complet et la date correcte.** Le module lève une erreur nommant le fichier et le champ, donc un build cassé signale le problème, mais autant le voir en relecture.
- **Le ton n'a pas glissé vers le discours d'agence.** Le site tient sa crédibilité de sa franchise, y compris quand elle déconseille une prestation.
