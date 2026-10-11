import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { isLocale } from "@/i18n/locales";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("home");

  return buildMetadata({
    title: t("meta.title"),
    path: "/",
    noIndex: true,
    locale: isLocale(locale) ? locale : undefined,
  });
}

export default function HomePage() {
  redirect("/verifier");
}
