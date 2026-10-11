"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { voucherBrands } from "@/content/vouchers";
import { cn } from "@/lib/utils";

export function VoucherBrandsGrid() {
  const t = useTranslations("brandsGrid");
  const tBrands = useTranslations("voucherBrands");

  return (
    <Section id="cartes" className="border-t border-divider bg-app">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {voucherBrands.map((brand, index) => (
          <Reveal key={brand.id} delay={index * 80} className="h-full">
            <motion.article
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className={cn(
                "group glass relative h-full overflow-hidden rounded-2xl transition-colors duration-300 hover:border-line-soft hover:shadow-xl",
                brand.glow,
              )}
            >
              <div className={cn("h-1.5 w-full bg-gradient-to-r", brand.gradient)} />

              <div className="p-6">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110",
                    brand.gradient,
                  )}
                  aria-hidden="true"
                >
                  {brand.name.slice(0, 2).toUpperCase()}
                </div>

                <h3 className="mt-4 text-base font-semibold text-ink-1">{brand.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-3">
                  {tBrands(brand.id)}
                </p>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
