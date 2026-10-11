import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { CardForm } from "@/components/verify/card-form";
import { Alert } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { isLocale } from "@/i18n/locales";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("demoPage");

  return buildMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/verification",
    keywords: ["démonstration Luhn", "vérificateur de numéro", "outil pédagogique"],
    locale: isLocale(locale) ? locale : undefined,
  });
}

export default async function VerificationPage() {
  const t = await getTranslations("demoPage");
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");

  const jsonLd = breadcrumbJsonLd([
    { name: tCommon("home"), path: "/" },
    { name: tNav("items.demo.label"), path: "/verification" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container className="py-14 sm:py-20">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-ink-1 sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-3">
            {t("description")}
          </p>
        </header>

        <Alert tone="warning" title={t("warningTitle")} className="mt-8 max-w-2xl">
          {t("warningBody")}
        </Alert>

        <div className="mt-14">
          <CardForm />
        </div>

        <Alert tone="info" title={t("infoTitle")} className="mt-14">
          {t("infoBody")}
        </Alert>
      </Container>
    </>
  );
}
