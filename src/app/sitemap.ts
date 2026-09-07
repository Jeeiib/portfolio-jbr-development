import { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { landingPages } from "@/data/landingPages";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { getAllArticles } from "@/lib/conseils";

const baseUrl = "https://jbrdevelopment.fr";

// Construit l'URL absolue d'une locale donnée pour un chemin, via getPathname :
// suit automatiquement la config de routage (français sans préfixe, anglais sous /en).
function absoluteUrl(locale: "fr" | "en", href: string) {
  return `${baseUrl}${getPathname({ locale, href })}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = routing.locales;

  const entries: MetadataRoute.Sitemap = [];

  // Home pages for each locale
  for (const locale of locales) {
    entries.push({
      url: absoluteUrl(locale, "/"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: locale === "fr" ? 1 : 0.9,
      alternates: {
        languages: {
          fr: absoluteUrl("fr", "/"),
          en: absoluteUrl("en", "/"),
          "x-default": absoluteUrl("fr", "/"),
        },
      },
    });
  }

  // Services hub page for each locale
  for (const locale of locales) {
    entries.push({
      url: absoluteUrl(locale, "/services"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          fr: absoluteUrl("fr", "/services"),
          en: absoluteUrl("en", "/services"),
          "x-default": absoluteUrl("fr", "/services"),
        },
      },
    });
  }

  // Pricing page for each locale
  for (const locale of locales) {
    entries.push({
      url: absoluteUrl(locale, "/tarifs"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          fr: absoluteUrl("fr", "/tarifs"),
          en: absoluteUrl("en", "/tarifs"),
          "x-default": absoluteUrl("fr", "/tarifs"),
        },
      },
    });
  }

  // About page for each locale
  for (const locale of locales) {
    entries.push({
      url: absoluteUrl(locale, "/a-propos"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          fr: absoluteUrl("fr", "/a-propos"),
          en: absoluteUrl("en", "/a-propos"),
          "x-default": absoluteUrl("fr", "/a-propos"),
        },
      },
    });
  }

  // Landing pages for each locale
  for (const locale of locales) {
    for (const page of landingPages) {
      const path = `/services/${page.slug}`;
      entries.push({
        url: absoluteUrl(locale, path),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
        alternates: {
          languages: {
            fr: absoluteUrl("fr", path),
            en: absoluteUrl("en", path),
            "x-default": absoluteUrl("fr", path),
          },
        },
      });
    }
  }

  // Project pages for each locale
  for (const locale of locales) {
    for (const project of projects) {
      const path = `/projets/${project.slug}`;
      entries.push({
        url: absoluteUrl(locale, path),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: {
            fr: absoluteUrl("fr", path),
            en: absoluteUrl("en", path),
            "x-default": absoluteUrl("fr", path),
          },
        },
      });
    }
  }

  // Section /conseils : française uniquement, donc pas d'alternates. Les
  // brouillons sont déjà exclus par getAllArticles.
  const articles = getAllArticles();

  if (articles.length > 0) {
    entries.push({
      url: absoluteUrl("fr", "/conseils"),
      lastModified: new Date(articles[0].date),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const article of articles) {
    entries.push({
      url: absoluteUrl("fr", `/conseils/${article.slug}`),
      lastModified: new Date(article.date),
      changeFrequency: "yearly",
      priority: 0.7,
    });
  }

  return entries;
}
