import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFoundPage");

  return {
    title: t("meta.title"),
    robots: { index: false, follow: false },
  };
}

export default async function NotFound() {
  const t = await getTranslations("notFoundPage");

  return (
    <Container size="sm" className="py-24 text-center sm:py-32">
      <p className="font-mono text-6xl font-bold tracking-tight text-line-soft">
        404
      </p>
      <h1 className="mt-6 text-balance text-3xl font-bold tracking-tight text-ink-1 sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-ink-3">
        {t("description")}
      </p>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/">{t("ctaHome")}</ButtonLink>
        <ButtonLink href="/verification" variant="outline">
          {t("ctaDemo")}
        </ButtonLink>
      </div>
    </Container>
  );
}
