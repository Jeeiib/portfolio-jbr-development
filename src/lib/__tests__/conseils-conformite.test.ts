import { describe, it, expect } from "vitest";
import { getAllArticles, getArticle, getHeadings } from "@/lib/conseils";
import { siteConfig } from "@/data/siteConfig";

/**
 * Ces tests remplacent la relecture humaine ligne à ligne : ils encodent les
 * règles éditoriales du calendrier pour qu'un article produit par la routine
 * hebdomadaire ne puisse pas être publié s'il les enfreint. Ils tournent en CI
 * sur chaque PR, et c'est leur passage qui autorise la publication.
 */

const MOTS_MINIMUM = 800;
const H2_MINIMUM = 4;

// Un montant en euros absent de cette liste est un chiffre que personne n'a
// validé : c'est la protection principale contre l'invention de prix. La liste
// vient du dépôt, pas d'une décision de rédaction.
const MONTANTS_AUTORISES = new Set<number>([
  siteConfig.prices.vitrine.from,
  siteConfig.prices.surMesure.from,
  siteConfig.prices.surMesure.typicalMin,
  siteConfig.prices.surMesure.typicalMax,
  siteConfig.prices.maintenance.monthly,
  // Segments de marché de la spec §6, repris tels quels sur la page tarifs.
  0, 200, 300, 1500, 8000,
]);

const LIENS_INTERNES_ATTENDUS = ["/fr/tarifs", "/fr/brief"];

// Routes réellement servies par le site, pour qu'un lien interne ne pointe
// jamais vers une page inexistante.
const ROUTES_CONNUES = [
  "/fr", "/fr/tarifs", "/fr/brief", "/fr/services", "/fr/a-propos", "/fr/conseils",
  "/fr/services/developpeur-web-lille", "/fr/services/creation-site-internet-lille",
  "/fr/services/freelance-react-nextjs", "/fr/services/application-web-sur-mesure",
  "/fr/projets/rev-comptabilite", "/fr/projets/nicolas-steinberg", "/fr/projets/jay",
];

function corpsDe(slug: string): string {
  return getArticle(slug)!.content;
}

describe("conformité éditoriale des articles /conseils", () => {
  const articles = getAllArticles();

  it("il y a au moins un article publié", () => {
    expect(articles.length).toBeGreaterThan(0);
  });

  it.each(articles.map((a) => a.slug))("%s : au moins %i mots utiles", (slug) => {
    const mots = corpsDe(slug).split(/\s+/).filter(Boolean).length;
    expect(mots, `${slug} ne fait que ${mots} mots`).toBeGreaterThanOrEqual(MOTS_MINIMUM);
  });

  it.each(articles.map((a) => a.slug))("%s : au moins 4 sections, pour que le sommaire s'affiche", (slug) => {
    const titres = getHeadings(corpsDe(slug));
    expect(titres.length, `${slug} n'a que ${titres.length} H2`).toBeGreaterThanOrEqual(H2_MINIMUM);
  });

  it.each(articles.map((a) => a.slug))("%s : maille vers les pages de conversion", (slug) => {
    const corps = corpsDe(slug);
    for (const lien of LIENS_INTERNES_ATTENDUS) {
      expect(corps, `${slug} ne pointe pas vers ${lien}`).toContain(`](${lien})`);
    }
  });

  it.each(articles.map((a) => a.slug))("%s : tous les liens internes pointent vers une route existante", (slug) => {
    const liens = [...corpsDe(slug).matchAll(/\]\((\/[a-z0-9/-]*)\)/g)].map((m) => m[1]);
    for (const lien of liens) {
      const cible = lien.replace(/\/$/, "");
      const existe = ROUTES_CONNUES.includes(cible) || cible.startsWith("/fr/conseils/");
      expect(existe, `${slug} pointe vers ${lien}, qui n'est pas une route connue`).toBe(true);
    }
  });

  // Règle de forme tenue sur tout le site : ni tiret cadratin ni demi-cadratin.
  it.each(articles.map((a) => a.slug))("%s : pas de tiret long", (slug) => {
    expect(corpsDe(slug), `${slug} contient un tiret long`).not.toMatch(/[—–]/);
  });

  it.each(articles.map((a) => a.slug))("%s : pas d'emoji", (slug) => {
    expect(corpsDe(slug), `${slug} contient un emoji`).not.toMatch(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u,
    );
  });

  it.each(articles.map((a) => a.slug))(
    "%s : tout montant en euros vient du dépôt, aucun chiffre inventé",
    (slug) => {
      const montants = [...corpsDe(slug).matchAll(/([0-9][0-9\s  ]*)\s*€/g)].map((m) =>
        Number(m[1].replace(/[\s  ]/g, "")),
      );
      for (const montant of montants) {
        expect(
          MONTANTS_AUTORISES.has(montant),
          `${slug} cite ${montant} €, qui n'est pas un montant validé du dépôt`,
        ).toBe(true);
      }
    },
  );

  it.each(articles.map((a) => a.slug))("%s : frontmatter exploitable pour le SEO", (slug) => {
    const meta = articles.find((a) => a.slug === slug)!;
    expect(meta.title.length, `${slug} : titre trop long pour Google`).toBeLessThanOrEqual(70);
    expect(meta.description.length, `${slug} : description trop courte`).toBeGreaterThanOrEqual(70);
    expect(meta.description.length, `${slug} : description trop longue`).toBeLessThanOrEqual(200);
    expect(meta.keywords.length, `${slug} : au moins deux mots-clés`).toBeGreaterThanOrEqual(2);
  });
});
