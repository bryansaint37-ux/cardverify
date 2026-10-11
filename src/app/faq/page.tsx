import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { faqEntryKeys, type FaqEntry } from "@/content/faq";
import { isLocale } from "@/i18n/locales";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("faqPage");

  return buildMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/faq",
    keywords: ["FAQ", "Luhn", "sécurité", "vie privée"],
    locale: isLocale(locale) ? locale : undefined,
  });
}

export default async function FaqPage() {
  const t = await getTranslations("faqPage");
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");

  const entries: FaqEntry[] = faqEntryKeys.map((key) => ({
    question: t(`entries.${key}.question`),
    answer: t(`entries.${key}.answer`),
  }));

  const jsonLd = [
    breadcrumbJsonLd([
      { name: tCommon("home"), path: "/" },
      { name: tNav("items.faq.label"), path: "/faq" },
    ]),
    faqJsonLd(entries),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container size="md" className="py-14 sm:py-20">
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

        <div className="mt-12">
          <FaqAccordion entries={entries} />
        </div>

        <div className="mt-14 rounded-2xl border border-line bg-card p-8 text-center">
          <h2 className="text-xl font-semibold text-ink-1">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-3">
            {t("ctaDescription")}
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/contact" size="sm">
              {t("ctaContact")}
            </ButtonLink>
            <ButtonLink href="/algorithme" variant="outline" size="sm">
              {t("ctaDocs")}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  );
}
