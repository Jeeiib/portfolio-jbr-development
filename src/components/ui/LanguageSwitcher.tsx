"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname and add new one
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");

    startTransition(() => {
      router.replace(newPath);
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
