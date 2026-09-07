import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Ces helpers appliquent localePrefix : les href restent écrits sans locale
// ("/tarifs") et le préfixe est ajouté seulement quand il le faut.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
