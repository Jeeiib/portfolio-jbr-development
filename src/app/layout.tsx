import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://jbrdevelopment.fr"),
  title: {
    default: "Développeur Web Freelance Lille | JBR Development - Jean-Baptiste Renart",
    template: "%s | JBR Development",
  },
  description:
    "Développeur web freelance à Lille (Nord). Création de sites internet, applications web sur mesure, sites vitrines et e-commerce. Expert React, Next.js, TypeScript. Devis gratuit.",
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
    description: "Création de sites web et applications sur mesure à Lille. Expert React & Next.js. Votre vision, mon code, votre levier de croissance.",
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
  alternates: {
    languages: {
      "fr-FR": "https://jbrdevelopment.fr/fr",
      "en-US": "https://jbrdevelopment.fr/en",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          src="/scripts/theme-init.js"
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`} suppressHydrationWarning>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
