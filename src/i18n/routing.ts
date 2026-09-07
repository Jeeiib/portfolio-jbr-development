import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  // Le français est servi sans préfixe (/, /tarifs), l'anglais sous /en.
  // Google avait élu les URL sans préfixe comme canoniques : on les rend réelles
  // au lieu de les laisser rediriger en 307 vers /fr, ce qui mettait toutes les
  // pages françaises en doublon canonique.
  localePrefix: "as-needed",
});
