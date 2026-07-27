import { siteConfig } from "@/data/siteConfig";

export interface Offer {
  id: "vitrine" | "sur-mesure" | "maintenance";
  icon: string;
  priceFrom: number;
  monthly?: number;
  delayWeeks?: [number, number];
}

// Libellés/descriptions/inclus : messages/{fr,en}.json sous "offers.items.<id>.*"
export const offers: Offer[] = [
  { id: "vitrine", icon: "globe", priceFrom: siteConfig.prices.vitrine.from, delayWeeks: [2, 3] },
  { id: "sur-mesure", icon: "layout", priceFrom: siteConfig.prices.surMesure.from, delayWeeks: [4, 8] },
  { id: "maintenance", icon: "tool", priceFrom: 0, monthly: siteConfig.prices.maintenance.monthly },
];
