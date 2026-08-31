import type { ReactNode } from "react";
import { slugifyHeading } from "@/lib/conseils";

/**
 * Texte brut d'un noeud MDX, pour construire une ancre. Un titre peut contenir
 * du formatage (`**gras**`, `code`), donc les enfants ne sont pas toujours une
 * simple chaine.
 */
function texteDe(noeud: ReactNode): string {
  if (typeof noeud === "string" || typeof noeud === "number") return String(noeud);
  if (Array.isArray(noeud)) return noeud.map(texteDe).join("");
  if (noeud && typeof noeud === "object" && "props" in noeud) {
    const props = (noeud as { props?: { children?: ReactNode } }).props;
    return texteDe(props?.children);
  }
  return "";
}

/**
 * Les ancres sont posées ici avec la meme fonction que celle qui alimente le
 * sommaire (`getHeadings`), pour que les deux ne puissent pas divorcer.
 */
export const mdxComponents = {
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 id={slugifyHeading(texteDe(children))}>{children}</h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 id={slugifyHeading(texteDe(children))}>{children}</h3>
  ),
};
