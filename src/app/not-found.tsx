import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container size="sm" className="py-24 text-center sm:py-32">
      <p className="font-mono text-6xl font-bold tracking-tight text-line-soft">
        404
      </p>
      <h1 className="mt-6 text-balance text-3xl font-bold tracking-tight text-ink-1 sm:text-4xl">
        Cette page n&apos;existe pas
      </h1>
      <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-ink-3">
        Le lien est peut-être obsolète, ou l&apos;adresse comporte une faute de
        frappe — l&apos;algorithme de Luhn n&apos;aide malheureusement pas pour
        les URL.
      </p>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
        <ButtonLink href="/verification" variant="outline">
          Aller à la démonstration
        </ButtonLink>
      </div>
    </Container>
  );
}
