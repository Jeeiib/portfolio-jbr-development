"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import SmoothScrollLink from "@/components/ui/SmoothScrollLink";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { siteConfig } from "@/data/siteConfig";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function Navigation() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const { trackEvent } = useAnalytics();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const pathname = usePathname();

  const isHomePage = pathname === "/fr" || pathname === "/en" || pathname === "/";

  // Ancres résolues selon la page : ancre directe sur la home, retour home + ancre ailleurs
  const anchor = (id: string) => (isHomePage ? `#${id}` : `/${locale}#${id}`);

  const navLinks = [
    { href: anchor("projets"), label: t("projects"), isAnchor: isHomePage },
    { href: `/${locale}/services`, label: t("services"), isAnchor: false },
    { href: `/${locale}/tarifs`, label: t("tarifs"), isAnchor: false },
    { href: `/${locale}/a-propos`, label: t("about"), isAnchor: false },
    { href: anchor("contact"), label: t("contact"), isAnchor: isHomePage },
  ];

  // Initialize scroll state and enable transitions after mount
  useEffect(() => {
    setIsScrolled(window.scrollY > 50);
    const timer = setTimeout(() => setHasMounted(true), 50);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const briefCta = (from: string, extraClasses = "") => (
    <Link
      href={`/${locale}/brief`}
      onClick={() => {
        trackEvent("cta_brief_click", { from });
        handleLinkClick();
      }}
      className={`inline-flex items-center justify-center rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold btn-primary-text transition-colors hover:bg-[var(--accent-hover)] ${extraClasses}`}
    >
      {t("estimate")}
    </Link>
  );

  const telLink = (from: string, extraClasses = "") => (
    <a
      href={`tel:${siteConfig.phone}`}
      onClick={() => trackEvent("tel_click", { from })}
      aria-label={t("callAria")}
      className={`annotation transition-colors hover:text-[var(--accent)] ${extraClasses}`}
    >
      {siteConfig.phoneDisplay}
    </a>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${
        hasMounted ? "transition-all duration-300" : ""
      } ${
        isScrolled
          ? "bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)]"
          : "bg-transparent"
      }`}
    >
      <nav className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          {isHomePage ? (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-lg md:text-xl font-bold tracking-tight transition-colors hover:text-[var(--accent)]"
            >
              JBR<span className="text-[var(--accent)]">.</span>
            </button>
          ) : (
            <Link
              href={`/${locale}`}
              className="text-lg md:text-xl font-bold tracking-tight transition-colors hover:text-[var(--accent)]"
            >
              JBR<span className="text-[var(--accent)]">.</span>
            </Link>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) =>
              link.isAnchor ? (
                <SmoothScrollLink
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  {link.label}
                </SmoothScrollLink>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Desktop : téléphone + switchers + CTA brief */}
          <div className="hidden md:flex items-center gap-4">
            {telLink("nav")}
            <LanguageSwitcher />
            <ThemeToggle />
            {briefCta("nav")}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${
                  isOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[var(--background)] z-40 md:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{ top: "64px" }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-7 pb-20">
          {navLinks.map((link) =>
            link.isAnchor ? (
              <SmoothScrollLink
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={`text-2xl font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-all ${
                  isOpen ? "animate-fade-in-up" : ""
                }`}
              >
                {link.label}
              </SmoothScrollLink>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={`text-2xl font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-all ${
                  isOpen ? "animate-fade-in-up" : ""
                }`}
              >
                {link.label}
              </Link>
            )
          )}

          <div
            className={`flex flex-col items-center gap-5 mt-6 ${
              isOpen ? "animate-fade-in-up delay-300" : ""
            }`}
          >
            {briefCta("nav-mobile", "px-6 py-3 text-base")}
            {telLink("nav-mobile", "text-sm")}
            <div className="flex items-center gap-6 mt-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
