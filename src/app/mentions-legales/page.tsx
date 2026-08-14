import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Mentions légales",
  description:
    "Éditeur, hébergeur, propriété intellectuelle et limitation de responsabilité du site de démonstration Card Verify.",
  path: "/mentions-legales",
});

const sections = [
  {
    title: "Éditeur du site",
    body: `Ce site est un projet de démonstration pédagogique publié à titre non commercial. Remplacez ce paragraphe par la raison sociale, la forme juridique, l'adresse du siège, le numéro d'immatriculation et le nom du directeur de la publication avant toute mise en ligne réelle.`,
  },
  {
    title: "Hébergement",
    body: `Indiquez ici le nom, l'adresse postale et le numéro de téléphone de votre hébergeur, conformément à l'article 6 III de la loi pour la confiance dans l'économie numérique.`,
  },
  {
    title: "Objet du service",
    body: `Card Verify illustre le fonctionnement de l'algorithme de Luhn. Il n'est pas un service de vérification bancaire, n'interroge aucun établissement financier et ne permet en aucun cas de confirmer l'existence, la validité ou la solvabilité d'un moyen de paiement.`,
  },
  {
    title: "Limitation de responsabilité",
    body: `Le contenu est fourni à titre informatif, sans garantie d'exactitude ni d'exhaustivité. L'éditeur ne saurait être tenu responsable d'un usage détourné de la démonstration, ni des conséquences d'une décision prise sur la seule base des résultats affichés.`,
  },
  {
    title: "Propriété intellectuelle",
    body: `Les marques et logos des réseaux de paiement cités appartiennent à leurs titulaires respectifs et ne sont mentionnés qu'à des fins descriptives. Aucun partenariat ni affiliation n'est suggéré.`,
  },
];

export default function MentionsLegalesPage() {
  return (
    <Container size="sm" className="py-14 sm:py-20">
      <h1 className="text-balance text-4xl font-bold tracking-tight text-ink-1">
        Mentions légales
      </h1>
      <p className="mt-4 leading-relaxed text-ink-3">
        Dernière mise à jour : à compléter lors de la publication de{" "}
        {siteConfig.name}.
      </p>

      <div className="mt-12 space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold text-ink-1">
              {section.title}
            </h2>
            <p className="mt-3 leading-relaxed text-ink-3">{section.body}</p>
          </section>
        ))}
      </div>
    </Container>
  );
}
