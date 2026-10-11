import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/i18n/locales";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("contactPage");

  return buildMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/contact",
    locale,
  });
}

const fieldClass =
  "mt-2 w-full rounded-xl border border-line-soft bg-input px-4 py-3 text-ink-1 placeholder:text-ink-4 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-app";

export default async function ContactPage() {
  const t = await getTranslations("contactPage");
  const tCommon = await getTranslations("common");

  const jsonLd = breadcrumbJsonLd([
    { name: tCommon("home"), path: "/" },
    { name: t("eyebrow"), path: "/contact" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container size="sm" className="py-14 sm:py-20">
        <header>
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

        <Alert tone="info" className="mt-8">
          {t("mockNotice")}
        </Alert>

        <form className="mt-10 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink-2">
                {t("nameLabel")}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder={t("namePlaceholder")}
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink-2">
                {t("emailLabel")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-ink-2">
              {t("subjectLabel")}
            </label>
            <select id="subject" name="subject" className={fieldClass} defaultValue="question">
              <option value="question">{t("subjectOptions.question")}</option>
              <option value="correction">{t("subjectOptions.correction")}</option>
              <option value="suggestion">{t("subjectOptions.suggestion")}</option>
              <option value="autre">{t("subjectOptions.other")}</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-ink-2">
              {t("messageLabel")}
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              placeholder={t("messagePlaceholder")}
              className={`${fieldClass} resize-y`}
            />
            <p className="mt-2 text-xs text-ink-4">{t("messageHint")}</p>
          </div>

          <Button type="submit" disabled>
            {t("submit")}
          </Button>
        </form>
      </Container>
    </>
  );
}
