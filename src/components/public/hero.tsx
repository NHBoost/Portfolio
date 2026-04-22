"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import { formatCurrency, formatNumber, formatRoi } from "@/lib/format";
import type { FranchiseSettings } from "@/lib/public-data";

type Spotlight = {
  slug: string;
  project_name: string;
  client_name: string | null;
  sector: string | null;
  roi: number | null;
  ad_budget: number | null;
  revenue_generated: number | null;
} | null;

export type HeroTrustStats = {
  publishedCount: number;
  averageRoas: number | null;
  totalRevenue: number | null;
} | null;

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

export function Hero({
  spotlight,
  trustStats,
}: {
  settings: FranchiseSettings | null;
  spotlight: Spotlight;
  trustStats?: HeroTrustStats;
}) {
  const trustItems: { label: string; value: string }[] = [];
  if (trustStats) {
    if (trustStats.publishedCount > 0) {
      trustItems.push({
        label: "Études publiées",
        value: formatNumber(trustStats.publishedCount),
      });
    }
    if (trustStats.averageRoas && trustStats.averageRoas > 0) {
      trustItems.push({
        label: "ROAS moyen",
        value: formatRoi(trustStats.averageRoas),
      });
    }
    if (trustStats.totalRevenue && trustStats.totalRevenue > 0) {
      trustItems.push({
        label: "CA généré",
        value: formatCurrency(trustStats.totalRevenue),
      });
    }
  }

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-background py-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-[620px] opacity-60 mesh-grid [mask-image:radial-gradient(circle_at_top,rgba(0,0,0,0.85),transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[min(760px,85vw)] -translate-x-1/2 rounded-b-[999px] blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.65 0.08 235 / 0.2), transparent 70%)",
        }}
      />

      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="relative mx-auto flex w-full max-w-6xl flex-col space-y-14 px-4 md:px-8"
      >
        <motion.p
          variants={item}
          className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-card/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-brand-deep backdrop-blur"
        >
          <Sparkles className="h-3 w-3" />
          Portfolio · Performance mesurée
        </motion.p>

        <div className="!mt-0.5 grid items-end gap-12 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <div className="space-y-9">
            <motion.h1
              id="hero-title"
              variants={item}
              className="font-display text-[35px] font-semibold leading-[1.02] tracking-[-0.02em] text-foreground text-balance md:text-[40px] lg:text-[45px]"
            >
              Chaque euro investi{" "}
              <span className="text-muted-foreground/60">laisse</span>{" "}
              <span className="text-accent">une trace.</span>
            </motion.h1>
            <motion.p
              variants={item}
              className="!mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground md:text-[17px] md:leading-[1.55]"
            >
              Ce portfolio ne raconte pas ce que nous faisons. Il prouve
              combien ça rapporte à nos clients — en leads, en clients, en
              chiffre d&apos;affaires réellement encaissé.
            </motion.p>

            {trustItems.length > 0 ? (
              <motion.dl
                variants={item}
                className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border/60 pt-6"
              >
                {trustItems.map((t, i) => (
                  <div key={t.label} className="flex items-center gap-3">
                    {i > 0 ? (
                      <span
                        aria-hidden
                        className="hidden h-8 w-px bg-border sm:block"
                      />
                    ) : null}
                    <div className="flex flex-col leading-tight">
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {t.label}
                      </dt>
                      <dd className="mt-1 font-display text-xl font-semibold tabular-nums text-foreground">
                        {t.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </motion.dl>
            ) : null}
          </div>

          <motion.aside
            variants={item}
            aria-label="Étude de cas à la une"
            className="relative"
          >
            {spotlight ? (
              <Link
                href={`/etudes-de-cas/${spotlight.slug}`}
                aria-label={`Lire l'étude ${spotlight.project_name}`}
                className="group relative block overflow-hidden rounded-2xl border border-border bg-card/80 shadow-[0_20px_60px_-20px_rgba(20,25,50,0.22)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_30px_80px_-20px_rgba(20,25,50,0.3)]"
              >
                {/* Glow accent */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-1/2 right-0 h-[260px] w-[260px] rounded-full opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.65 0.08 235 / 0.3), transparent 70%)",
                  }}
                />
                {/* Subtle grid */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.04] mesh-grid"
                />

                <div className="relative space-y-6 p-6 md:p-7">
                  {/* Header: eyebrow + meta chip */}
                  <div className="flex items-center justify-between">
                    <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-deep">
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_0_3px_rgba(86,148,189,0.2)]"
                      />
                      Étude à la une
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-deep opacity-80 transition-all duration-200 group-hover:gap-1.5 group-hover:opacity-100">
                      Lire
                      <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>

                  {/* Project identity row */}
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold tracking-tight text-white ring-1 ring-white/15"
                      style={{
                        background:
                          "radial-gradient(ellipse at top left, oklch(0.65 0.08 235 / 0.5), transparent 60%), linear-gradient(135deg, oklch(0.35 0.08 265), oklch(0.23 0.08 265))",
                      }}
                    >
                      {spotlight.project_name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-[17px] font-semibold tracking-tight text-foreground md:text-lg">
                        {spotlight.project_name}
                      </p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                        {spotlight.sector ? (
                          <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                            {spotlight.sector}
                          </span>
                        ) : null}
                        {spotlight.client_name ? (
                          <span className="truncate">
                            {spotlight.client_name}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </div>

                  {/* ROI hero */}
                  <div className="relative rounded-xl border border-brand/15 bg-gradient-to-br from-brand/[0.06] via-transparent to-transparent p-4">
                    <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-deep">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      Retour sur investissement
                    </p>
                    <div className="mt-2 flex items-end justify-between gap-4">
                      <p className="flex items-baseline gap-1.5 font-display font-black leading-[0.85] tracking-[-0.03em] text-accent">
                        <span className="text-3xl md:text-4xl">×</span>
                        <span className="text-[68px] tabular-nums md:text-[76px]">
                          {spotlight.roi ? spotlight.roi.toFixed(1) : "—"}
                        </span>
                      </p>
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-400">
                        <span
                          aria-hidden
                          className="h-1 w-1 rounded-full bg-emerald-500"
                        />
                        Vérifié
                      </span>
                    </div>
                  </div>

                  {/* Budget → CA flow */}
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-t border-border/70 pt-5">
                    <div className="min-w-0">
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Budget ads
                      </dt>
                      <dd className="mt-0.5 truncate font-display text-[15px] font-semibold tabular-nums text-foreground">
                        {formatCurrency(spotlight.ad_budget ?? 0)}
                      </dd>
                    </div>
                    <span
                      aria-hidden
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-brand-deep"
                    >
                      <ArrowRight className="h-3 w-3" />
                    </span>
                    <div className="min-w-0 text-right">
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-deep">
                        CA généré
                      </dt>
                      <dd className="mt-0.5 truncate font-display text-[15px] font-semibold tabular-nums text-foreground">
                        {formatCurrency(spotlight.revenue_generated ?? 0)}
                      </dd>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-card/60 p-6 shadow-sm md:p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-deep">
                  Étude à la une
                </p>
                <p className="mt-3 font-display text-lg font-semibold text-foreground">
                  Les études publiées apparaîtront ici.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Publie une étude depuis l&apos;admin pour faire apparaître
                  automatiquement la plus performante dans ce bloc.
                </p>
              </div>
            )}
          </motion.aside>
        </div>

      </motion.div>
    </section>
  );
}
