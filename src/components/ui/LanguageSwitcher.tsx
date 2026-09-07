"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  // pathname (next-intl) est déjà sans préfixe de locale
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: "fr" | "en") => {
    // router.replace de next-intl repréfixe lui-même le pathname courant :
    // plus de reconstruction manuelle, donc plus de 404 sur les pages sans
    // équivalent dans l'autre langue (ex. /conseils, français uniquement).
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="flex items-center gap-1 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg p-1">
      <button
        onClick={() => switchLocale("fr")}
        disabled={isPending}
        className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-all ${
          locale === "fr"
            ? "bg-[var(--accent)] btn-primary-text"
            : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
        }`}
        aria-label="Français"
      >
        FR
      </button>
      <button
        onClick={() => switchLocale("en")}
        disabled={isPending}
        className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-all ${
          locale === "en"
            ? "bg-[var(--accent)] btn-primary-text"
            : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
        }`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
