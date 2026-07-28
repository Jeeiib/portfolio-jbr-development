import Script from "next/script";
import { siteConfig } from "@/data/siteConfig";

interface StructuredDataProps {
  locale?: string;
}

export default function StructuredData({ locale = "fr" }: StructuredDataProps) {
  const baseUrl = "https://jbrdevelopment.fr";

  // LocalBusiness Schema - Crucial pour le SEO local "développeur web Lille"
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${baseUrl}/#business`,
    name: "JBR DEVELOPMENT",
    alternateName: "JBR Development",
    description: locale === "fr"
      ? "Développeur web freelance spécialisé dans la création de sites web et applications sur mesure. Sites vitrines, e-commerce, applications web pour PME et entrepreneurs à Lille et dans le Nord."
      : "Freelance web developer specializing in custom websites and web applications. Business websites, e-commerce, web apps for SMBs and entrepreneurs in Lille and Northern France.",
    url: baseUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    image: `${baseUrl}/pictures/moi.webp`,
    logo: `${baseUrl}/icon-512.png`,
    priceRange: "€€",
    makesOffer: [
      {
        "@type": "Offer",
        name: locale === "fr" ? "Site vitrine (création ou refonte)" : "Business website (new or redesign)",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: siteConfig.prices.vitrine.from,
          priceCurrency: "EUR",
          valueAddedTaxIncluded: false,
        },
      },
      {
        "@type": "Offer",
        name: locale === "fr" ? "Application ou outil sur mesure" : "Custom application or tool",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: siteConfig.prices.surMesure.from,
          priceCurrency: "EUR",
          valueAddedTaxIncluded: false,
        },
      },
      {
        "@type": "Offer",
        name: locale === "fr" ? "Maintenance et accompagnement" : "Maintenance and support",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: siteConfig.prices.maintenance.monthly,
          priceCurrency: "EUR",
          unitText: locale === "fr" ? "mois" : "month",
          valueAddedTaxIncluded: false,
        },
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "7 Rue Nicot",
      addressLocality: "Lambersart",
      addressRegion: "Hauts-de-France",
      postalCode: "59130",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 50.6478,
      longitude: 3.0253,
    },
    areaServed: [
      {
        "@type": "City",
        name: "Lille",
      },
      {
        "@type": "City",
        name: "Lambersart",
      },
      {
        "@type": "AdministrativeArea",
        name: "Nord",
      },
      {
        "@type": "AdministrativeArea",
        name: "Hauts-de-France",
      },
    ],
    serviceType: [
      "Développement web",
      "Création de sites internet",
      "Applications web sur mesure",
      "Sites vitrines",
      "E-commerce",
      "Landing pages",
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Tailwind CSS",
      "WordPress",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "3",
      bestRating: "5",
      worstRating: "1",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: [
      "https://www.linkedin.com/in/jean-baptiste-renart-46b618153",
      "https://github.com/Jeeiib",
    ],
  };

  // Person Schema - Pour les recherches "Jean-Baptiste Renart développeur"
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    name: "Jean-Baptiste Renart",
    givenName: "Jean-Baptiste",
    familyName: "Renart",
    jobTitle: locale === "fr" ? "Développeur Web Freelance" : "Freelance Web Developer",
    description: locale === "fr"
      ? "Développeur web freelance basé à Lille, spécialisé en React, Next.js et TypeScript. Création de sites web et applications sur mesure pour PME et entrepreneurs."
      : "Freelance web developer based in Lille, France, specializing in React, Next.js and TypeScript. Custom websites and web applications for SMBs and entrepreneurs.",
    url: baseUrl,
    image: `${baseUrl}/pictures/moi.webp`,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lambersart",
      addressRegion: "Hauts-de-France",
      postalCode: "59130",
      addressCountry: "FR",
    },
    worksFor: {
      "@type": "Organization",
      "@id": `${baseUrl}/#business`,
      name: "JBR DEVELOPMENT",
    },
    knowsAbout: [
      "Développement web",
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "Tailwind CSS",
      "SEO",
    ],
    sameAs: [
      "https://www.linkedin.com/in/jean-baptiste-renart-46b618153",
      "https://github.com/Jeeiib",
    ],
  };

  // WebSite Schema - Pour la sitelinks searchbox et l'identification du site
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: "JBR DEVELOPMENT",
    alternateName: "Jean-Baptiste Renart - Développeur Web",
    url: baseUrl,
    description: locale === "fr"
      ? "Portfolio et services de développement web freelance à Lille"
      : "Freelance web development portfolio and services in Lille, France",
    inLanguage: [locale === "fr" ? "fr-FR" : "en-US"],
    publisher: {
      "@id": `${baseUrl}/#person`,
    },
  };

  // Service Schema - Pour les recherches de services spécifiques
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${baseUrl}/#services`,
    name: locale === "fr" ? "Services de développement web" : "Web Development Services",
    itemListElement: [
      {
        "@type": "Service",
        position: 1,
        name: locale === "fr" ? "Création de site vitrine" : "Business Website Creation",
        description: locale === "fr"
          ? "Sites web professionnels et modernes pour présenter votre activité"
          : "Professional and modern websites to showcase your business",
        provider: { "@id": `${baseUrl}/#business` },
        areaServed: { "@type": "City", name: "Lille" },
        serviceType: "Web Development",
      },
      {
        "@type": "Service",
        position: 2,
        name: locale === "fr" ? "Application web sur mesure" : "Custom Web Application",
        description: locale === "fr"
          ? "Applications web performantes avec React et Next.js"
          : "High-performance web applications with React and Next.js",
        provider: { "@id": `${baseUrl}/#business` },
        areaServed: { "@type": "City", name: "Lille" },
        serviceType: "Web Application Development",
      },
      {
        "@type": "Service",
        position: 3,
        name: locale === "fr" ? "Maintenance et accompagnement" : "Maintenance and support",
        description: locale === "fr"
          ? "Hébergement, mises à jour, sauvegardes et évolutions de votre site"
          : "Hosting, updates, backups and improvements for your website",
        provider: { "@id": `${baseUrl}/#business` },
        areaServed: { "@type": "City", name: "Lille" },
        serviceType: "Website Maintenance",
      },
    ],
  };

  // BreadcrumbList pour la navigation
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: `${baseUrl}/${locale}`,
      },
    ],
  };

  // Note: dangerouslySetInnerHTML is safe here because all content is
  // statically defined JSON-LD schemas with no user input
  return (
    <>
      <Script
        id="schema-local-business"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Script
        id="schema-person"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Script
        id="schema-website"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="schema-services"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
