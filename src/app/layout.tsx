import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ThemeProvider, THEME_NO_FLASH_SCRIPT } from "@/components/theme/theme-provider";
import { siteConfig } from "@/config/site";
import { websiteJsonLd } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  applicationName: siteConfig.name,
  category: "education",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  // Le favicon vient de la convention de fichier `src/app/icon.svg`,
  // le manifeste de `src/app/manifest.ts`.
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={siteConfig.lang} className={inter.variable} suppressHydrationWarning>
      <body className="min-h-dvh bg-app font-sans antialiased">
        {/* Pose data-theme avant l'hydratation pour éviter un flash du
            mauvais thème — voir components/theme/theme-provider.tsx. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_NO_FLASH_SCRIPT }} />

        {/* Données structurées du site, lues par les moteurs de recherche. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />

        <a
          href="#contenu"
          className="skip-link rounded-lg bg-accent px-4 py-2 font-medium text-accent-ink"
        >
          Aller au contenu principal
        </a>

        <ThemeProvider>
          <div className="flex min-h-dvh flex-col">
            <Header />

            <main id="contenu" className="flex-1">
              {children}
            </main>

            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
