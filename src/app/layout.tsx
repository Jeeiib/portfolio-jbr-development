import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Script from "next/script";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jbrdevelopment.fr"),
  title: "Jean-Baptiste Renart | JBR Development",
  description:
    "Développeur web freelance - Je conçois vos applications web sur mesure. Sites vitrines, applications web, landing pages pour PME et entrepreneurs.",
  keywords: [
    "développeur web",
    "freelance",
    "Next.js",
    "React",
    "Lille",
    "JBR Development",
    "site vitrine",
    "application web",
  ],
  authors: [{ name: "Jean-Baptiste Renart" }],
  openGraph: {
    title: "Jean-Baptiste Renart | JBR Development",
    description: "Votre vision, mon code, votre levier de croissance.",
    type: "website",
    locale: "fr_FR",
    siteName: "JBR Development",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jean-Baptiste Renart | JBR Development",
    description: "Développeur web freelance - Sites vitrines, applications web, landing pages.",
    creator: "@jbr_dev",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
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
      <body className={`${spaceGrotesk.variable} antialiased`} suppressHydrationWarning>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
