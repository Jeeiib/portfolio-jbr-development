import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      // Les URL françaises ne portent plus de préfixe. On redirige en PERMANENT
      // (308) et non via le proxy next-intl, qui répond 307 : c'est ce 307
      // temporaire qui faisait retenir à Google l'ancienne URL comme canonique.
      // Ces règles passent avant le proxy, donc elles gagnent.
      { source: "/fr", destination: "/", permanent: true },
      { source: "/fr/:path*", destination: "/:path*", permanent: true },
      // La section /conseils n'existe qu'en français : on renvoie les URL
      // anglaises découvertes par Google vers l'article français plutôt que de
      // laisser un 404.
      { source: "/en/conseils", destination: "/conseils", permanent: true },
      { source: "/en/conseils/:path*", destination: "/conseils/:path*", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
