"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputCode } from "@/components/ui/input-code";
import { CardPreview } from "@/components/verify/card-preview";
import { ResultPanel } from "@/components/verify/result-panel";
import { SampleNumbers } from "@/components/verify/sample-numbers";
import { useCardInput } from "@/hooks/use-card-input";

/**
 * Formulaire de démonstration.
 *
 * Composant client volontairement isolé : c'est le seul endroit du site qui
 * exige JavaScript. Aucun `fetch`, aucun `localStorage`, aucune télémétrie —
 * la saisie ne quitte jamais la mémoire de l'onglet.
 */
export function CardForm() {
  const t = useTranslations();
  const { displayValue, maxLength, brand, validation, touched, setValue, reset } =
    useCardInput();

  const showError = touched && validation.digits.length > 0 && !validation.valid;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
      {/* Colonne de saisie */}
      <div className="space-y-8">
        <form
          onSubmit={(event) => event.preventDefault()}
          noValidate
          className="space-y-5"
        >
          <InputCode
            label={t("demoPage.cardForm.numberLabel")}
            name="card-number"
            inputMode="numeric"
            placeholder="4242 4242 4242 4242"
            maxLength={maxLength}
            value={displayValue}
            onChange={(event) => setValue(event.target.value)}
            size="lg"
            state={showError ? "error" : validation.valid ? "success" : "default"}
            hint={t("demoPage.cardForm.numberHint")}
            suffix={
              brand.id !== "unknown" ? (
                <Badge tone="info">{t(`cardBrands.${brand.id}`)}</Badge>
              ) : undefined
            }
          />

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={reset}
              disabled={validation.digits.length === 0}
            >
              {t("demoPage.cardForm.clear")}
            </Button>
            <span className="self-center text-xs text-ink-4">
              {t("demoPage.cardForm.digitsCount", {
                count: validation.digits.length,
                max: Math.max(...brand.lengths),
              })}
            </span>
          </div>
        </form>

        <SampleNumbers onSelect={setValue} />

        <div className="flex justify-center lg:justify-start">
          <CardPreview
            formatted={displayValue}
            brand={brand}
            valid={validation.valid}
          />
        </div>
      </div>

      {/* Colonne de résultats */}
      <ResultPanel validation={validation} />
    </div>
  );
}
