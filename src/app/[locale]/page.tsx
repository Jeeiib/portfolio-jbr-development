import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import Navigation from "@/components/ui/Navigation";
import BriefCTA from "@/components/ui/BriefCTA";
import Hero from "@/components/sections/Hero";
import ProofStrip from "@/components/sections/ProofStrip";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

const BASE_URL = "https://jbrdevelopment.fr";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    alternates: {
      canonical: `${BASE_URL}${getPathname({ locale, href: "/" })}`,
      languages: {
        "fr-FR": `${BASE_URL}${getPathname({ locale: "fr", href: "/" })}`,
        "en-US": `${BASE_URL}${getPathname({ locale: "en", href: "/" })}`,
        "x-default": `${BASE_URL}${getPathname({ locale: "fr", href: "/" })}`,
      },
    },
  };
}

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <ProofStrip />
        <Projects />
        <BriefCTA from="home-proof" />
        <Services />
        <Process />
        <FAQ />
        <BriefCTA from="home-faq" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
