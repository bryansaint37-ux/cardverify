import path from "node:path";
import type { NextConfig } from "next";

/**
 * Configuration Next.js 15 (App Router).
 * Les en-têtes de sécurité sont volontairement stricts : le site est une
 * démonstration pédagogique, aucune donnée saisie ne doit quitter le navigateur.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Ancre la racine du traçage sur ce dossier : sans cela, Next.js peut
  // remonter à un lockfile situé plus haut dans l'arborescence.
  outputFileTracingRoot: path.resolve(import.meta.dirname),

  experimental: {
    optimizePackageImports: ["@/components"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
