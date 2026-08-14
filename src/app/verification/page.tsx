import type { Metadata } from "next";
import { CardForm } from "@/components/verify/card-form";
import { Alert } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Démonstration interactive",
  description:
    "Analysez la structure d'un numéro de carte en direct : détection du réseau, contrôle de longueur et calcul de Luhn décomposé chiffre par chiffre. Tout s'exécute dans votre navigateur.",
  path: "/verification",
  keywords: ["démonstration Luhn", "vérificateur de numéro", "outil pédagogique"],
});

const jsonLd = breadcrumbJsonLd([
  { name: "Accueil", path: "/" },
  { name: "Démonstration", path: "/verification" },
]);

export default function VerificationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container className="py-14 sm:py-20">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Démonstration
          </p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-ink-1 sm:text-5xl">
            Analysez un numéro, chiffre par chiffre
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-3">
            Saisissez un numéro de test et observez les quatre contrôles se
            réévaluer à chaque frappe. Le calcul complet reste dans cet onglet.
          </p>
        </header>

        <Alert tone="warning" title="N'utilisez pas de carte réelle" className="mt-8 max-w-2xl">
          Cet outil est une démonstration pédagogique. Il n&apos;interroge aucune
          banque et ne peut pas confirmer qu&apos;une carte existe. Les numéros
          de test proposés ci-dessous suffisent à tout comprendre.
        </Alert>

        <div className="mt-14">
          <CardForm />
        </div>

        <Alert tone="info" title="Pourquoi c'est sans risque ici" className="mt-14">
          Aucun appel réseau n&apos;est déclenché par la saisie, et rien
          n&apos;est écrit dans le stockage du navigateur. Vous pouvez le
          vérifier vous-même : ouvrez l&apos;onglet « Réseau » des outils de
          développement et tapez un numéro — la liste des requêtes reste vide.
          En production, un formulaire de paiement doit de toute façon passer par
          un prestataire certifié PCI DSS, jamais par votre propre serveur.
        </Alert>
      </Container>
    </>
  );
}
