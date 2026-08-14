import type { Metadata } from "next";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { CARD_BRANDS } from "@/lib/card-brands";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "L'algorithme de Luhn expliqué",
  description:
    "Comment fonctionne l'algorithme de Luhn : parcours à rebours, doublement un chiffre sur deux, réduction modulo 9 et test modulo 10. Avec le code TypeScript commenté et la table des préfixes IIN.",
  path: "/algorithme",
  keywords: ["Luhn", "modulo 10", "ISO 7812", "checksum", "IIN", "BIN"],
});

const jsonLd = breadcrumbJsonLd([
  { name: "Accueil", path: "/" },
  { name: "Algorithme", path: "/algorithme" },
]);

const codeSample = `export function luhnCheck(input: string): boolean {
  const digits = input.replace(/\\D+/g, "");
  let sum = 0;

  // On parcourt de droite à gauche.
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let value = Number(digits[i]);

    // Un rang sur deux est doublé, en partant de l'avant-dernier.
    const fromRight = digits.length - 1 - i;
    if (fromRight % 2 === 1) {
      value *= 2;
      if (value > 9) value -= 9; // 14 -> 5, comme 1 + 4
    }

    sum += value;
  }

  return sum % 10 === 0;
}`;

/**
 * Exemple travaillé sur « 4539 1489 » (8 chiffres, Luhn valide).
 * Le rang est compté depuis la droite : le dernier chiffre n'est jamais doublé,
 * l'avant-dernier l'est, et ainsi de suite en alternance.
 */
const walkthrough = [
  { digit: "4", doubled: true, value: 8 }, // 4 × 2 = 8
  { digit: "5", doubled: false, value: 5 },
  { digit: "3", doubled: true, value: 6 }, // 3 × 2 = 6
  { digit: "9", doubled: false, value: 9 },
  { digit: "1", doubled: true, value: 2 }, // 1 × 2 = 2
  { digit: "4", doubled: false, value: 4 },
  { digit: "8", doubled: true, value: 7 }, // 8 × 2 = 16 → 16 − 9 = 7
  { digit: "9", doubled: false, value: 9 }, // clé de contrôle
];

export default function AlgorithmePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container size="md" className="py-14 sm:py-20">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Documentation
          </p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-ink-1 sm:text-5xl">
            L&apos;algorithme de Luhn, en détail
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-3">
            Breveté en 1960 par Hans Peter Luhn, ingénieur chez IBM, ce calcul
            équipe aujourd&apos;hui les numéros de carte bancaire, les IMEI de
            téléphones et plusieurs identifiants nationaux.
          </p>
        </header>

        <div className="mt-14 space-y-16">
          {/* --- Ce que ça fait --- */}
          <section id="principe">
            <h2 className="text-2xl font-bold tracking-tight text-ink-1">
              À quoi sert une somme de contrôle
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-ink-3">
              <p>
                Une somme de contrôle ajoute de la redondance à une suite de
                chiffres pour détecter les erreurs de transmission ou de saisie.
                Le dernier chiffre d&apos;un numéro de carte, appelé{" "}
                <strong className="text-ink-2">clé de contrôle</strong>,
                n&apos;est pas choisi librement : il est calculé à partir de tous
                les précédents.
              </p>
              <p>
                Luhn détecte <strong className="text-ink-2">100 %</strong>{" "}
                des erreurs portant sur un chiffre unique, et la quasi-totalité
                des inversions de deux chiffres adjacents — les deux fautes de
                frappe les plus courantes. Sa limite connue : il ne distingue pas
                l&apos;inversion <code className="text-accent">09</code> ↔{" "}
                <code className="text-accent">90</code>.
              </p>
            </div>
          </section>

          {/* --- Les étapes --- */}
          <section id="etapes">
            <h2 className="text-2xl font-bold tracking-tight text-ink-1">
              Le calcul, étape par étape
            </h2>

            <ol className="mt-6 space-y-4">
              {[
                "Écrire le numéro et le lire de droite à gauche, en partant de la clé de contrôle.",
                "Doubler un chiffre sur deux, en commençant par l'avant-dernier (la clé n'est jamais doublée).",
                "Si un doublement dépasse 9, lui retrancher 9 — ce qui revient à additionner ses deux chiffres.",
                "Additionner toutes les valeurs obtenues.",
                "Si la somme est divisible par 10, le numéro est structurellement cohérent.",
              ].map((text, index) => (
                <li key={text} className="flex gap-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-info-border bg-info-bg text-sm font-semibold text-accent">
                    {index + 1}
                  </span>
                  <p className="pt-0.5 leading-relaxed text-ink-3">{text}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* --- Exemple chiffré --- */}
          <section id="exemple">
            <h2 className="text-2xl font-bold tracking-tight text-ink-1">
              Exemple sur 8 chiffres
            </h2>
            <p className="mt-4 leading-relaxed text-ink-3">
              Prenons <code className="font-mono text-accent">4539 1489</code>.
              La ligne du haut donne le chiffre d&apos;origine, celle du bas sa
              valeur après traitement. Le dernier <code className="font-mono text-accent">9</code>{" "}
              est la clé de contrôle : elle n&apos;est jamais doublée.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-md border-collapse text-center font-mono text-sm">
                <caption className="sr-only">
                  Décomposition du calcul de Luhn pour le numéro 4539 1489
                </caption>
                <thead>
                  <tr>
                    {walkthrough.map((cell, index) => (
                      <th
                        key={`d-${index}`}
                        scope="col"
                        className="border border-line bg-input px-3 py-2 font-normal text-ink-3"
                      >
                        {cell.digit}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {walkthrough.map((cell, index) => (
                      <td
                        key={`v-${index}`}
                        className={
                          cell.doubled
                            ? "border border-info-border bg-info-bg px-3 py-2 font-semibold text-accent"
                            : "border border-line px-3 py-2 text-ink-2"
                        }
                      >
                        {cell.value}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-5 leading-relaxed text-ink-3">
              Somme : 8 + 5 + 6 + 9 + 2 + 4 + 7 + 9 ={" "}
              <strong className="text-ink-1">50</strong>. Comme 50 modulo 10
              vaut 0, la structure est cohérente. Changez un seul chiffre et le
              reste cesse d&apos;être nul : c&apos;est tout l&apos;intérêt de la
              somme de contrôle. Les cases bleues marquent les chiffres doublés.
            </p>
          </section>

          {/* --- Code --- */}
          <section id="implementation">
            <h2 className="text-2xl font-bold tracking-tight text-ink-1">
              Implémentation TypeScript
            </h2>
            <p className="mt-4 leading-relaxed text-ink-3">
              Une fonction pure, sans dépendance, en une quinzaine de lignes. La
              version complète du site retourne en plus le détail de chaque
              étape, pour l&apos;affichage pédagogique.
            </p>

            <pre className="mt-6 overflow-x-auto rounded-2xl border border-line bg-input p-5 text-sm leading-relaxed">
              <code className="font-mono text-ink-2">{codeSample}</code>
            </pre>

            <p className="mt-4 text-sm text-ink-4">
              Source complète et commentée :{" "}
              <code className="text-ink-3">src/lib/luhn.ts</code>
            </p>
          </section>

          {/* --- Table IIN --- */}
          <section id="prefixes">
            <h2 className="text-2xl font-bold tracking-tight text-ink-1">
              Préfixes IIN et longueurs par réseau
            </h2>
            <p className="mt-4 leading-relaxed text-ink-3">
              Luhn ne dit rien du réseau émetteur. Celui-ci se déduit des
              premiers chiffres, l&apos;IIN (<em>Issuer Identification Number</em>
              ), normalisé par l&apos;ISO/IEC 7812.
            </p>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-lg border-collapse text-left text-sm">
                <thead className="bg-input">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold text-ink-2">
                      Réseau
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold text-ink-2">
                      Longueurs
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold text-ink-2">
                      Cryptogramme
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {CARD_BRANDS.map((brand) => (
                    <tr key={brand.id}>
                      <td className="px-5 py-3 font-medium text-ink-2">
                        {brand.label}
                      </td>
                      <td className="px-5 py-3 font-mono text-ink-3">
                        {brand.lengths.join(", ")}
                      </td>
                      <td className="px-5 py-3 font-mono text-ink-3">
                        {brand.cvcLength} chiffres
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* --- Limites --- */}
          <section id="limites">
            <h2 className="text-2xl font-bold tracking-tight text-ink-1">
              Ce que Luhn ne fait pas
            </h2>

            <Alert tone="warning" className="mt-6">
              Un numéro validé par Luhn n&apos;est pas un numéro valide. Il est
              simplement <em>bien formé</em>. L&apos;algorithme ignore
              l&apos;existence du compte, son solde, sa date d&apos;expiration et
              son statut. Générer des suites de chiffres qui passent le test est
              trivial — c&apos;est précisément pourquoi les réseaux de paiement
              s&apos;appuient sur une autorisation bancaire en ligne, jamais sur
              une somme de contrôle.
            </Alert>

            <p className="mt-6 leading-relaxed text-ink-3">
              L&apos;usage légitime de Luhn côté client se résume donc à un point :
              éviter un aller-retour réseau inutile quand la saisie comporte
              manifestement une faute de frappe.
            </p>
          </section>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-10 sm:flex-row">
          <ButtonLink href="/verification">
            Essayer sur la démonstration
            <Icon name="arrow-right" size={18} />
          </ButtonLink>
          <ButtonLink href="/faq" variant="outline">
            Questions fréquentes
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
