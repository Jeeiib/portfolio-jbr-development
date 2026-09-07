"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

interface SmoothScrollLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function SmoothScrollLink({
  href,
  children,
  className,
  onClick,
}: SmoothScrollLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  // pathname (next-intl) est toujours sans préfixe de locale
  const isHomePage = pathname === "/";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = href.replace("#", "");

    if (isHomePage) {
      const element = document.getElementById(targetId);
      if (element) {
        const navbarHeight = 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - navbarHeight,
          behavior: "smooth",
        });
      }
    } else {
      // Retour à l'accueil avec l'ancre ; next-intl ajoute le préfixe si besoin
      router.push(`/#${targetId}`);
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
