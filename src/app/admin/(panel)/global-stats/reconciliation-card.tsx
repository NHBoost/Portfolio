"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Equal } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/format";

export type ReconciliationFormat = "number" | "currency" | "roas";

function formatValue(v: number, fmt: ReconciliationFormat): string {
  if (fmt === "currency") return formatCurrency(v);
  if (fmt === "roas") return `×${v.toFixed(1)}`;
  return formatNumber(v);
}

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export type ReconciliationCardProps = {
  label: string;
  manual: number;
  computed: number | null;
  format: ReconciliationFormat;
  icon: React.ReactNode;
  accent?: "brand" | "neutral";
  helper?: string;
  index?: number;
};

type Delta =
  | { kind: "na"; diff: 0 }
  | { kind: "match"; diff: number }
  | { kind: "over"; diff: number }
  | { kind: "under"; diff: number };

function deltaState(manual: number, computed: number | null): Delta {
  if (computed === null) return { kind: "na", diff: 0 };
  const diff = manual - computed;
  if (Math.abs(diff) < (computed === 0 ? 0.001 : computed * 0.005))
    return { kind: "match", diff };
  return { kind: diff > 0 ? "over" : "under", diff };
}

export function ReconciliationCard({
  label,
  manual,
  computed,
  format,
  icon,
  accent = "neutral",
  helper,
  index = 0,
}: ReconciliationCardProps) {
  const state = deltaState(manual, computed);

  const ratio =
    computed === null
      ? null
      : computed > 0
        ? Math.min(1, manual / computed)
        : manual > 0
          ? 1
          : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-sm"
    >
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg",
              accent === "brand"
                ? "bg-brand/10 text-brand-deep"
                : "bg-muted text-muted-foreground",
            )}
          >
            {icon}
          </span>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
        </div>
        {state.kind !== "na" ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
              state.kind === "match" &&
                "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-400",
              state.kind === "over" &&
                "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-300",
              state.kind === "under" &&
                "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/40 dark:bg-sky-900/10 dark:text-sky-300",
            )}
            title={
              state.kind === "match"
                ? "Aligné avec les études publiées"
                : `Δ ${formatValue(Math.abs(state.diff), format)}`
            }
          >
            {state.kind === "match" ? (
              <Equal className="h-2.5 w-2.5" />
            ) : state.kind === "over" ? (
              <ArrowUpRight className="h-2.5 w-2.5" />
            ) : (
              <ArrowDownRight className="h-2.5 w-2.5" />
            )}
            {state.kind === "match"
              ? "Aligné"
              : formatValue(Math.abs(state.diff), format)}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            Manuel seul
          </span>
        )}
      </header>

      <p className="mt-4 font-display text-[clamp(26px,3.2vw,34px)] font-bold leading-none tracking-tight tabular-nums text-foreground">
        {formatValue(manual, format)}
      </p>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">Calculé sur études</span>
          <span className="font-display font-semibold tabular-nums text-foreground">
            {computed === null ? "—" : formatValue(computed, format)}
          </span>
        </div>
        {ratio !== null ? (
          <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-deep via-brand to-brand/80 transition-[width] duration-300"
              style={{ width: `${Math.min(100, ratio * 100)}%` }}
            />
            {computed !== null && computed > 0 ? (
              <span
                aria-hidden
                className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-foreground/60"
                style={{ left: "100%", transform: "translate(-100%, -50%)" }}
                title="Valeur calculée"
              />
            ) : null}
          </div>
        ) : (
          <div className="h-1.5 rounded-full bg-muted/50" />
        )}
      </div>

      {helper ? (
        <p className="mt-3 text-[11px] text-muted-foreground">{helper}</p>
      ) : null}
    </motion.article>
  );
}
