"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import type { VerificationRecord, VerificationStatus } from "@/types/verification-record";
import { voucherBrands } from "@/content/vouchers";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<VerificationStatus, "success" | "warning" | "danger"> = {
  plausible: "success",
  suspect: "warning",
  invalid: "danger",
};

function brandGradient(type: string): string {
  return (
    voucherBrands.find((brand) => brand.id === type)?.gradient ?? "from-slate-500 to-slate-700"
  );
}

export function VerificationTable({
  records,
  onDelete,
  deletingId,
}: {
  records: VerificationRecord[];
  onDelete: (id: string) => void;
  deletingId?: string | null;
}) {
  const t = useTranslations("dashboardPage.table");
  const locale = useLocale();
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [locale],
  );

  if (records.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line-soft p-10 text-center text-sm text-ink-4">
        {t("empty")}
      </div>
    );
  }

  return (
    <div className="glass overflow-x-auto rounded-2xl">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead className="bg-chip text-xs uppercase tracking-wide text-ink-4">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              {t("cardColumn")}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t("codeColumn")}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t("statusColumn")}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t("amountColumn")}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t("dateColumn")}
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              {t("actionColumn")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          <AnimatePresence initial={false} mode="popLayout">
            {records.map((record) => (
              <motion.tr
                key={record.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
                className="transition-colors hover:bg-chip"
              >
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2 text-ink-2">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-2 w-2 shrink-0 rounded-full bg-gradient-to-br",
                        brandGradient(record.type),
                      )}
                    />
                    {record.brandLabel}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-ink-2">{record.code}</td>
                <td className="px-4 py-3">
                  <Badge tone={STATUS_TONE[record.status]}>{t(`status.${record.status}`)}</Badge>
                </td>
                <td className="px-4 py-3 tabular-nums text-ink-2">
                  {record.amount} {record.currency}
                </td>
                <td className="px-4 py-3 tabular-nums text-ink-4">
                  {dateFormatter.format(new Date(record.createdAt))}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onDelete(record.id)}
                    disabled={deletingId === record.id}
                    aria-label={t("deleteLabel", { brand: record.brandLabel, code: record.code })}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-4 transition-colors hover:bg-danger-bg hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger disabled:opacity-40"
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
