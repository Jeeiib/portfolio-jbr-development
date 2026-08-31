import { siteConfig } from "@/data/siteConfig";
import type { BriefData, ProjectType } from "@/data/briefTypes";

const round100 = (n: number) => Math.round(n / 100) * 100;

// Formats "petit format" : partent du prix d'appel vitrine plutôt que du sur-mesure.
const SMALL_FORMAT_TYPES: ProjectType[] = ["site-vitrine", "landing-page"];

// Coefficient business (pas un prix) : sert à extrapoler la borne haute "typique"
// d'un site vitrine à partir du seul prix d'appel disponible dans siteConfig, en
// reprenant le ratio typicalMin/from déjà observé sur l'offre sur-mesure.
const vitrineMaxRatio = siteConfig.prices.surMesure.typicalMin / siteConfig.prices.surMesure.from;

// Compte le nombre total d'éléments sélectionnés dans les tableaux du bloc features,
// quel que soit le nom du champ (features, phoneFeatures, integrations, selected...).
// BriefFeatures est une union de formes différentes selon le type de projet ; cette
// approche générique évite de coupler l'estimation à un champ précis de chaque forme.
function countSelectedFeatures(features: BriefData["features"]): number {
  if (!features) return 0;
  return Object.values(features).reduce<number>(
    (total, value) => total + (Array.isArray(value) ? value.length : 0),
    0
  );
}

export function estimateFromBrief(
  data: Pick<BriefData, "projectType" | "features">
): { min: number; max: number } {
  const p = siteConfig.prices;
  const isApp = data.projectType !== null && !SMALL_FORMAT_TYPES.includes(data.projectType);
  const baseMin = isApp ? p.surMesure.from : p.vitrine.from;
  const baseMax = isApp ? p.surMesure.typicalMin : p.vitrine.from * vitrineMaxRatio;
  const featureCount = countSelectedFeatures(data.features);
  const rawMin = baseMin * (1 + 0.15 * featureCount);
  const rawMax = baseMax * (1 + 0.25 * featureCount);
  // Sans fonctionnalité cochée, le plancher reste le prix d'appel exact (siteConfig) :
  // un arrondi à la centaine le déformerait (1190 -> 1200) alors qu'aucun calcul n'a eu lieu.
  const min = featureCount === 0 ? baseMin : round100(rawMin);
  const max = round100(Math.max(rawMax, rawMin * 1.25));
  return { min, max };
}
