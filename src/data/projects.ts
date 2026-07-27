export interface Project {
  slug: string;
  title: string;
  description: string;
  fullDescription: string;
  tags: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  /** Nom public du client (avis Google) — absent pour un produit maison */
  clientName?: string;
  /** Lien vers l'avis Google public correspondant */
  googleReviewUrl?: string;
}

export const projects: Project[] = [
  {
    slug: "rev-comptabilite",
    title: "REV Comptabilité",
    description: "Application web métier — cabinet comptable",
    fullDescription: "Application web métier développée pour le cabinet d'expertise comptable REV Comptabilité (Wambrechies). Authentification SSO Microsoft Azure AD, portail client avec prise de rendez-vous en ligne, synchronisation calendrier Outlook via Microsoft Graph API, notifications email automatiques avec Resend, et gestion multi-rôles (admin, expert-comptable, collaborateur, client) avec permissions Row-Level Security sur toutes les tables Supabase.",
    tags: ["Next.js", "React", "TypeScript", "Supabase"],
    image: "/projects/rev-comptabilite.webp",
    liveUrl: "https://www.revcomptabilite.fr",
    featured: true,
    clientName: "REV Comptabilité",
    googleReviewUrl: "https://share.google/PT1KkKAtY4UwzpxUn",
  },
  {
    slug: "nicolas-steinberg",
    title: "Nicolas Steinberg",
    description: "Portfolio consultant hôtellerie de luxe",
    fullDescription: "Site portfolio pour un consultant en hôtellerie de luxe. Design premium et épuré reflétant l'univers du luxe. Animations fluides au scroll, scores Lighthouse impeccables (97/100 performance, 100/100 SEO). Intégration d'outils stratégiques personnalisés.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind"],
    image: "/projects/nicolas-steinberg.webp",
    liveUrl: "https://nicolassteinberg.com",
    githubUrl: "https://github.com/Jeeiib/nicolas-steinberg-portfolio",
    featured: true,
    clientName: "Nicolas Steinberg",
    googleReviewUrl: "https://share.google/TrBD8GioYeNPAUJ37",
  },
  {
    slug: "jay",
    title: "Jay",
    description: "Assistant IA pour commerciaux — Seul développeur",
    fullDescription: "Jay est un assistant IA conversationnel accessible via WhatsApp qui permet aux professionnels de gérer leurs CRM et calendriers par la voix. L'utilisateur envoie une note vocale décrivant ce qu'il veut faire, et Jay transcrit, analyse et exécute automatiquement les actions correspondantes dans les systèmes connectés. Support de 6 CRMs majeurs (HubSpot, Salesforce, Pipedrive, Zoho, Odoo, TeamLeader), intégrations calendriers et email.",
    tags: ["React", "TypeScript", "Supabase"],
    image: "/projects/jay.webp",
    liveUrl: "https://jay-assistant.fr",
    featured: true,
  },
];
