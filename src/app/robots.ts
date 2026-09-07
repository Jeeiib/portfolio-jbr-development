import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Le questionnaire de brief porte déjà "noindex, nofollow" dans sa page.
      // On ne le met surtout PAS en Disallow : Googlebot ne lirait alors jamais
      // ce noindex et garderait les pages en « indexée malgré le blocage ».
      disallow: ["/api/"],
    },
    sitemap: "https://jbrdevelopment.fr/sitemap.xml",
  };
}
