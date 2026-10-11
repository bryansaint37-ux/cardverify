import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { VoucherCheckDemo } from "@/components/verify/voucher-check-demo";
import { isLocale } from "@/i18n/locales";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("verifyPage");

  return buildMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/verifier",
    keywords: ["formulaire", "coupon", "vérification", "carte cadeau"],
    locale: isLocale(locale) ? locale : undefined,
  });
}

export default async function VerifierPage() {
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");

  const jsonLd = breadcrumbJsonLd([
    { name: tCommon("home"), path: "/" },
    { name: tNav("items.verify.label"), path: "/verifier" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <VoucherCheckDemo />
    </>
  );
}
