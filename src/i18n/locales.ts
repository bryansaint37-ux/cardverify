export const locales = ["fr", "en", "de", "es", "it", "pt", "nl"] as const;

export type Locale = (typeof locales)[number];

/** Langue utilisée quand la langue détectée ou enregistrée n'est pas prise en charge. */
export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export const localeMeta: Record<Locale, { label: string; flag: string; ogLocale: string }> = {
  fr: { label: "Français", flag: "🇫🇷", ogLocale: "fr_FR" },
  en: { label: "English", flag: "🇬🇧", ogLocale: "en_US" },
  de: { label: "Deutsch", flag: "🇩🇪", ogLocale: "de_DE" },
  es: { label: "Español", flag: "🇪🇸", ogLocale: "es_ES" },
  it: { label: "Italiano", flag: "🇮🇹", ogLocale: "it_IT" },
  pt: { label: "Português", flag: "🇵🇹", ogLocale: "pt_PT" },
  nl: { label: "Nederlands", flag: "🇳🇱", ogLocale: "nl_NL" },
};

/**
 * Choisit la meilleure langue prise en charge à partir d'un en-tête
 * `Accept-Language` (ex. "fr-FR,fr;q=0.9,en-US;q=0.8"). Ne considère jamais
 * la géolocalisation : uniquement la préférence déclarée par le navigateur.
 */
export function matchLocaleFromAcceptLanguage(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((param) => param.trim().startsWith("q="));
      const q = qParam ? parseFloat(qParam.trim().slice(2)) : 1;
      const primary = tag?.split("-")[0]?.toLowerCase().trim();
      return { primary, q: Number.isFinite(q) ? q : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { primary } of ranked) {
    if (isLocale(primary)) return primary;
  }

  return defaultLocale;
}
