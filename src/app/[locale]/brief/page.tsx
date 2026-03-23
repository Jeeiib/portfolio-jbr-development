import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import BriefWizard from "@/components/brief/BriefWizard";
import ThemeToggle from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: "Brief Projet",
  robots: {
    index: false,
    follow: false,
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface BriefPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BriefPage({ params }: BriefPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative min-h-screen bg-[var(--background)] py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="fixed top-4 right-4 z-40">
        <ThemeToggle />
      </div>
      <BriefWizard />
    </main>
  );
}
