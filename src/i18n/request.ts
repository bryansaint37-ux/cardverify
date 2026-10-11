import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/i18n/locales";

/**
 * Configuration next-intl sans préfixe d'URL : la langue est déterminée par
 * un cookie (posé par le middleware à la première visite, ou par le
 * sélecteur de langue), jamais par le chemin. Les routes existantes du site
 * restent donc inchangées.
 */
export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
