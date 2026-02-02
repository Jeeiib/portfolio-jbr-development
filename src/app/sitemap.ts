import { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { landingPages } from "@/data/landingPages";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://jbrdevelopment.fr";
  const locales = routing.locales;

  const entries: MetadataRoute.Sitemap = [];

  // Home pages for each locale
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: locale === "fr" ? 1 : 0.9,
      alternates: {
        languages: {
          fr: `${baseUrl}/fr`,
          en: `${baseUrl}/en`,
        },
      },
    });
  }

  // Services hub page for each locale
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${baseUrl}/fr/services`,
          en: `${baseUrl}/en/services`,
        },
      },
    });
  }

  // About page for each locale
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}/a-propos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${baseUrl}/fr/a-propos`,
          en: `${baseUrl}/en/a-propos`,
        },
      },
    });
  }

  // Landing pages for each locale
  for (const locale of locales) {
    for (const page of landingPages) {
      entries.push({
        url: `${baseUrl}/${locale}/services/${page.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
        alternates: {
          languages: {
            fr: `${baseUrl}/fr/services/${page.slug}`,
            en: `${baseUrl}/en/services/${page.slug}`,
          },
        },
      });
    }
  }

  // Project pages for each locale
  for (const locale of locales) {
    for (const project of projects) {
      entries.push({
        url: `${baseUrl}/${locale}/projets/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: {
            fr: `${baseUrl}/fr/projets/${project.slug}`,
            en: `${baseUrl}/en/projets/${project.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
