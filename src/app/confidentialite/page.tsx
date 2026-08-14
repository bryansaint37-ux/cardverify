import type { Metadata } from "next";
import { Alert } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Confidentialité",
  description:
    "Card Verify ne collecte aucune donnée personnelle : les numéros saisis sont analysés localement dans le navigateur et ne sont ni transmis, ni journalisés, ni stockés.",
  path: "/confidentialite",
});

const sections = [
  {
    title: "Aucune collecte de numéro",
    body: "Les numéros saisis dans la démonstration sont traités exclusivement par le code JavaScript exécuté dans votre navigateur. Ils ne sont transmis à aucun serveur, n'apparaissent dans aucun journal et ne sont écrits ni dans les cookies, ni dans le stockage local, ni dans le stockage de session.",
  },
  {
    title: "Cookies",
    body: "Le site ne dépose aucun cookie. Aucun traceur publicitaire, aucun outil de mesure d'audience tiers n'est intégré. Aucune bannière de consentement n'est donc nécessaire.",
  },
  {
    title: "Journaux techniques",
    body: "L'hébergeur peut conserver des journaux d'accès (adresse IP, page demandée, horodatage) pour des raisons de sécurité et d'exploitation. Ces journaux ne contiennent jamais le contenu du formulaire, celui-ci ne quittant pas le navigateur.",
  },
  {
    title: "Polices et ressources externes",
    body: "La police Inter est chargée via next/font, qui l'auto-héberge au moment de la compilation. Aucune requête n'est donc adressée à un service tiers pendant votre visite.",
  },
  {
    title: "Vos droits",
    body: "Aucune donnée personnelle n'étant collectée par le site lui-même, il n'existe pas de traitement sur lequel exercer un droit d'accès, de rectification ou d'effacement. Pour toute question, la page de contact reste à votre disposition.",
  },
];

export default function ConfidentialitePage() {
  return (
    <Container size="sm" className="py-14 sm:py-20">
      <h1 className="text-balance text-4xl font-bold tracking-tight text-ink-1">
        Politique de confidentialité
      </h1>
      <p className="mt-4 leading-relaxed text-ink-3">
        Le principe est simple : ce qui n&apos;est pas collecté ne peut pas
        fuiter.
      </p>

      <Alert tone="success" title="Vérifiable en trente secondes" className="mt-8">
        Ouvrez les outils de développement de votre navigateur, onglet
        « Réseau », puis saisissez un numéro sur la page de démonstration. Aucune
        requête n&apos;apparaît.
      </Alert>

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
