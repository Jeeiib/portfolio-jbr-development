import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/context/ThemeProvider";
import { routing } from "@/i18n/routing";
import StructuredData from "@/components/StructuredData";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
});

// La locale conditionne l'indexation, donc les métadonnées se construisent par
// requête plutôt qu'en constante. params suffit : pas de consultation de la
// requête, donc le prérendu des routes est conservé.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    metadataBase: new URL("https://jbrdevelopment.fr"),
    title: {
      default: "Développeur Web Freelance Lille | JBR Development - Jean-Baptiste Renart",
      template: "%s | JBR Development",
    },
    description:
      "Développeur web indépendant à Lille. Sites vitrines dès 1 190 € HT, applications sur mesure, maintenance. Prix affichés, devis gratuit sous 48 h, un seul interlocuteur.",
    keywords: [
      "développeur web Lille",
      "développeur web freelance Lille",
      "création site internet Lille",
      "développeur React Lille",
      "développeur Next.js",
      "freelance web Nord",
      "JBR Development",
      "Jean-Baptiste Renart",
      "site vitrine Lille",
      "application web sur mesure",
      "agence web Lille",
      "développeur TypeScript",
      "création site web Nord",
      "développeur frontend Lille",
      "Lambersart",
    ],
    authors: [{ name: "Jean-Baptiste Renart", url: "https://jbrdevelopment.fr" }],
    creator: "Jean-Baptiste Renart",
    publisher: "JBR Development",
    category: "technology",
    openGraph: {
      title: "Développeur Web Freelance Lille | JBR Development",
      description: "Sites et outils sur mesure pour TPE et PME lilloises. Prix affichés, délais tenus, avis Google vérifiés.",
      type: "website",
      locale: "fr_FR",
      alternateLocale: "en_US",
      siteName: "JBR Development",
      url: "https://jbrdevelopment.fr",
    },
    twitter: {
      card: "summary_large_image",
      title: "Développeur Web Freelance Lille | JBR Development",
      description: "Création de sites internet et applications web à Lille. Expert React, Next.js, TypeScript.",
      creator: "@jbr_dev",
      site: "@jbr_dev",
    },
    // Le site ne vise que le marché français. Les pages /en restent en ligne mais
    // sortent de l'index : elles captaient du budget d'exploration sans jamais
    // ressortir (3 URL indexées sur 11 au 18/09/2026). "follow" est conservé pour
    // que les liens vers les pages françaises gardent leur valeur.
    robots: {
      index: locale === routing.defaultLocale,
      follow: true,
      googleBot: {
        index: locale === routing.defaultLocale,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        // 48x48 en premier - taille minimum requise par Google Search
        { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
        { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/favicon.ico", sizes: "32x32 48x48 96x96", type: "image/x-icon" },
        { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icon.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/apple-icon.png",
      shortcut: "/favicon.ico",
    },
  };
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Ce layout est la racine de l'application : c'est le seul endroit où la locale
// est connue de façon statique, donc le seul où <html lang> peut être juste
// sans consulter la requête ni perdre le prérendu.
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as "fr" | "en")) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          src="/scripts/theme-init.js"
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <StructuredData locale={locale} />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
