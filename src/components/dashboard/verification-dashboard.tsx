"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { BarChart, type BarDatum } from "@/components/ui/bar-chart";
import { Button } from "@/components/ui/button";
import { CardSelector } from "@/components/ui/card-selector";
import { Icon } from "@/components/ui/icon";
import { Pagination } from "@/components/ui/pagination";
import { StatTile } from "@/components/dashboard/stat-tile";
import { VerificationTable } from "@/components/dashboard/verification-table";
import type { VerificationRecord } from "@/types/verification-record";
import { voucherBrands } from "@/content/vouchers";

const PAGE_SIZE = 8;
const DAY_MS = 24 * 60 * 60 * 1000;
const TREND_DAYS = 14;

/**
 * Couleurs fixes par identité de marque (palette catégorielle validée,
 * cf. compétence dataviz) — jamais recalculées par rang, pour qu'un filtre
 * qui réduit le nombre de barres ne repeigne pas les survivantes.
 */
const BRAND_COLORS: Record<string, string> = {
  transcash: "#3987e5",
  pcs: "#d95926",
  paysafecard: "#199e70",
  neosurf: "#c98500",
  steam: "#d55181",
  apple: "#008300",
};

const TREND_COLOR = "#3987e5";

function matchesQuery(record: VerificationRecord, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return (
    record.code.toLowerCase().includes(needle) ||
    record.brandLabel.toLowerCase().includes(needle)
  );
}

function buildDailyCounts(
  records: VerificationRecord[],
  referenceDateISO: string,
  locale: string,
): BarDatum[] {
  const reference = new Date(referenceDateISO);
  reference.setUTCHours(0, 0, 0, 0);

  const buckets: BarDatum[] = [];
  for (let i = TREND_DAYS - 1; i >= 0; i -= 1) {
    const day = new Date(reference.getTime() - i * DAY_MS);
    buckets.push({
      key: day.toISOString().slice(0, 10),
      label: day.toLocaleDateString(locale, { day: "2-digit", month: "2-digit" }),
      value: 0,
      color: TREND_COLOR,
    });
  }

  const byKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));
  for (const record of records) {
    const bucket = byKey.get(record.createdAt.slice(0, 10));
    if (bucket) bucket.value += 1;
  }

  return buckets;
}

export function VerificationDashboard({
  initialRecords,
  referenceDateISO,
}: {
  initialRecords: VerificationRecord[];
  referenceDateISO: string;
}) {
  const router = useRouter();
  const t = useTranslations("dashboardPage");
  const locale = useLocale();
  const [records, setRecords] = useState<VerificationRecord[]>(initialRecords);
  const [typeFilter, setTypeFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setRecords(initialRecords);
  }, [initialRecords]);

  // Les filtres scopent tout ce qui suit : statistiques, graphiques et
  // tableau se recalculent sur la même sélection, pour que les chiffres
  // restent toujours cohérents entre eux.
  const filtered = useMemo(
    () =>
      records.filter(
        (record) =>
          (typeFilter === "all" || record.type === typeFilter) && matchesQuery(record, query),
      ),
    [records, typeFilter, query],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const byBrand: BarDatum[] = useMemo(
    () =>
      voucherBrands.map((brand) => ({
        key: brand.id,
        label: brand.name,
        value: filtered.filter((record) => record.type === brand.id).length,
        color: BRAND_COLORS[brand.id] ?? "#3987e5",
      })),
    [filtered],
  );

  const byDay = useMemo(
    () => buildDailyCounts(filtered, referenceDateISO, locale),
    [filtered, referenceDateISO, locale],
  );

  const plausibleCount = filtered.filter((record) => record.status === "plausible").length;
  const totalAmount = filtered.reduce((sum, record) => sum + record.amount, 0);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
      if (response.ok) {
        setRecords((current) => current.filter((record) => record.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  const typeOptions = [
    { id: "all", label: t("filters.allTypes"), gradient: "from-slate-500 to-slate-700" },
    ...voucherBrands.map((brand) => ({
      id: brand.id,
      label: brand.name,
      gradient: brand.gradient,
      logo: brand.logo,
    })),
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={handleLogout} disabled={loggingOut}>
          <Icon name="close" size={16} />
          {t("logout")}
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label={t("stats.shown")}
          value={String(filtered.length)}
          hint={t("stats.shownHint", { count: records.length })}
        />
        <StatTile
          label={t("stats.plausible")}
          value={String(plausibleCount)}
          hint={
            filtered.length
              ? t("stats.plausibleHintPercent", {
                  percent: Math.round((plausibleCount / filtered.length) * 100),
                })
              : t("stats.plausibleHintEmpty")
          }
        />
        <StatTile
          label={t("stats.totalAmount")}
          value={`${totalAmount} €`}
          hint={t("stats.totalAmountHint")}
        />
        <StatTile
          label={t("stats.trackedTypes")}
          value={String(voucherBrands.length)}
          hint={t("stats.trackedTypesHint")}
        />
      </div>

      {/* Graphiques */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-ink-2">
            {t("charts.byBrandTitle")}
          </h3>
          <div className="mt-6">
            <BarChart
              data={byBrand}
              ariaLabel={t("charts.byBrandAriaLabel")}
              directLabels
            />
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-ink-2">
            {t("charts.byDayTitle", { days: TREND_DAYS })}
          </h3>
          <div className="mt-6 overflow-x-auto">
            <div className="min-w-[560px]">
              <BarChart
                data={byDay}
                ariaLabel={t("charts.byDayAriaLabel", { days: TREND_DAYS })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="glass space-y-6 rounded-2xl p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full max-w-sm">
            <label htmlFor="dashboard-search" className="block text-sm font-medium text-ink-2">
              {t("filters.searchLabel")}
            </label>
            <div className="relative mt-2">
              <Icon
                name="search"
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-4"
              />
              <input
                id="dashboard-search"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("filters.searchPlaceholder")}
                className="glass w-full rounded-xl py-2.5 pl-9 pr-3 text-sm text-ink-1 placeholder:text-ink-4 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-app"
              />
            </div>
          </div>

          <Button type="button" variant="outline" size="sm" onClick={() => router.refresh()}>
            {t("filters.refresh")}
          </Button>
        </div>

        <CardSelector
          label={t("filters.typeFilterLabel")}
          options={typeOptions}
          value={typeFilter}
          onChange={setTypeFilter}
        />
      </div>

      {/* Tableau et pagination */}
      <div className="space-y-4">
        <VerificationTable records={pageItems} onDelete={handleDelete} deletingId={deletingId} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
