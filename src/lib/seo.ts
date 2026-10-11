import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { localeMeta, type Locale } from "@/i18n/locales";

type BuildMetadataInput = {
  title: string;
  description?: string;
  /** Chemin absolu depuis la racine, ex. "/algorithme". */
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  /** Langue active — détermine le code `openGraph.locale`. */
  locale?: Locale;
};

/**
 * Fabrique un objet `Metadata` cohérent (titre, canonique, Open Graph, Twitter)
 * à partir de quelques champs. À utiliser dans chaque `page.tsx`.
 */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  keywords = [],
  noIndex = false,
  locale,
}: BuildMetadataInput): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  const ogLocale = locale ? localeMeta[locale].ogLocale : siteConfig.locale;

  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: ogLocale,
      url,
      siteName: siteConfig.name,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/** Données structurées de l'organisation / du site. */
export function websiteJsonLd(locale: string = siteConfig.lang) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: locale,
  };
}

/** Fil d'Ariane structuré, pour les pages profondes. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteConfig.url).toString(),
    })),
  };
}
