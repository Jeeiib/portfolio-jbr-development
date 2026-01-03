export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const services: Service[] = [
  {
    id: "sites-vitrines",
    title: "Sites vitrines",
    description: "Une présence en ligne professionnelle qui reflète votre identité et convertit vos visiteurs en clients.",
    icon: "globe",
  },
  {
    id: "applications-web",
    title: "Applications web",
    description: "Dashboards, gestion de contenu, outils métier — des solutions sur mesure qui simplifient votre quotidien.",
    icon: "layout",
  },
  {
    id: "developpement-technique",
    title: "Développement technique",
    description: "Applications internes, intégrations API, automatisations — des solutions robustes pour vos besoins complexes.",
    icon: "code",
  },
  {
    id: "landing-pages",
    title: "Landing pages",
    description: "Pages de conversion optimisées pour vos campagnes, produits ou événements.",
    icon: "rocket",
  },
  {
    id: "refonte-site",
    title: "Refonte de site",
    description: "Modernisation de votre site existant : design, performance, expérience utilisateur.",
    icon: "refresh",
  },
  {
    id: "maintenance",
    title: "Maintenance",
    description: "Évolutions, corrections, mises à jour — votre site entre de bonnes mains.",
    icon: "tool",
  },
];
