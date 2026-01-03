import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

// Next.js 16: renamed from middleware to proxy
export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except:
  // - API routes
  // - Static files
  // - Internal Next.js paths
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
