# Questionnaire Client (Brief) — Design Spec

> Système de questionnaire intelligent intégré au portfolio JBR Development pour recueillir les besoins des prospects de manière structurée.

---

## Contexte

Quand un prospect manifeste son intérêt pour un projet (rencontre en personne, réseau, LinkedIn, contact via le site...), le freelance lui envoie manuellement le lien vers un questionnaire en ligne. C'est un lien unique permanent (`/brief`) que le freelance copie-colle et envoie par le canal de son choix (SMS, WhatsApp, email, LinkedIn...). Ce questionnaire structure la collecte des besoins dès le premier contact et remplace les allers-retours initiaux. Le brief généré sert de base à l'estimation et à la proposition commerciale.

## Objectifs

- Recueillir un brief client structuré et complet en une seule passe
- Adapter les questions au type de projet (logique conditionnelle)
- Envoyer un récapitulatif PDF au client et au freelance par email
- Offrir une expérience professionnelle et accessible aux non-techniques

## Contraintes

- Intégré au portfolio existant (Next.js 16, Tailwind CSS 4, next-intl)
- Page non indexée, non accessible depuis la navigation — accès par lien direct uniquement
- Bilingue FR/EN
- Zéro base de données — sauvegarde locale (localStorage) + email (Resend)
- Design via `impeccable:frontend-design`

---

## Architecture

### Hébergement

Module hybride intégré au portfolio. Ses propres composants et données, mais partage le stack, le déploiement Vercel, et le système i18n.

### Structure des fichiers

```
src/
├── app/[locale]/brief/
│   └── page.tsx                  # Page du wizard (noindex, nofollow)
├── app/api/brief/
│   ├── route.ts                  # API soumission : validation, génération PDF, envoi emails
│   └── upload/
│       └── route.ts              # API upload : stockage fichier dans Vercel Blob
├── components/brief/
│   ├── BriefWizard.tsx           # Orchestrateur du wizard multi-étapes
│   ├── steps/
│   │   ├── ProjectTypeStep.tsx   # Step 1 : choix du type de projet
│   │   ├── CompanyStep.tsx       # Step 2 : informations entreprise
│   │   ├── GoalsStep.tsx         # Step 3 : objectifs du projet
│   │   ├── FeaturesStep.tsx      # Step 4 : fonctionnalités (conditionnel)
│   │   ├── DesignStep.tsx        # Step 5 : identité visuelle
│   │   ├── ContentStep.tsx       # Step 6 : contenu existant
│   │   ├── BudgetStep.tsx        # Step 7 : budget et délais
│   │   └── SummaryStep.tsx       # Step 8 : récapitulatif + coordonnées + envoi
│   └── ui/
│       ├── StepIndicator.tsx     # Barre de progression visuelle
│       ├── ChipSelect.tsx        # Sélection multiple (pills/tags)
│       ├── SingleSelect.tsx      # Sélection unique (boutons)
│       └── FileUpload.tsx        # Upload de fichiers (drag & drop)
├── data/
│   └── briefQuestions.ts         # Questions, options, conditions — données séparées
└── messages/
    ├── fr.json                   # + clés "brief.*"
    └── en.json                   # + clés "brief.*"
```

### Séparation données/présentation

`briefQuestions.ts` centralise toute la configuration du questionnaire : questions, options de réponse, conditions d'affichage, champs obligatoires/optionnels. Les composants Step ne contiennent que la logique de rendu — ils lisent les données et les affichent. Ce pattern est cohérent avec `services.ts` et `landingPages.ts`.

---

## Parcours utilisateur (Wizard multi-étapes)

### Step 1 — Type de projet

Le client choisit parmi 7 types de projet. Ce choix conditionne le reste du parcours.

| Type | Steps affichés | Variante Step 4 |
|------|----------------|-----------------|
| Site vitrine | 2, 3, 4, 5, 6 (complet), 7, 8 | Site vitrine |
| Application web | 2, 3, 4, 5, 6 (allégé), 7, 8 | App web |
| Application mobile | 2, 3, 4, 5, 6 (allégé), 7, 8 | App mobile |
| Développement sur mesure | 2, 3, 4, 7, 8 | Dev sur mesure |
| Landing page | 2, 3, 4, 5, 6 (complet), 7, 8 | Landing page |
| Refonte de site | 2, 3, 4, 5, 6 (complet + Q3), 7, 8 | Refonte |
| Maintenance | 2, 3, 4, 7, 8 | Maintenance |

### Step 2 — Votre entreprise (commun)

1. Nom de l'entreprise ou du projet (texte, obligatoire, max 100 caractères)
2. Description de l'activité (textarea, obligatoire, max 2000 caractères, avec exemple)
3. Cible / utilisateurs (textarea, obligatoire, max 2000 caractères, avec exemple)
4. Site web existant ? (oui/non → si oui, champ URL, validation format URL)
5. Sites d'inspiration (textarea, optionnel, max 2000 caractères)

### Step 3 — Vos objectifs (commun)

1. Objectif principal (choix multiples prédéfinis + "Autre" avec champ libre) : Être visible en ligne, Gagner des clients, Automatiser des tâches, Remplacer un outil existant, Proposer un service aux clients, Lancer un nouveau produit
2. Problème à résoudre (textarea, obligatoire, max 3000 caractères, avec exemple)
3. Critère de succès — "Si le projet est réussi, ça ressemble à quoi ?" (textarea, obligatoire, max 3000 caractères)

### Step 4 — Fonctionnalités (conditionnel)

#### Variante Site vitrine
1. Pages souhaitées (choix multiples) : Accueil, À propos, Services, Portfolio, Blog, Contact, FAQ, Mentions légales, Autre
2. Fonctionnalités (choix multiples) : Formulaire contact, Prise de RDV, Google Maps, Galerie photos, Avis clients, Réseaux sociaux, Newsletter, Chat, SEO, Multilingue, Autre
3. Autonomie sur le contenu (choix unique) : Oui / Non / Je ne sais pas
4. Autre chose ? (textarea, optionnel, max 3000 caractères)

#### Variante Application web
1. Description d'une journée type d'utilisation (textarea, obligatoire, max 5000 caractères, avec exemple)
2. Types d'utilisateurs (choix multiples) : Administrateur (vous), Employés / collaborateurs, Clients (espace client), Partenaires / fournisseurs, Grand public (accès libre)
3. Fonctionnalités (choix multiples) : Connexion/comptes, Dashboard stats, Gestion commandes/réservations, Paiement en ligne, Notifications, Upload fichiers, Calendrier, Messagerie, Export PDF/Excel, Intégrations (Google, Outlook...), Autre
4. Outils actuels utilisés (textarea, obligatoire, max 3000 caractères)
5. Volume d'utilisateurs (choix unique) : Juste moi, 2-10, 10-50, 50-500, 500+, Je ne sais pas
6. Autre chose ? (textarea, optionnel, max 3000 caractères)

#### Variante Application mobile
1. Plateformes (choix unique) : iPhone, Android, Les deux, Je ne sais pas
2. Description de l'usage (textarea, obligatoire, max 5000 caractères, avec exemple)
3. Fonctions du téléphone nécessaires (choix multiples) : Appareil photo, GPS, Notifications push, Contacts, Calendrier, Microphone, Bluetooth, Aucune
4. Fonctionnement hors-ligne (choix unique) : Oui / Non / Je ne sais pas
5. Publication sur les stores (choix unique) : Oui / Non (usage interne) / Je ne sais pas
6. Volume d'utilisateurs (choix unique) : Juste moi, 2-10, 10-50, 50-500, 500+, Je ne sais pas
7. Autre chose ? (textarea, optionnel, max 3000 caractères)

#### Variante Landing page
1. Objectif de la landing page (choix unique) : Vendre un produit, Promouvoir un événement, Générer des contacts, Lancer une offre, Autre
2. Fonctionnalités (choix multiples) : Formulaire, Paiement, Compte à rebours, Témoignages, Vidéo, FAQ, Autre
3. Autre chose ? (textarea, optionnel, max 3000 caractères)

#### Variante Refonte
1. URL du site actuel (texte, obligatoire, validation format URL)
2. Qu'est-ce qui ne va pas avec le site actuel ? (choix multiples) : Design dépassé, Trop lent, Pas adapté mobile, Difficile à mettre à jour, Mal référencé, Ne reflète plus l'activité, Autre
3. Ce qui doit être conservé (textarea, optionnel, max 3000 caractères)
4. Nouvelles fonctionnalités souhaitées (textarea, optionnel, max 3000 caractères)

#### Variante Développement sur mesure
1. Description du besoin technique (textarea, obligatoire, max 5000 caractères)
2. Intégrations nécessaires (choix multiples) : API tierces, Base de données, Logiciel existant, Automatisation, Autre
3. Autre chose ? (textarea, optionnel, max 3000 caractères)

#### Variante Maintenance
1. URL du site/app concerné (texte, obligatoire, validation format URL)
2. Type d'interventions (choix multiples) : Corrections de bugs, Mises à jour sécurité, Ajout de fonctionnalités, Modifications de contenu, Optimisation performance, Autre
3. Fréquence souhaitée (choix unique) : Ponctuel, Mensuel, Hebdomadaire, Je ne sais pas
4. Autre chose ? (textarea, optionnel, max 3000 caractères)

### Step 5 — Design & identité visuelle (conditionnel)

N'apparaît PAS pour : Maintenance, Développement sur mesure.

1. Identité visuelle existante (choix unique) : Logo + charte, Logo sans charte, Rien
   - Si existante → upload du logo / charte (voir section Uploads)
2. Ambiance souhaitée (choix multiples, max 3, limite appliquée par l'UI) : Moderne & épuré, Professionnel & corporate, Chaleureux & convivial, Créatif & audacieux, Luxueux & élégant, Simple & accessible, Jeune & dynamique, Sobre & minimaliste
3. Couleurs préférées ou à éviter (textarea, optionnel, max 1000 caractères)
4. Sites/apps dont le design plaît (textarea, optionnel, max 2000 caractères)

### Step 6 — Contenu (conditionnel)

Version complète pour : Site vitrine, Landing page, Refonte.
Version allégée pour : App web, App mobile.
N'apparaît PAS pour : Maintenance, Développement sur mesure.

#### Version complète
1. Textes prêts ? (choix unique) : Oui / Ébauches / Non, besoin d'aide
2. Visuels disponibles ? (choix unique) : Photos pro / Photos non pro / Rien
3. Conserver le contenu actuel ? (choix unique, Refonte uniquement) : Oui / Partiellement / Non

#### Version allégée
1. Documents à transmettre ? (upload, optionnel) — captures, schémas, cahier des charges (voir section Uploads)

### Step 7 — Budget & délais (commun)

1. Fourchette budget (choix unique) : < 1 000€, 1 000-3 000€, 3 000-5 000€, 5 000-10 000€, 10 000-20 000€, 20 000€+, Je ne sais pas
2. Deadline (choix unique) : Urgent (< 1 mois), 2-3 mois, D'ici 6 mois, Pas de deadline
3. Mode de communication préféré (choix multiples) : Email, Téléphone, Visio, Présentiel (Lille), Pas de préférence

### Step 8 — Récapitulatif & envoi

1. Récapitulatif automatique de toutes les réponses (lecture seule). Chaque section affiche un bouton "Modifier" qui ramène au step correspondant ; après modification, retour automatique au récap.
2. Coordonnées : Nom complet (obligatoire, max 100 caractères), Email (obligatoire, validation format), Téléphone (optionnel, max 20 caractères)
3. Champ libre final (textarea, optionnel, max 3000 caractères)
4. Honeypot field (champ caché via CSS avec `aria-hidden="true"`, `tabindex="-1"`, name `website_url` — si rempli = bot → rejet silencieux)
5. Bouton "Envoyer mon brief"
6. Message de confirmation : "Vous recevrez une copie PDF par email. Je vous recontacte sous 48h."

---

## Uploads de fichiers

### Stratégie

Les fichiers sont uploadés séparément via un endpoint dédié `/api/brief/upload`, puis stockés temporairement dans Vercel Blob (gratuit jusqu'à 250 Mo). La soumission finale du brief ne contient que les références (URLs) des fichiers uploadés. Le serveur les récupère pour les attacher aux emails.

### Endpoint `/api/brief/upload`

- **Méthode** : `POST` multipart/form-data
- **Entrée** : un fichier unique
- **Sortie** : `{ url, name, size, type }` — l'URL Vercel Blob du fichier uploadé
- **Flux** : client uploade un fichier → serveur le stocke dans Vercel Blob → retourne l'URL → client stocke la référence dans le state React

### Limites

- **Taille max par fichier** : 5 Mo
- **Nombre max de fichiers** : 5 au total sur l'ensemble du questionnaire
- **Types autorisés** : PDF, PNG, JPG, WEBP
- **Validation** : côté client (feedback immédiat, vérification taille/type) + côté serveur (rejet si non conforme, validation MIME)
- **Rate limiting** : max 10 uploads par IP/heure

### Persistence localStorage

Les fichiers sont stockés dans Vercel Blob, pas dans le localStorage. Le draft localStorage sauvegarde uniquement les références `{ url, name, size, type }`. Au retour sur un draft, les fichiers restent accessibles via leurs URLs Blob.

### Nettoyage Vercel Blob

Les fichiers uploadés mais jamais soumis (brief abandonné) sont nettoyés via un TTL de 7 jours configuré sur le bucket Vercel Blob. Les fichiers des briefs soumis sont supprimés après envoi des emails (les pièces jointes sont dans les emails, plus besoin du stockage temporaire).

### Transmission dans le brief

La soumission finale (`POST /api/brief`) contient les URLs Blob dans le JSON sous la clé `files[]` avec `{ url, name, size, type }`. Le serveur télécharge chaque fichier depuis Vercel Blob, les attache aux emails via Resend (pièces jointes, limite 40 Mo total), puis supprime les fichiers du Blob.

---

## Flux de données

### Côté client

1. State React (`useState`) stocke les réponses au fur et à mesure
2. À chaque changement de step → sauvegarde dans `localStorage` (clé `jbr-brief-draft`)
   - Le draft inclut un champ `version` (ex: `1`) pour détecter les drafts incompatibles lors de mises à jour du questionnaire. Si la version ne correspond pas, proposer de recommencer.
   - Le draft inclut un champ `updatedAt` (timestamp). Les drafts de plus de 30 jours sont considérés expirés — proposer de recommencer.
3. Au chargement de la page → détection du draft, proposition de reprendre ou recommencer
4. Upload de fichiers → `POST /api/brief/upload` (un par un, en temps réel pendant le remplissage)
5. Soumission → `POST /api/brief` avec le JSON complet (réponses + références URL des fichiers)
6. Succès → nettoyage du `localStorage`, affichage de la confirmation

### Côté serveur (`/api/brief`)

1. Vérification origin (CSRF) — même approche que `/api/contact` (vérification du header `Origin`)
2. Rate limiting : max 3 soumissions par IP/heure (in-memory, cohérent avec le pattern existant)
3. Validation des données : champs obligatoires, types, limites de caractères, format email/URL, taille fichiers
4. Téléchargement des fichiers depuis Vercel Blob via leurs URLs
5. Génération du PDF récapitulatif via `@react-pdf/renderer` (utilisation de `renderToBuffer` pour le rendu serveur)
6. Email au freelance via Resend : brief formaté HTML + PDF en pièce jointe + fichiers uploadés en pièces jointes
7. Suppression des fichiers du Vercel Blob (nettoyage post-envoi)
8. Email au client via Resend : copie PDF identique + message de confirmation
9. Réponse JSON au client (succès/erreur)

### Gestion des erreurs email

Si l'un des deux emails échoue :
- Email freelance échoue → retourner une erreur au client, l'inviter à réessayer
- Email client échoue (confirmation) → retourner succès au client avec message "Nous avons bien reçu votre brief. Si vous ne recevez pas de copie par email, pas d'inquiétude." Log l'erreur côté serveur.

---

## Sécurité

- **CSRF** : vérification du header `Origin` (même pattern que `/api/contact`)
- **Rate limiting** sur `/api/brief` : max 3 soumissions par IP/heure
- **Validation serveur** de toutes les données (ne pas faire confiance au client)
- **Honeypot field** anti-spam : champ `website_url` caché via CSS + `aria-hidden="true"`, si rempli = bot → rejet silencieux avec faux succès
- **Uploads** : 5 Mo/fichier, 5 fichiers max via endpoint dédié `/api/brief/upload`, types restreints (PDF, PNG, JPG, WEBP), validation MIME côté serveur, rate limit 10/heure, stockage temporaire Vercel Blob avec TTL 7 jours
- **`noindex, nofollow`** dans les metadata de la page
- **Exclusion dans `robots.ts`** : ajouter `/fr/brief` et `/en/brief` aux `disallow`
- **Exclusion dans `sitemap.ts`** : ne pas générer d'entrée pour `/brief`
- **Sanitization** des inputs avant insertion dans le PDF et les emails (prévention XSS)
- **Audit de sécurité** post-implémentation
- **Code review** post-implémentation

---

## i18n

Bilingue FR/EN. Toutes les chaînes (questions, options, placeholders, messages d'erreur, email templates) dans `fr.json` et `en.json` sous la clé `brief`. Routes : `/fr/brief` et `/en/brief`.

La locale utilisée par le client pour remplir le questionnaire est transmise au serveur. Le PDF et les emails (freelance + client) sont générés dans cette même langue. Le freelance reçoit donc le brief dans la langue du client.

---

## Accessibilité

- Navigation au clavier entre les steps (focus management)
- Labels et `aria-label` sur tous les champs de formulaire
- Rôles ARIA sur le wizard (`role="form"`, `aria-current="step"`)
- Messages d'erreur associés aux champs via `aria-describedby`
- Contraste suffisant (garanti par le design system existant du portfolio)

---

## Librairies additionnelles

| Librairie | Usage | Justification |
|-----------|-------|---------------|
| `@react-pdf/renderer` | Génération PDF côté serveur via `renderToBuffer` | Solution React native, pas de dépendance binaire. Note : peut causer des cold starts plus longs sur Vercel (~2-3s). Acceptable pour un formulaire soumis occasionnellement. |
| `@vercel/blob` | Stockage temporaire des fichiers uploadés | SDK officiel Vercel, gratuit jusqu'à 250 Mo, TTL configurable pour le nettoyage automatique. |

Pas de nouvelle librairie pour le reste — Resend, Tailwind, next-intl sont déjà en place.

---

## Ce qui est hors scope (V1)

- Stockage en base de données (Supabase, Vercel KV)
- Analytics d'abandon par step
- Tableau de bord de gestion des briefs
- Signature électronique du brief
- Pré-remplissage automatique pour clients existants
- Liens uniques par prospect (tracking individuel)

Ces fonctionnalités pourront être ajoutées en V2 si le volume de briefs le justifie.
