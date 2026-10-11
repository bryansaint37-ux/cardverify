"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { CardValidation } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { LuhnSteps } from "@/components/verify/luhn-steps";
import { formatCardIssue } from "@/lib/validate-card";
import { cn } from "@/lib/utils";

type CheckRow = {
  label: string;
  passed: boolean;
  detail: string;
};

export function ResultPanel({ validation }: { validation: CardValidation }) {
  const t = useTranslations();
  const { digits, brand, luhn, valid, issues } = validation;
  const empty = digits.length === 0;

  const brandName = t(`cardBrands.${brand.id}`);

  const checks: CheckRow[] = [
    {
      label: t("demoPage.resultPanel.checks.format"),
      passed: digits.length >= 12 && digits.length <= 19,
      detail: t("demoPage.resultPanel.checks.formatDetail", { count: digits.length }),
    },
    {
      label: t("demoPage.resultPanel.checks.network"),
      passed: brand.id !== "unknown",
      detail:
        brand.id === "unknown"
          ? t("demoPage.resultPanel.checks.networkUnknown")
          : t("demoPage.resultPanel.checks.networkDetected", { brand: brandName }),
    },
    {
      label: t("demoPage.resultPanel.checks.networkLength"),
      passed: brand.id !== "unknown" && brand.lengths.includes(digits.length),
      detail:
        brand.id === "unknown"
          ? t("demoPage.resultPanel.checks.networkLengthUnknown")
          : t("demoPage.resultPanel.checks.networkLengthDetail", {
              brand: brandName,
              lengths: brand.lengths.join(t("cardValidation.lengthsSeparator")),
            }),
    },
    {
      label: t("demoPage.resultPanel.checks.luhnSum"),
      passed: luhn.valid,
      detail: t("demoPage.resultPanel.checks.luhnSumDetail", {
        sum: luhn.sum,
        remainder: luhn.sum % 10,
      }),
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
              ? t("demoPage.resultPanel.emptyTitle")
              : valid
                ? t("demoPage.resultPanel.validTitle")
                : t("demoPage.resultPanel.invalidTitle")}
          </p>
          <p className="mt-0.5 text-sm text-ink-3">
            {empty
              ? t("demoPage.resultPanel.emptyDetail")
              : valid
                ? t("demoPage.resultPanel.validDetail")
                : t("demoPage.resultPanel.invalidDetail")}
          </p>
        </div>
      </motion.div>

      {/* Rappel indispensable */}
      {valid && !empty ? (
        <p className="rounded-xl border border-warning-border bg-warning-bg px-4 py-3 text-xs leading-relaxed text-warning">
          {t("demoPage.resultPanel.disclaimer")}
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
              {formatCardIssue(t, brand, issue)}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Décomposition du calcul */}
      <div className="glass rounded-2xl p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-ink-2">
            {t("demoPage.resultPanel.breakdownTitle")}
          </h3>
          {!empty ? (
            <Badge tone={luhn.valid ? "success" : "danger"}>
              {luhn.valid
                ? t("demoPage.resultPanel.luhnValid")
                : t("demoPage.resultPanel.luhnInvalid")}
            </Badge>
          ) : null}
        </div>

        <LuhnSteps luhn={luhn} />
      </div>
    </div>
  );
}
