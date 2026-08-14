import type { Metadata } from "next";
import { Alert } from "@/components/ui/alert";
import { Card, CardBody } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "À propos du projet",
  description:
    "Card Verify est un projet pédagogique open source construit avec Next.js 15, TypeScript et Tailwind CSS pour illustrer l'algorithme de Luhn et les bonnes pratiques d'un formulaire de paiement.",
  path: "/a-propos",
});

const jsonLd = breadcrumbJsonLd([
  { name: "Accueil", path: "/" },
  { name: "À propos", path: "/a-propos" },
]);

const stack = [
  {
    name: "Next.js 15",
    detail:
      "App Router, composants serveur par défaut, métadonnées et sitemap générés par le framework.",
  },
  {
    name: "TypeScript",
    detail:
      "Mode strict, types explicites sur toute la logique métier, aucune assertion `any`.",
  },
  {
    name: "Tailwind CSS v4",
    detail:
      "Thème déclaré en CSS, aucune feuille de style hors du système d'utilitaires.",
  },
  {
    name: "Zéro dépendance métier",
    detail:
      "L'algorithme, le formatage et la détection de réseau tiennent dans trois fichiers autonomes.",
  },
];

export default function AProposPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container size="md" className="py-14 sm:py-20">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Le projet
          </p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-ink-1 sm:text-5xl">
            Un site pour apprendre, pas pour vérifier
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-3">
            Card Verify existe pour rendre visible un calcul que la plupart des
            formulaires de paiement exécutent en silence.
          </p>
        </header>

        <div className="mt-14 space-y-14">
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-ink-1">
              Pourquoi ce projet
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-ink-3">
              <p>
                Quand un formulaire affiche « numéro de carte invalide » avant
                même d&apos;avoir contacté la banque, il applique l&apos;algorithme
                de Luhn. Ce contrôle est partout, et pourtant rarement expliqué :
                on en retient souvent qu&apos;il « vérifie la carte », ce qui est
                faux et prête à confusion.
              </p>
              <p>
                Ce site sépare donc clairement les trois niveaux : la cohérence
                mathématique du numéro, l&apos;identification du réseau émetteur,
                et l&apos;autorisation bancaire — qui, elle, n&apos;a rien à faire
                dans un navigateur.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-ink-1">
              Choix techniques
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {stack.map((item) => (
                <Card key={item.name}>
                  <CardBody>
                    <h3 className="font-semibold text-ink-1">{item.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-3">
                      {item.detail}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-ink-1">
              Périmètre assumé
            </h2>

            <Alert tone="warning" className="mt-6">
              Card Verify n&apos;est pas un service de vérification bancaire et ne
              le deviendra pas. Il n&apos;interroge aucun réseau de paiement,
              n&apos;expose aucune base de BIN et ne conserve aucune saisie.
              Toute utilisation visant à tester des numéros réels sort du cadre
              du projet.
            </Alert>

            <div className="mt-6 space-y-4 leading-relaxed text-ink-3">
              <p>
                En production, un formulaire de paiement doit confier la saisie à
                un prestataire certifié{" "}
                <strong className="text-ink-2">PCI DSS</strong>, via un champ
                hébergé ou un jeton. Votre application ne devrait jamais voir un
                numéro de carte en clair, et encore moins le journaliser.
              </p>
              <p>
                Le contrôle de Luhn côté client garde malgré tout son intérêt :
                afficher instantanément une faute de frappe, sans réseau et sans
                attente.
              </p>
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
