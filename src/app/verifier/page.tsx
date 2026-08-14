import type { Metadata } from "next";
import { VoucherCheckDemo } from "@/components/verify/voucher-check-demo";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Vérifier un coupon",
  description:
    "Formulaire de vérification : sélection du type, saisie du montant, choix de la devise et affichage d'un résultat clair.",
  path: "/verifier",
  keywords: ["formulaire", "coupon", "vérification", "carte cadeau"],
});

const jsonLd = breadcrumbJsonLd([
  { name: "Accueil", path: "/" },
  { name: "Vérifier", path: "/verifier" },
]);

export default function VerifierPage() {
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
