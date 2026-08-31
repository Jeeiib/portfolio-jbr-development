// timeZone figée : sans elle, une date ISO nue est interprétée en UTC puis
// réaffichée dans le fuseau du serveur, ce qui décale l'affichage d'un jour.
const dateLongueFr = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** « 31 août 2026 » depuis un ISO court YYYY-MM-DD. */
export function formatDateLongue(iso: string): string {
  return dateLongueFr.format(new Date(iso));
}
