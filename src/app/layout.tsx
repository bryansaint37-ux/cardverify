import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ThemeProvider, THEME_NO_FLASH_SCRIPT } from "@/components/theme/theme-provider";
import { localeMeta } from "@/i18n/locales";
import { siteConfig } from "@/config/site";
import { websiteJsonLd } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("site");
  const title = t("tagline");
  const description = t("description");
  const ogLocale = localeMeta[locale as keyof typeof localeMeta]?.ogLocale ?? "en_US";

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — ${title}`,
      template: `%s · ${siteConfig.name}`,
    },
    description,
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
      locale: ogLocale,
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: `${siteConfig.name} — ${title}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} — ${title}`,
      description,
    },
    // Le favicon vient de la convention de fichier `src/app/icon.svg`,
    // le manifeste de `src/app/manifest.ts`.
  };
}

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations("common");

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className="min-h-dvh bg-app font-sans antialiased">
        {/* Pose data-theme avant l'hydratation pour éviter un flash du
            mauvais thème — voir components/theme/theme-provider.tsx. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_NO_FLASH_SCRIPT }} />

        {/* Données structurées du site, lues par les moteurs de recherche. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd(locale)) }}
        />

        <a
          href="#contenu"
          className="skip-link rounded-lg bg-accent px-4 py-2 font-medium text-accent-ink"
        >
          {t("skipToContent")}
        </a>

        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <div className="flex min-h-dvh flex-col">
              <Header />

              <main id="contenu" className="flex-1">
                {children}
              </main>

              <Footer />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
