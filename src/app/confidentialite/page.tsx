import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Alert } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/i18n/locales";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("privacyPage");

  return buildMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/confidentialite",
    locale,
  });
}

const sectionKeys = ["noCollection", "cookies", "logs", "fonts", "rights"] as const;

export default async function ConfidentialitePage() {
  const t = await getTranslations("privacyPage");

  return (
    <Container size="sm" className="py-14 sm:py-20">
      <h1 className="text-balance text-4xl font-bold tracking-tight text-ink-1">
        {t("title")}
      </h1>
      <p className="mt-4 leading-relaxed text-ink-3">{t("intro")}</p>

      <Alert tone="success" title={t("verifyAlertTitle")} className="mt-8">
        {t("verifyAlertBody")}
      </Alert>

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
