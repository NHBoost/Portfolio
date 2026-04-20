"use client";

import { motion } from "framer-motion";
import { ArrowRight, Equal } from "lucide-react";
import { formatCurrency } from "@/lib/format";

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export function RoiBlock({
  adBudget,
  revenueGenerated,
  roi,
}: {
  adBudget: number | null;
  revenueGenerated: number | null;
  roi: number | null;
}) {
  if (!roi && !adBudget && !revenueGenerated) return null;
  const display = roi ?? (adBudget && revenueGenerated ? revenueGenerated / adBudget : null);
  if (!display) return null;

  return (
    <section
      id="roi"
      aria-labelledby="roi-title"
      className="relative overflow-hidden bg-accent py-10 text-accent-foreground"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[min(900px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.08 235 / 0.35), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ duration: 0.5, ease }}
          className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand/80"
        >
          Bloc ROI · la seule équation qui compte
        </motion.p>

        <motion.h2
          id="roi-title"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ duration: 0.55, ease, delay: 0.05 }}
          className="mt-4 max-w-3xl font-display text-[clamp(28px,3.6vw,44px)] font-semibold leading-[1.05] tracking-tight text-accent-foreground text-balance"
        >
          Chaque euro investi a rapporté{" "}
          <span className="text-brand">{display.toFixed(1)} euros en retour.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px 0px" }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="mt-16 grid items-center gap-8 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-4"
        >
          <div className="space-y-2 text-center md:text-left">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent-foreground/60">
              Budget ads
            </p>
            <p className="font-display text-4xl font-black tabular-nums leading-none text-accent-foreground md:text-[56px]">
              {adBudget ? formatCurrency(adBudget) : "—"}
            </p>
          </div>

          <span
            aria-hidden
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-accent-foreground/70 md:h-12 md:w-12"
          >
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
          </span>

          <div className="space-y-2 text-center md:text-left">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent-foreground/60">
              CA généré
            </p>
            <p className="font-display text-4xl font-black tabular-nums leading-none text-accent-foreground md:text-[56px]">
              {revenueGenerated ? formatCurrency(revenueGenerated) : "—"}
            </p>
          </div>

          <span
            aria-hidden
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-accent-foreground/70 md:h-12 md:w-12"
          >
            <Equal className="h-4 w-4 md:h-5 md:w-5" />
          </span>

          <div className="space-y-2 text-center md:text-left">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand">
              ROI
            </p>
            <p className="flex items-baseline justify-center gap-1 font-display text-[72px] font-black leading-none tabular-nums text-brand md:justify-start md:text-[96px]">
              <span className="text-4xl md:text-5xl">×</span>
              {display.toFixed(1)}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
