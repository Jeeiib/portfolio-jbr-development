import type { Metadata } from "next";
import Navigation from "@/components/ui/Navigation";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import About from "@/components/sections/About";
import Testimonial from "@/components/sections/Testimonial";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Canonical dynamique selon la locale
  const canonical = locale === "fr"
    ? "https://jbrdevelopment.fr/fr"
    : `https://jbrdevelopment.fr/${locale}`;

  return {
    alternates: {
      canonical,
      languages: {
        "fr-FR": "https://jbrdevelopment.fr/fr",
        "en-US": "https://jbrdevelopment.fr/en",
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
        <Projects />
        <Services />
        <Process />
        <About />
        <Testimonial />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
