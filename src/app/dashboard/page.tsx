import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { Container } from "@/components/ui/container";
import { VerificationDashboard } from "@/components/dashboard/verification-dashboard";
import { voucherBrands } from "@/content/vouchers";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import type { VerificationRecord } from "@/types/verification-record";

export const metadata: Metadata = buildMetadata({
  title: "Tableau de bord",
  description: "Statistiques, recherche, filtre et pagination sur les vérifications réellement soumises depuis /verifier.",
  path: "/dashboard",
  keywords: ["dashboard", "statistiques", "vérifications"],
  noIndex: true,
});

const jsonLd = breadcrumbJsonLd([
  { name: "Accueil", path: "/" },
  { name: "Tableau de bord", path: "/dashboard" },
]);

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container className="py-14 sm:py-20">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Administration
          </p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-ink-1 sm:text-5xl">
            Tableau de bord
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-3">
            Chaque vérification soumise depuis la page « Vérifier » est enregistrée ici,
            format valide ou non.
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
