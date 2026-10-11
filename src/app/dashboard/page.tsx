import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { Container } from "@/components/ui/container";
import { VerificationDashboard } from "@/components/dashboard/verification-dashboard";
import { voucherBrands } from "@/content/vouchers";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/locales";
import type { VerificationRecord } from "@/types/verification-record";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("dashboardPage");

  return buildMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/dashboard",
    keywords: ["dashboard", "statistiques", "vérifications"],
    noIndex: true,
    locale,
  });
}

function brandLabel(type: string): string {
  return voucherBrands.find((brand) => brand.id === type)?.name ?? type;
}

async function getRecords(): Promise<VerificationRecord[]> {
  const rows = await prisma.verifiedSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    brandLabel: brandLabel(row.type),
    code: row.rechargeCode ?? "",
    status: !row.formatValid ? "invalid" : row.verdict === "plausible" ? "plausible" : "suspect",
    amount: row.amount,
    currency: row.currency ?? "EUR",
    createdAt: row.createdAt.toISOString(),
  }));
}

export default async function DashboardPage() {
  const authenticated = await isAdminAuthenticated();
  const t = await getTranslations("dashboardPage");
  const tCommon = await getTranslations("common");

  const jsonLd = breadcrumbJsonLd([
    { name: tCommon("home"), path: "/" },
    { name: t("title"), path: "/dashboard" },
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

        <div className="mt-10">
          {authenticated ? (
            <VerificationDashboard
              initialRecords={await getRecords()}
              referenceDateISO={new Date().toISOString()}
            />
          ) : (
            <AdminLoginForm />
          )}
        </div>
      </Container>
    </>
  );
}
