import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import type { Locale } from "@/i18n/locales";
import { CARD_BRANDS } from "@/lib/card-brands";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("algorithmPage");

  return buildMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/algorithme",
    keywords: ["Luhn", "modulo 10", "ISO 7812", "checksum", "IIN", "BIN"],
    locale,
  });
}

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

export default async function AlgorithmePage() {
  const t = await getTranslations("algorithmPage");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const tCardBrands = await getTranslations("cardBrands");

  const jsonLd = breadcrumbJsonLd([
    { name: tCommon("home"), path: "/" },
    { name: tNav("items.algorithm.label"), path: "/algorithme" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container size="md" className="py-14 sm:py-20">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-ink-1 sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-3">
            {t("description")}
          </p>
        </header>

        <div className="mt-14 space-y-16">
          {/* --- Ce que ça fait --- */}
          <section id="principe">
            <h2 className="text-2xl font-bold tracking-tight text-ink-1">
              {t("principle.title")}
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-ink-3">
              <p>
                {t("principle.p1", { key: t("principle.p1Key") })}
              </p>
              <p>
                {t("principle.p2Before")}{" "}
                <strong className="text-ink-2">{t("principle.p2Percent")}</strong>{" "}
                {t("principle.p2After")}{" "}
                <code className="text-accent">09</code> ↔{" "}
                <code className="text-accent">90</code>.
              </p>
            </div>
          </section>

          {/* --- Les étapes --- */}
          <section id="etapes">
            <h2 className="text-2xl font-bold tracking-tight text-ink-1">
              {t("steps.title")}
            </h2>

            <ol className="mt-6 space-y-4">
              {[
                t("steps.items.step1"),
                t("steps.items.step2"),
                t("steps.items.step3"),
                t("steps.items.step4"),
                t("steps.items.step5"),
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
              {t("example.title")}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-3">
              {t("example.intro", { number: "4539 1489", lastDigit: "9" })}
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-md border-collapse text-center font-mono text-sm">
                <caption className="sr-only">{t("example.tableCaption")}</caption>
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
              {t("example.summary", { total: 50 })}
            </p>
          </section>

          {/* --- Code --- */}
          <section id="implementation">
            <h2 className="text-2xl font-bold tracking-tight text-ink-1">
              {t("implementation.title")}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-3">
              {t("implementation.description")}
            </p>

            <pre className="mt-6 overflow-x-auto rounded-2xl border border-line bg-input p-5 text-sm leading-relaxed">
              <code className="font-mono text-ink-2">{codeSample}</code>
            </pre>

            <p className="mt-4 text-sm text-ink-4">
              {t("implementation.sourceNote")}{" "}
              <code className="text-ink-3">src/lib/luhn.ts</code>
            </p>
          </section>

          {/* --- Table IIN --- */}
          <section id="prefixes">
            <h2 className="text-2xl font-bold tracking-tight text-ink-1">
              {t("prefixes.title")}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-3">
              {t("prefixes.description", { term: t("prefixes.term") })}
            </p>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-lg border-collapse text-left text-sm">
                <thead className="bg-input">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold text-ink-2">
                      {t("prefixes.networkColumn")}
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold text-ink-2">
                      {t("prefixes.lengthsColumn")}
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold text-ink-2">
                      {t("prefixes.cvcColumn")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {CARD_BRANDS.map((brand) => (
                    <tr key={brand.id}>
                      <td className="px-5 py-3 font-medium text-ink-2">
                        {tCardBrands(brand.id)}
                      </td>
                      <td className="px-5 py-3 font-mono text-ink-3">
                        {brand.lengths.join(", ")}
                      </td>
                      <td className="px-5 py-3 font-mono text-ink-3">
                        {t("prefixes.cvcDigits", { count: brand.cvcLength })}
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
              {t("limits.title")}
            </h2>

            <Alert tone="warning" className="mt-6">
              {t("limits.alertBody")}
            </Alert>

            <p className="mt-6 leading-relaxed text-ink-3">
              {t("limits.conclusion")}
            </p>
          </section>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-10 sm:flex-row">
          <ButtonLink href="/verification">
            {t("ctaTry")}
            <Icon name="arrow-right" size={18} />
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
