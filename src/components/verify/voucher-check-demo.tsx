"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardSelector } from "@/components/ui/card-selector";
import { InputCode } from "@/components/ui/input-code";
import { ResultCard } from "@/components/ui/result-card";
import { Section, SectionHeading } from "@/components/ui/section";
import { defaultVoucherBrand, voucherBrands } from "@/content/vouchers";
import { formatVoucherIssue, validateVoucherFormat } from "@/lib/validate-voucher";
import { VoucherPreview } from "@/components/verify/voucher-preview";

const currencies = [
  { id: "EUR", label: "EUR (€)", gradient: "from-emerald-400 to-teal-500" },
  { id: "USD", label: "USD ($)", gradient: "from-sky-400 to-indigo-600" },
  { id: "GBP", label: "GBP (£)", gradient: "from-violet-400 to-fuchsia-600" },
];

const PHASE_DELAY = 800;

type Status = "idle" | "running" | "done";
type SimulationResult = {
  outcome: "zero" | "amount";
  balance: string;
  verdict: "plausible" | "suspect";
};
type VerifyResponse = {
  status: "success" | "error";
  message?: string;
  result?: {
    amount?: number;
    verdict?: "plausible" | "suspect";
  };
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function VoucherCheckDemo() {
  const t = useTranslations();
  const locale = useLocale();
  const [brandId, setBrandId] = useState(defaultVoucherBrand.id);
  const [currency, setCurrency] = useState<string>(currencies[0]!.id);
  const [amount, setAmount] = useState("");
  const [rechargeCode, setRechargeCode] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [phase, setPhase] = useState(0);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const timeoutsRef = useRef<number[]>([]);

  const loadingPhases = [
    t("verifyPage.loadingPhases.preparing"),
    t("verifyPage.loadingPhases.analyzing"),
    t("verifyPage.loadingPhases.finalizing"),
  ];

  function formatCurrency(value: number, currencyCode: string) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  const selectedBrand =
    voucherBrands.find((brand) => brand.id === brandId) ?? defaultVoucherBrand;

  // Revalidée à chaque frappe et à chaque changement de type de carte : le
  // gabarit attendu (longueur, jeu de caractères) change selon la marque.
  const codeValidation = useMemo(
    () => (rechargeCode.trim() ? validateVoucherFormat(brandId, rechargeCode) : null),
    [brandId, rechargeCode],
  );

  const codeState: "default" | "success" | "error" = !rechargeCode.trim()
    ? "default"
    : codeValidation?.valid
      ? "success"
      : "error";

  const codeHint = !rechargeCode.trim()
    ? t("verifyPage.codeHintDefault", {
        hint: t(`cardFormats.${brandId}.hint`),
        example: t(`cardFormats.${brandId}.example`),
      })
    : codeValidation?.valid
      ? t("verifyPage.codeHintSuccess")
      : (codeValidation?.issues
          .map((issue) => formatVoucherIssue(t, brandId, selectedBrand.name, issue))
          .join(" ") ?? "");

  const parsedAmount = useMemo(() => {
    const value = Number(amount.replace(",", "."));
    return Number.isFinite(value) ? value : NaN;
  }, [amount]);

  const canSubmit =
    status !== "running" &&
    isValidEmail(email) &&
    parsedAmount > 0 &&
    amount.trim() !== "" &&
    rechargeCode.trim() !== "";

  useEffect(() => {
    return () => timeoutsRef.current.forEach((id) => window.clearTimeout(id));
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    if (!isValidEmail(email)) {
      setError(t("verifyPage.errors.invalidEmail"));
      return;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError(t("verifyPage.errors.invalidAmount"));
      return;
    }

    if (rechargeCode.trim() === "") {
      setError(t("verifyPage.errors.missingCode"));
      return;
    }

    setError(null);
    setStatus("running");
    setPhase(0);
    setResult(null);

    timeoutsRef.current.forEach((id) => window.clearTimeout(id));

    const verificationRequest = fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: brandId,
        amount: parsedAmount,
        currency,
        rechargeCode,
        email,
      }),
    });

    const phaseTimers = loadingPhases.map((_, index) =>
      window.setTimeout(() => setPhase(index), PHASE_DELAY * index),
    );

    const finishTimer = window.setTimeout(async () => {
      try {
        const response = await verificationRequest;
        const text = await response.text();
        let data: VerifyResponse | null = null;

        if (text) {
          try {
            data = JSON.parse(text);
          } catch {
            throw new Error(t("verifyPage.errors.invalidServerResponse"));
          }
        }

        if (!response.ok) {
          throw new Error(data?.message || text || t("verifyPage.errors.verificationFailed"));
        }

        if (data?.status !== "success") {
          throw new Error(data?.message || t("verifyPage.errors.verificationFailed"));
        }

        const amountValue = Number(data.result?.amount ?? parsedAmount);
        setResult({
          outcome: amountValue > 0 ? "amount" : "zero",
          balance: formatCurrency(amountValue, currency),
          verdict: data.result?.verdict ?? "suspect",
        });
        setStatus("done");
        setAttempt((current) => current + 1);
      } catch (error) {
        setStatus("idle");
        setError(error instanceof Error ? error.message : t("verifyPage.errors.unableToVerify"));
      }
    }, PHASE_DELAY * loadingPhases.length + 200);

    timeoutsRef.current = [...phaseTimers, finishTimer];
  }

  return (
    <Section id="verifier" className="border-t border-divider">
      <SectionHeading
        eyebrow={t("verifyPage.eyebrow")}
        title={t("verifyPage.title")}
        description={t("verifyPage.description")}
        as="h1"
      />

      <div className="mx-auto mt-12 grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.95fr] lg:gap-10">
        <div className="space-y-8">
          <div className="glass rounded-[2rem] border border-line-soft p-8 shadow-2xl shadow-slate-900/5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">
                  {t("verifyPage.formEyebrow")}
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-1 sm:text-4xl">
                  {t("verifyPage.formTitle")}
                </h2>
              </div>
              <Badge tone="neutral">{t("verifyPage.couponBadge")}</Badge>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
              <div className="grid gap-5 lg:grid-cols-2">
                <CardSelector
                  label={t("verifyPage.cardTypeLabel")}
                  options={voucherBrands.map((brand) => ({
                    id: brand.id,
                    label: brand.name,
                    gradient: brand.gradient,
                    logo: brand.logo,
                  }))}
                  value={brandId}
                  onChange={setBrandId}
                />
                <CardSelector
                  label={t("verifyPage.currencyLabel")}
                  options={currencies}
                  value={currency}
                  onChange={setCurrency}
                />
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <InputCode
                  label={t("verifyPage.amountLabel")}
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="50"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  hint={t("verifyPage.amountHint")}
                />
                <InputCode
                  label={t("verifyPage.codeLabel")}
                  placeholder={t(`cardFormats.${brandId}.example`)}
                  value={rechargeCode}
                  onChange={(event) => setRechargeCode(event.target.value)}
                  hint={codeHint}
                  state={codeState}
                />
              </div>
              <div className="grid gap-5 lg:grid-cols-2">
                <InputCode
                  label={t("verifyPage.emailLabel")}
                  type="email"
                  placeholder="exemple@domaine.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  hint={t("verifyPage.emailHint")}
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-sm leading-6 text-ink-4">
                  {t("verifyPage.footerNote")}
                </p>
                <Button type="submit" disabled={!canSubmit} className="w-full sm:w-auto">
                  {status === "running" ? loadingPhases[phase] : t("verifyPage.submit")}
                </Button>
              </div>

              {error ? (
                <Alert tone="danger" className="rounded-3xl">
                  {error}
                </Alert>
              ) : null}
            </form>
          </div>

          <div className="relative mx-auto w-full max-w-2xl" style={{ perspective: 850 }}>
            <VoucherPreview brand={selectedBrand} code={rechargeCode} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-[2rem] border border-line-soft p-8 shadow-2xl shadow-slate-900/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">
                  {t("verifyPage.result.eyebrow")}
                </p>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink-1">
                  {t("verifyPage.result.title")}
                </h3>
              </div>
              <span className="rounded-2xl bg-chip px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-ink-4">
                {t("verifyPage.result.responsiveBadge")}
              </span>
            </div>

            <div className="mt-8 space-y-5">
              <AnimatePresence mode="wait">
                {status === "running" ? (
                  <motion.div
                    key="progress"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-3xl border border-line-soft bg-card p-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                      <p className="text-sm font-semibold text-ink-1">
                        {t("verifyPage.result.analyzing")}
                      </p>
                      <p className="mt-2 text-sm text-ink-4">
                        {t("verifyPage.result.analyzingDetail")}
                        </p>
                      </div>
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-accent/10 text-accent">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                      </span>
                    </div>
                  </motion.div>
                ) : status === "done" && result ? (
                  <motion.div
                    key={`result-${attempt}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-5"
                  >
                    <ResultCard
                      tone={result.outcome === "amount" ? "success" : "warning"}
                      title={t("verifyPage.result.balanceTitle")}
                      description={
                        <div className="space-y-2">
                          <p className="text-3xl font-semibold text-ink-1">{result.balance}</p>
                          <p className="text-sm text-ink-4">
                            {result.outcome === "amount"
                              ? t("verifyPage.result.balanceDetailAmount")
                              : t("verifyPage.result.balanceDetailZero")}
                          </p>
                        </div>
                      }
                    />

                    <div className="grid gap-3 rounded-3xl border border-line-soft bg-card p-5 text-sm text-ink-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-ink-4">
                          {t("verifyPage.result.typeLabel")}
                        </p>
                        <p className="mt-2 font-medium text-ink-1">{selectedBrand.name}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-ink-4">
                          {t("verifyPage.result.currencyLabel")}
                        </p>
                        <p className="mt-2 font-medium text-ink-1">{currency}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-ink-4">
                          {t("verifyPage.result.amountLabel")}
                        </p>
                        <p className="mt-2 font-medium text-ink-1">
                          {formatCurrency(parsedAmount, currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-ink-4">
                          {t("verifyPage.result.codeLabel")}
                        </p>
                        <p className="mt-2 truncate font-medium text-ink-1">
                          {codeValidation?.normalized ?? rechargeCode}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-ink-4">
                          {t("verifyPage.result.emailLabel")}
                        </p>
                        <p className="mt-2 truncate font-medium text-ink-1">{email}</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-3xl border border-line-soft bg-card p-8 text-center"
                  >
                    <p className="text-sm text-ink-3">{t("verifyPage.result.placeholder")}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
