import type { Metadata } from "next";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { faqEntries } from "@/content/faq";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Questions fréquentes",
  description:
    "Ce que Card Verify vérifie réellement, où vont vos saisies, pourquoi un numéro validé par Luhn peut être refusé par une banque, et comment réutiliser le code.",
  path: "/faq",
  keywords: ["FAQ", "Luhn", "sécurité", "vie privée"],
});

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Accueil", path: "/" },
    { name: "FAQ", path: "/faq" },
  ]),
  faqJsonLd(faqEntries),
];

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container size="md" className="py-14 sm:py-20">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Aide
          </p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-ink-1 sm:text-5xl">
            Questions fréquentes
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-3">
            Les réponses aux confusions les plus courantes autour de la
            validation d&apos;un numéro de carte.
          </p>
        </header>

        <div className="mt-12">
          <FaqAccordion entries={faqEntries} />
        </div>

        <div className="mt-14 rounded-2xl border border-line bg-card p-8 text-center">
          <h2 className="text-xl font-semibold text-ink-1">
            Une question sans réponse ?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-3">
            Le projet est pédagogique et ouvert aux suggestions. Écrivez-nous, ou
            lisez d&apos;abord l&apos;explication complète de l&apos;algorithme.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/contact" size="sm">
              Nous écrire
            </ButtonLink>
            <ButtonLink href="/algorithme" variant="outline" size="sm">
              Lire la documentation
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  );
}
