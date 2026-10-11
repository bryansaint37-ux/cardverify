"use client";

import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Card, CardBody } from "@/components/ui/card";
import { Icon, type IconName } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";

const stepKeys: { key: "detect" | "format" | "result"; icon: IconName }[] = [
  { key: "detect", icon: "layers" },
  { key: "format", icon: "cpu" },
  { key: "result", icon: "eye" },
];

export function VoucherPresentation() {
  const t = useTranslations("presentation");

  return (
    <Section id="presentation" className="border-t border-divider">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {stepKeys.map((step, index) => (
          <Reveal key={step.key} delay={index * 100} className="h-full">
            <Card interactive className="h-full">
              <CardBody>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-chip text-accent">
                  <Icon name={step.icon} size={22} />
                </span>
                <h3 className="mt-5 text-base font-semibold text-ink-1">
                  {t(`steps.${step.key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-3">
                  {t(`steps.${step.key}.description`)}
                </p>
              </CardBody>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={300} className="mt-10">
        <Alert tone="warning" title={t("alertTitle")}>
          {t("alertBody")}
        </Alert>
      </Reveal>
    </Section>
  );
}
