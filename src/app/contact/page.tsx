import type { Metadata } from "next";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Une question sur l'algorithme de Luhn, une correction à proposer ou une suggestion pédagogique ? Écrivez à l'équipe de Card Verify.",
  path: "/contact",
});

const jsonLd = breadcrumbJsonLd([
  { name: "Accueil", path: "/" },
  { name: "Contact", path: "/contact" },
]);

const fieldClass =
  "mt-2 w-full rounded-xl border border-line-soft bg-input px-4 py-3 text-ink-1 placeholder:text-ink-4 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-app";

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container size="sm" className="py-14 sm:py-20">
        <header>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Contact
          </p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-ink-1 sm:text-5xl">
            Nous écrire
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-3">
            Correction, précision technique, suggestion pédagogique : toutes les
            remarques sont bienvenues.
          </p>
        </header>

        <Alert tone="info" className="mt-8">
          Ce formulaire est une maquette : il n&apos;envoie rien et ne conserve
          rien. Branchez-y votre propre service d&apos;envoi (route API,
          fournisseur transactionnel) avant toute mise en ligne.
        </Alert>

        <form className="mt-10 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink-2">
                Nom
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Camille Dupont"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink-2">
                Adresse e-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="camille@exemple.fr"
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-ink-2">
              Sujet
            </label>
            <select id="subject" name="subject" className={fieldClass} defaultValue="question">
              <option value="question">Question sur l&apos;algorithme</option>
              <option value="correction">Signaler une erreur</option>
              <option value="suggestion">Suggestion pédagogique</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-ink-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              placeholder="Votre message…"
              className={`${fieldClass} resize-y`}
            />
            <p className="mt-2 text-xs text-ink-4">
              N&apos;incluez jamais de numéro de carte réel dans un message.
            </p>
          </div>

          <Button type="submit" disabled>
            Envoyer (désactivé en démonstration)
          </Button>
        </form>
      </Container>
    </>
  );
}
