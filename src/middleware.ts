import { NextResponse, type NextRequest } from "next/server";
import { isLocale, LOCALE_COOKIE, matchLocaleFromAcceptLanguage } from "@/i18n/locales";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * Détecte la langue du navigateur (en-tête `Accept-Language`) une seule
 * fois, à la toute première visite, et la mémorise dans un cookie. Aucune
 * redirection, aucun préfixe d'URL : les routes existantes ne changent pas.
 * Les visites suivantes respectent le cookie, y compris si l'utilisateur a
 * changé de langue manuellement.
 */
export function middleware(request: NextRequest) {
  const existing = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(existing)) {
    return NextResponse.next();
  }

  const detected = matchLocaleFromAcceptLanguage(request.headers.get("accept-language"));
  const response = NextResponse.next();
  response.cookies.set(LOCALE_COOKIE, detected, {
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  // Exclut les assets statiques, les fichiers internes Next.js et les
  // routes API : seule la navigation de pages déclenche la détection.
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
