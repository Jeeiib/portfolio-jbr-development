"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { siteConfig } from "@/data/siteConfig";
import { useAnalytics } from "@/hooks/useAnalytics";

const socialLinks = [
  {
    href: "https://github.com/Jeeiib",
    label: "GitHub",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/in/jean-baptiste-renart-46b618153/",
    label: "LinkedIn",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const t = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const locale = useLocale();
  const { trackEvent } = useAnalytics();
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: `/${locale}#projets`, label: t("projects") },
    { href: `/${locale}/services`, label: t("services") },
    { href: `/${locale}/tarifs`, label: t("tarifs") },
    // Section publiée en français uniquement
    ...(locale === "fr" ? [{ href: `/${locale}/conseils`, label: t("conseils") }] : []),
    { href: `/${locale}/a-propos`, label: t("about") },
    { href: `/${locale}#contact`, label: t("contact") },
  ];

  return (
    <footer className="bg-[var(--background-secondary)] border-t border-[var(--border)]">
      <div className="section-container py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Identité + NAP */}
          <div className="flex flex-col gap-3">
            <Link
              href={`/${locale}`}
              className="text-xl font-bold tracking-tight hover:text-[var(--accent)] transition-colors w-fit"
            >
              JBR<span className="text-[var(--accent)]">.</span>
            </Link>
            <p className="text-sm text-[var(--foreground-secondary)] max-w-xs">
              {tFooter("tagline")}
            </p>
            <p className="annotation mt-2">{tFooter("areaLine")}</p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2" aria-label={tFooter("navTitle")}>
            <p className="annotation mb-2">{tFooter("navTitle")}</p>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact + preuve */}
          <div className="flex flex-col gap-2">
            <p className="annotation mb-2">{tFooter("contactTitle")}</p>
            <a
              href={`tel:${siteConfig.phone}`}
              onClick={() => trackEvent("tel_click", { from: "footer" })}
              className="text-sm text-[var(--foreground)] hover:text-[var(--accent)] transition-colors w-fit"
            >
              {siteConfig.phoneDisplay}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors w-fit"
            >
              {siteConfig.email}
            </a>
            <p className="text-sm text-[var(--foreground-secondary)]">{tFooter("responseLine")}</p>
            <a
              href={siteConfig.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("google_review_click", { from: "footer" })}
              className="text-sm mt-1 w-fit hover:opacity-80 transition-opacity"
            >
              <span className="proof">★ 5,0</span>{" "}
              <span className="text-[var(--foreground-secondary)]">{tFooter("reviews")}</span>
            </a>
            <div className="flex items-center gap-4 mt-3">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("social_click", { platform: link.label, location: "footer" })}
                  className="text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-8 border-t border-[var(--border)] text-center">
          <p className="text-sm text-[var(--foreground-secondary)]">
            © {currentYear} {tFooter("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
