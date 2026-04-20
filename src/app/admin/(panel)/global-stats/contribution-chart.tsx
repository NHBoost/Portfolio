"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { formatCurrency, formatNumber, formatRoi } from "@/lib/format";
import { cn } from "@/lib/utils";

export type ContributionRow = {
  id: string;
  slug: string;
  project_name: string;
  client_name: string | null;
  sector: string | null;
  leads: number | null;
  clients: number | null;
  revenue: number | null;
  roi: number | null;
};

type Axis = "revenue" | "leads" | "clients";

const axisMeta: Record<
  Axis,
  { label: string; short: string; format: (n: number) => string }
> = {
  revenue: {
    label: "Chiffre d'affaires",
    short: "CA",
    format: formatCurrency,
  },
  leads: {
    label: "Leads qualifiés",
    short: "Leads",
    format: formatNumber,
  },
  clients: {
    label: "Clients générés",
    short: "Clients",
    format: formatNumber,
  },
};

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export function ContributionChart({ rows }: { rows: ContributionRow[] }) {
  const [axis, setAxis] = useState<Axis>("revenue");

  const sortedRows = useMemo(() => {
    return [...rows]
      .map((r) => ({
        ...r,
        value:
          axis === "revenue"
            ? Number(r.revenue ?? 0)
            : axis === "leads"
              ? Number(r.leads ?? 0)
              : Number(r.clients ?? 0),
      }))
      .sort((a, b) => b.value - a.value);
  }, [rows, axis]);

  const total = sortedRows.reduce((sum, r) => sum + r.value, 0);
  const max = Math.max(...sortedRows.map((r) => r.value), 1);
  const fmt = axisMeta[axis].format;

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
        <p className="font-display text-base font-semibold text-foreground">
          Aucune étude publiée
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Publie une étude pour voir sa contribution apparaître ici.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Répartition {axisMeta[axis].label.toLowerCase()}
          </p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
            {fmt(total)}{" "}
            <span className="text-sm font-medium text-muted-foreground">
              · total sur {sortedRows.length} étude
              {sortedRows.length > 1 ? "s" : ""}
            </span>
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Axe de contribution"
          className="inline-flex items-center rounded-full border border-border bg-card p-1 text-[11px]"
        >
          {(Object.keys(axisMeta) as Axis[]).map((a) => (
            <button
              key={a}
              role="tab"
              type="button"
              aria-selected={axis === a}
              onClick={() => setAxis(a)}
              className={cn(
                "rounded-full px-3 py-1 font-medium transition-colors",
                axis === a
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {axisMeta[a].short}
            </button>
          ))}
        </div>
      </div>

      <ol
        aria-label={`Contribution par étude de cas · ${axisMeta[axis].label}`}
        className="space-y-3"
      >
        {sortedRows.map((row, i) => {
          const widthPct = max > 0 ? (row.value / max) * 100 : 0;
          const sharePct = total > 0 ? (row.value / total) * 100 : 0;
          return (
            <li key={row.id}>
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease, delay: i * 0.05 }}
                className="group rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <Link
                    href={`/admin/case-studies/${row.id}`}
                    className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-brand-deep"
                  >
                    <span className="truncate">{row.project_name}</span>
                    <ArrowUpRight className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                  <div className="flex items-baseline gap-3 tabular-nums">
                    {row.roi ? (
                      <span className="font-display text-xs font-bold text-brand-deep">
                        {formatRoi(row.roi)}
                      </span>
                    ) : null}
                    <span className="font-display text-base font-semibold text-foreground">
                      {fmt(row.value)}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {sharePct.toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div
                  className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
                  role="img"
                  aria-label={`${row.project_name} : ${fmt(row.value)} soit ${sharePct.toFixed(0)}% du total`}
                >
                  <motion.span
                    aria-hidden
                    className="block h-full rounded-full bg-gradient-to-r from-brand-deep via-brand to-brand/70"
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ duration: 0.55, ease, delay: i * 0.05 + 0.1 }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>
                    {row.sector ?? "Sans secteur"}
                    {row.client_name ? ` · ${row.client_name}` : ""}
                  </span>
                </div>
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
