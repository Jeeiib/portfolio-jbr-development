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
}

export const projects: Project[] = [
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
  },
  {
    slug: "rdp-glass",
    title: "RDP Glass",
    description: "Application B2B — gestion produits & blog",
    fullDescription: "Application web complète pour un distributeur de packaging verre B2B. Dashboard d'administration, gestion de catalogue produits, système de blog intégré, et interface client optimisée pour la conversion.",
    tags: ["JavaScript", "React", "Supabase"],
    image: "/projects/rdp-glass.webp",
    liveUrl: "https://rdp-glass.com",
    featured: true,
  },
];
