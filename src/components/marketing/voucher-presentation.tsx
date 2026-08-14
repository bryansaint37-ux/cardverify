import { Alert } from "@/components/ui/alert";
import { Card, CardBody } from "@/components/ui/card";
import { Icon, type IconName } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";

const steps: { title: string; description: string; icon: IconName }[] = [
  {
    title: "Reconnaissance du type de coupon",
    description:
      "L'interface identifierait automatiquement la marque choisie parmi Transcash, PCS, Paysafecard, Neosurf, Steam ou Apple Gift Card.",
    icon: "layers",
  },
  {
    title: "Contrôle de format",
    description:
      "La longueur et le jeu de caractères saisis seraient comparés à un gabarit théorique, à titre d'illustration seulement.",
    icon: "cpu",
  },
  {
    title: "Résultat simulé",
    description:
      "Aucune base de données réelle n'existe derrière cette page : le verdict affiché est généré au hasard, pour montrer l'interface.",
    icon: "eye",
  },
];

export function VoucherPresentation() {
  return (
    <Section id="presentation" className="border-t border-divider">
      <SectionHeading
        eyebrow="Présentation"
        title="Une maquette d'interface, pas un service réel"
        description="Ce projet illustre le design qu'aurait un outil de contrôle de coupons prépayés — sans jamais en implémenter la logique réelle."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <Reveal key={step.title} delay={index * 100} className="h-full">
            <Card interactive className="h-full">
              <CardBody>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-chip text-accent">
                  <Icon name={step.icon} size={22} />
                </span>
                <h3 className="mt-5 text-base font-semibold text-ink-1">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-3">
                  {step.description}
                </p>
              </CardBody>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={300} className="mt-10">
        <Alert tone="warning" title="Ce que cette page ne fait pas">
          Aucun code de carte n&apos;est envoyé à un serveur, comparé à une
          base de données ou vérifié auprès d&apos;un émetteur. Pour connaître
          le solde réel d&apos;une carte, utilisez exclusivement le site
          officiel de son émetteur — jamais un site tiers.
        </Alert>
      </Reveal>
    </Section>
  );
}
