"use client";

import { motion } from "framer-motion";
import type { CardValidation } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { LuhnSteps } from "@/components/verify/luhn-steps";
import { cn } from "@/lib/utils";

type CheckRow = {
  label: string;
  passed: boolean;
  detail: string;
};

export function ResultPanel({ validation }: { validation: CardValidation }) {
  const { digits, brand, luhn, valid, issues } = validation;
  const empty = digits.length === 0;

  const checks: CheckRow[] = [
    {
      label: "Format",
      passed: digits.length >= 12 && digits.length <= 19,
      detail: `${digits.length} chiffre${digits.length > 1 ? "s" : ""} — attendu : 12 à 19`,
    },
    {
      label: "Réseau émetteur",
      passed: brand.id !== "unknown",
      detail:
        brand.id === "unknown"
          ? "Préfixe IIN non reconnu"
          : `${brand.label} — préfixe identifié`,
    },
    {
      label: "Longueur du réseau",
      passed: brand.id !== "unknown" && brand.lengths.includes(digits.length),
      detail:
        brand.id === "unknown"
          ? "Réseau inconnu, longueur non vérifiable"
          : `${brand.label} attend ${brand.lengths.join(" ou ")} chiffres`,
    },
    {
      label: "Somme de Luhn",
      passed: luhn.valid,
      detail: `Total ${luhn.sum} — reste ${luhn.sum % 10} modulo 10`,
    },
  ];

  return (
    <div className="space-y-6" aria-live="polite">
      {/* Verdict global */}
      <motion.div
        layout
        className={cn(
          "glass flex items-center gap-4 rounded-2xl border p-5 transition-colors",
          empty ? "" : valid ? "border-success-border bg-success-bg" : "border-danger-border bg-danger-bg",
        )}
      >
        <span
          className={cn(
            "grid h-12 w-12 shrink-0 place-items-center rounded-full",
            empty
              ? "bg-chip text-ink-4"
              : valid
                ? "bg-success-icon-bg text-success-icon"
                : "bg-danger-icon-bg text-danger-icon",
          )}
        >
          <Icon name={empty ? "card" : valid ? "check" : "cross"} size={24} />
        </span>

        <div className="min-w-0">
          <p className="font-semibold text-ink-1">
            {empty
              ? "En attente d'un numéro"
              : valid
                ? "Structure cohérente"
                : "Structure incohérente"}
          </p>
          <p className="mt-0.5 text-sm text-ink-3">
            {empty
              ? "Le résultat s'affichera à la première frappe."
              : valid
                ? "Le numéro respecte le format, la plage du réseau et la somme de Luhn."
                : "Un contrôle au moins a échoué — voir le détail ci-dessous."}
          </p>
        </div>
      </motion.div>

      {/* Rappel indispensable */}
      {valid && !empty ? (
        <p className="rounded-xl border border-warning-border bg-warning-bg px-4 py-3 text-xs leading-relaxed text-warning">
          « Structure cohérente » signifie uniquement que les chiffres sont
          mathématiquement bien formés. Cela ne dit rien de l&apos;existence de
          la carte, de son solde ni de sa validité auprès d&apos;une banque.
        </p>
      ) : null}

      {/* Détail des contrôles */}
      <ul className="glass divide-y divide-line rounded-2xl">
        {checks.map((check) => (
          <li key={check.label} className="flex items-start gap-3 px-5 py-4">
            <span
              className={cn(
                "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full",
                empty
                  ? "bg-chip text-ink-4"
                  : check.passed
                    ? "bg-success-icon-bg text-success-icon"
                    : "bg-danger-icon-bg text-danger-icon",
              )}
            >
              <Icon name={check.passed && !empty ? "check" : "cross"} size={12} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink-2">{check.label}</p>
              <p className="mt-0.5 text-xs text-ink-4">{check.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Messages d'erreur explicites */}
      {!empty && issues.length > 0 ? (
        <ul className="space-y-2">
          {issues.map((issue) => (
            <li key={issue.code} className="flex items-start gap-2 text-sm text-danger">
              <Icon name="warning" size={16} className="mt-0.5 shrink-0" />
              {issue.message}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Décomposition du calcul */}
      <div className="glass rounded-2xl p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-ink-2">Décomposition du calcul</h3>
          {!empty ? (
            <Badge tone={luhn.valid ? "success" : "danger"}>
              {luhn.valid ? "Luhn validé" : "Luhn invalidé"}
            </Badge>
          ) : null}
        </div>

        <LuhnSteps luhn={luhn} />
      </div>
    </div>
  );
}
