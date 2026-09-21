import { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { landingPages } from "@/data/landingPages";
import { getPathname } from "@/i18n/navigation";
import { getAllArticles } from "@/lib/conseils";

const baseUrl = "https://jbrdevelopment.fr";

// Le sitemap ne déclare que le français. Les pages /en restent servies mais
// portent un noindex (voir app/[locale]/layout.tsx) : les soumettre reviendrait
// à demander l'indexation d'URL qu'on refuse par ailleurs, et à faire dépenser à
// Googlebot un budget d'exploration que les pages françaises n'ont pas de trop.
function absoluteUrl(href: string) {
  return `${baseUrl}${getPathname({ locale: "fr", href })}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Accueil
  entries.push({
    url: absoluteUrl("/"),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
  });

  // Pages principales
  for (const href of ["/services", "/tarifs", "/a-propos"]) {
    entries.push({
      url: absoluteUrl(href),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  // Landing pages par service
  for (const page of landingPages) {
    entries.push({
      url: absoluteUrl(`/services/${page.slug}`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  // Études de cas
  for (const project of projects) {
    entries.push({
      url: absoluteUrl(`/projets/${project.slug}`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Section /conseils. Les brouillons sont déjà exclus par getAllArticles.
  const articles = getAllArticles();

  if (articles.length > 0) {
    entries.push({
      url: absoluteUrl("/conseils"),
      lastModified: new Date(articles[0].date),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const article of articles) {
    entries.push({
      url: absoluteUrl(`/conseils/${article.slug}`),
      lastModified: new Date(article.date),
      changeFrequency: "yearly",
      priority: 0.7,
    });
  }

  return entries;
}
