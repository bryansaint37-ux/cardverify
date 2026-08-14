"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardSelector } from "@/components/ui/card-selector";
import { InputCode } from "@/components/ui/input-code";
import { ResultCard } from "@/components/ui/result-card";
import { Section, SectionHeading } from "@/components/ui/section";
import { defaultVoucherBrand, voucherBrands } from "@/content/vouchers";
import { VoucherPreview } from "@/components/verify/voucher-preview";

const currencies = [
  { id: "EUR", label: "EUR (€)", gradient: "from-emerald-400 to-teal-500" },
  { id: "USD", label: "USD ($)", gradient: "from-sky-400 to-indigo-600" },
  { id: "GBP", label: "GBP (£)", gradient: "from-violet-400 to-fuchsia-600" },
];

const LOADING_PHASES = [
  "Préparation en cours…",
  "Analyse des données…",
  "Finalisation du verdict…",
];
const PHASE_DELAY = 800;

type Status = "idle" | "running" | "done";
type SimulationResult = {
  outcome: "zero" | "amount";
  balance: string;
  verdict: "plausible" | "suspect";
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function VoucherCheckDemo() {
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

  const selectedBrand =
    voucherBrands.find((brand) => brand.id === brandId) ?? defaultVoucherBrand;

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
      setError("Veuillez saisir une adresse e-mail valide.");
      return;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Veuillez saisir un montant supérieur à 0.");
      return;
    }

    if (rechargeCode.trim() === "") {
      setError("Veuillez saisir le code de recharge.");
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

    const phaseTimers = LOADING_PHASES.map((_, index) =>
      window.setTimeout(() => setPhase(index), PHASE_DELAY * index),
    );

    const finishTimer = window.setTimeout(async () => {
      try {
        const response = await verificationRequest;
        const text = await response.text();
        let data: any = null;

        if (text) {
          try {
            data = JSON.parse(text);
          } catch {
            throw new Error("Réponse JSON invalide du serveur.");
          }
        }

        if (!response.ok) {
          throw new Error(data?.message || text || "Échec de la vérification.");
        }

        if (data?.status !== "success") {
          throw new Error(data?.message || "Échec de la vérification.");
        }

        const amountValue = Number(data.result.amount ?? parsedAmount);
        setResult({
          outcome: amountValue > 0 ? "amount" : "zero",
          balance: formatCurrency(amountValue, currency),
          verdict: data.result.verdict,
        });
        setStatus("done");
        setAttempt((current) => current + 1);
      } catch (error) {
        setStatus("idle");
        setError(
          error instanceof Error
            ? error.message
            : "Impossible de vérifier le coupon.",
        );
      }
    }, PHASE_DELAY * LOADING_PHASES.length + 200);

    timeoutsRef.current = [...phaseTimers, finishTimer];
  }

  return (
    <Section id="verifier" className="border-t border-divider">
      <SectionHeading
        eyebrow="Vérification"
        title="Lancez la vérification"
        description="Sélectionnez un type de carte, une devise, un montant, un code de recharge et une adresse e-mail pour obtenir un verdict rapide."
        as="h1"
      />

      <div className="mx-auto mt-12 grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.95fr] lg:gap-10">
        <div className="space-y-8">
          <div className="glass rounded-[2rem] border border-line-soft p-8 shadow-2xl shadow-slate-900/5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">
                  Formulaire de vérification
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-1 sm:text-4xl">
                  Informations du coupon
                </h2>
              </div>
              <Badge tone="neutral">Coupon</Badge>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
              <div className="grid gap-5 lg:grid-cols-2">
                <CardSelector
                  label="Type de carte"
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
                  label="Devise"
                  options={currencies}
                  value={currency}
                  onChange={setCurrency}
                />
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <InputCode
                  label="Montant"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="50"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  hint="Saisissez un montant pour la vérification."
                />
                <InputCode
                  label="Code de recharge"
                  placeholder="ABCD-1234-EFGH"
                  value={rechargeCode}
                  onChange={(event) => setRechargeCode(event.target.value)}
                  hint="Entrez le code de recharge associé au coupon."
                />
              </div>
              <div className="grid gap-5 lg:grid-cols-2">
                <InputCode
                  label="Adresse e-mail"
                  type="email"
                  placeholder="exemple@domaine.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  hint="Adresse de contact liée au coupon."
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-sm leading-6 text-ink-4">
                  Traitement rapide des données pour afficher un verdict.
                </p>
                <Button type="submit" disabled={!canSubmit} className="w-full sm:w-auto">
                  {status === "running"
                    ? LOADING_PHASES[phase]
                    : "Lancer la vérification"}
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
            <VoucherPreview brand={selectedBrand} code={amount ? amount : ""} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-[2rem] border border-line-soft p-8 shadow-2xl shadow-slate-900/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">
                  Résultat
                </p>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink-1">
                  Verdict
                </h3>
              </div>
              <span className="rounded-2xl bg-chip px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-ink-4">
                Responsive
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
                      <p className="text-sm font-semibold text-ink-1">Analyse en cours</p>
                      <p className="mt-2 text-sm text-ink-4">
                        Le système prépare le verdict en quelques instants.
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
                      title="Solde"
                      description={
                        <div className="space-y-2">
                          <p className="text-3xl font-semibold text-ink-1">{result.balance}</p>
                          <p className="text-sm text-ink-4">
                            {result.outcome === "amount"
                              ? "Le montant saisi est affiché comme solde."
                              : "Le verdict affiche un solde nul pour cette vérification."
                            }
                          </p>
                        </div>
                      }
                    />

                    <div className="grid gap-3 rounded-3xl border border-line-soft bg-card p-5 text-sm text-ink-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-ink-4">Type</p>
                        <p className="mt-2 font-medium text-ink-1">{selectedBrand.name}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-ink-4">Devise</p>
                        <p className="mt-2 font-medium text-ink-1">{currency}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-ink-4">Montant</p>
                        <p className="mt-2 font-medium text-ink-1">{formatCurrency(parsedAmount, currency)}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-ink-4">Code de recharge</p>
                        <p className="mt-2 truncate font-medium text-ink-1">{rechargeCode}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-ink-4">E-mail</p>
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
                    <p className="text-sm text-ink-3">
                    Remplissez le formulaire pour obtenir un résultat de vérification.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <Alert tone="info">
            Interface de vérification rapide : les résultats s'affichent directement et le processus reste fluide.
          </Alert>
        </div>
      </div>
    </Section>
  );
}
