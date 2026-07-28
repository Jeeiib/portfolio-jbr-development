"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function NotFound() {
  const t = useTranslations("notFound");
  const locale = useLocale();

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl">
        <p className="tag-chantier w-fit mb-6">{t("tag")}</p>
        <h1 className="display-xl mb-4">{t("title")}</h1>
        <p className="text-[var(--foreground-secondary)] mb-8">{t("message")}</p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-[var(--accent)] btn-primary-text rounded-lg transition-colors hover:bg-[var(--accent-hover)]"
        >
          <span aria-hidden="true">←</span>
          {t("backHome")}
        </Link>
      </div>
    </main>
  );
}
