export interface LandingPage {
  slug: string;
  icon: string;
  features: string[];
}

export interface FAQItem {
  key: string;
}

export const landingPages: LandingPage[] = [
  {
    slug: "developpeur-web-lille",
    icon: "code",
    features: ["siteVitrine", "applicationWeb", "landingPage"],
  },
  {
    slug: "creation-site-internet-lille",
    icon: "globe",
    features: ["siteVitrine", "ecommerce", "refonte"],
  },
  {
    slug: "freelance-react-nextjs",
    icon: "rocket",
    features: ["applicationWeb", "sitePerformant", "seo"],
  },
  {
    slug: "application-web-sur-mesure",
    icon: "layout",
    features: ["dashboard", "outilMetier", "api"],
  },
];

export const landingFAQs: Record<string, FAQItem[]> = {
  "developpeur-web-lille": [
    { key: "pourquoiLille" },
    { key: "coutSite" },
    { key: "freelanceVsAgence" },
    { key: "delai" },
    { key: "horsLille" },
  ],
  "creation-site-internet-lille": [
    { key: "prixVitrine" },
    { key: "queComprend" },
    { key: "seo" },
    { key: "autonomie" },
    { key: "accompagnement" },
  ],
  "freelance-react-nextjs": [
    { key: "pourquoiNextjs" },
    { key: "nextjsSeo" },
    { key: "wordpressVsNextjs" },
    { key: "nextjsPME" },
    { key: "prixReact" },
  ],
  "application-web-sur-mesure": [
    { key: "definition" },
    { key: "siteVsApp" },
    { key: "coutApp" },
    { key: "delaiApp" },
    { key: "technologies" },
  ],
};

/** Offre de la grille tarifaire correspondant à chaque service des landings */
export const featureOffer: Record<string, "vitrine" | "surMesure"> = {
  siteVitrine: "vitrine",
  landingPage: "vitrine",
  refonte: "vitrine",
  sitePerformant: "vitrine",
  seo: "vitrine",
  applicationWeb: "surMesure",
  ecommerce: "surMesure",
  dashboard: "surMesure",
  outilMetier: "surMesure",
  api: "surMesure",
};

export const whyChooseMe = [
  { key: "local", icon: "mapPin" },
  { key: "interlocuteur", icon: "user" },
  { key: "reactif", icon: "zap" },
  { key: "tarifs", icon: "piggyBank" },
  { key: "accompagnement", icon: "compass" },
  { key: "technologies", icon: "cpu" },
];
