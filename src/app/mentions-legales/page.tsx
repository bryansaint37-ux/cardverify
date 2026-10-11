import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/locales";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("legalPage");

  return buildMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/mentions-legales",
    locale,
  });
}

const sectionKeys = ["publisher", "hosting", "purpose", "liability", "ip"] as const;

export default async function MentionsLegalesPage() {
  const t = await getTranslations("legalPage");

  return (
    <Container size="sm" className="py-14 sm:py-20">
      <h1 className="text-balance text-4xl font-bold tracking-tight text-ink-1">
        {t("title")}
      </h1>
      <p className="mt-4 leading-relaxed text-ink-3">
        {t("lastUpdate", { name: siteConfig.name })}
      </p>

      <div className="mt-12 space-y-10">
        {sectionKeys.map((key) => (
          <section key={key}>
            <h2 className="text-xl font-semibold text-ink-1">
              {t(`sections.${key}.title`)}
            </h2>
            <p className="mt-3 leading-relaxed text-ink-3">
              {t(`sections.${key}.body`)}
            </p>
          </section>
        ))}
      </div>
    </Container>
  );
}
