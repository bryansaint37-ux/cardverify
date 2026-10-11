import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Alert } from "@/components/ui/alert";
import { Card, CardBody } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/i18n/locales";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("aboutPage");

  return buildMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/a-propos",
    locale,
  });
}

const stackKeys = ["nextjs", "typescript", "tailwind", "zeroDep"] as const;

export default async function AProposPage() {
  const t = await getTranslations("aboutPage");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  const jsonLd = breadcrumbJsonLd([
    { name: tCommon("home"), path: "/" },
    { name: tNav("items.about.label"), path: "/a-propos" },
  ]);

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

        <div className="mt-14 space-y-14">
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-ink-1">
              {t("why.title")}
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-ink-3">
              <p>{t("why.p1")}</p>
              <p>{t("why.p2")}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-ink-1">
              {t("stack.title")}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {stackKeys.map((key) => (
                <Card key={key}>
                  <CardBody>
                    <h3 className="font-semibold text-ink-1">
                      {t(`stack.items.${key}.name`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-3">
                      {t(`stack.items.${key}.detail`)}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-ink-1">
              {t("scope.title")}
            </h2>

            <Alert tone="warning" className="mt-6">
              {t("scope.alertBody")}
            </Alert>

            <div className="mt-6 space-y-4 leading-relaxed text-ink-3">
              <p>{t("scope.p1", { pciDss: "PCI DSS" })}</p>
              <p>{t("scope.p2")}</p>
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
