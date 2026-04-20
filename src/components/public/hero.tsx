"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  settings,
  spotlight,
  trustStats,
}: {
  settings: FranchiseSettings | null;
  spotlight: Spotlight;
  trustStats?: HeroTrustStats;
}) {
  const primaryCta =
    settings?.whatsapp_url ??
    (settings?.email ? `mailto:${settings.email}` : "#etudes");
  const primaryLabel = settings?.cta_text ?? "Parler à un expert";

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
      className="relative overflow-hidden bg-background pt-14 pb-24 md:pt-20 md:pb-32"
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
        className="relative mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 md:px-8"
      >
        <motion.p
          variants={item}
          className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-card/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-brand-deep backdrop-blur"
        >
          <Sparkles className="h-3 w-3" />
          Portfolio · Performance mesurée
        </motion.p>

        <div className="grid items-end gap-12 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <div className="space-y-9">
            <motion.h1
              id="hero-title"
              variants={item}
              className="font-display text-[clamp(44px,7vw,88px)] font-semibold leading-[0.96] tracking-[-0.025em] text-foreground text-balance"
            >
              Chaque euro investi{" "}
              <span className="text-muted-foreground/60">laisse</span>{" "}
              <span className="text-accent">une trace.</span>
            </motion.h1>
            <motion.p
              variants={item}
              className="max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground md:text-[17px] md:leading-[1.55]"
            >
              Ce portfolio ne raconte pas ce que nous faisons. Il prouve
              combien ça rapporte à nos clients — en leads, en clients, en
              chiffre d&apos;affaires réellement encaissé.
            </motion.p>

            <motion.div
              variants={item}
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href={primaryCta}
                target={primaryCta.startsWith("http") ? "_blank" : undefined}
                rel={primaryCta.startsWith("http") ? "noreferrer" : undefined}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "group h-11 gap-1.5 rounded-full px-5 text-[13px] font-semibold shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_6px_18px_-4px_rgba(62,100,147,0.4)] transition-shadow hover:shadow-[0_1px_0_rgba(255,255,255,0.1)_inset,0_8px_24px_-4px_rgba(62,100,147,0.5)]",
                )}
              >
                {primaryLabel}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="#etudes"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "group h-11 gap-1.5 rounded-full px-5 text-[13px] font-semibold text-foreground",
                )}
              >
                Voir les études
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

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
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card/80 p-6 shadow-[0_20px_60px_-20px_rgba(20,25,50,0.22)] backdrop-blur md:p-7">
              <div
                aria-hidden
                className="absolute -top-1/2 right-0 h-[260px] w-[260px] rounded-full opacity-50 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.65 0.08 235 / 0.22), transparent 70%)",
                }}
              />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-deep">
                    <span
                      aria-hidden
                      className="h-1 w-1 rounded-full bg-brand"
                    />
                    Étude à la une
                  </p>
                  {spotlight ? (
                    <Link
                      href={`/etudes-de-cas/${spotlight.slug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Lire
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  ) : null}
                </div>

                <div>
                  <p className="font-display text-lg font-semibold tracking-tight text-foreground">
                    {spotlight?.project_name ?? "Restaurant Le Colibri"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {spotlight?.sector ?? "Restauration"}
                    {spotlight?.client_name
                      ? ` · ${spotlight.client_name}`
                      : ""}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Retour sur investissement
                  </p>
                  <p className="mt-1 flex items-baseline gap-1.5 font-display font-black leading-none tracking-tight text-accent">
                    <span className="text-3xl">×</span>
                    <span className="text-[72px] tabular-nums">
                      {spotlight?.roi ? spotlight.roi.toFixed(1) : "8.5"}
                    </span>
                  </p>
                </div>

                <dl className="grid grid-cols-2 gap-4 border-t border-border/70 pt-5 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Budget ads</dt>
                    <dd className="mt-0.5 font-display text-sm font-semibold tabular-nums text-foreground">
                      {formatCurrency(spotlight?.ad_budget ?? 3500)}
                    </dd>
                  </div>
                  <div className="text-right">
                    <dt className="text-muted-foreground">CA généré</dt>
                    <dd className="mt-0.5 font-display text-sm font-semibold tabular-nums text-foreground">
                      {formatCurrency(spotlight?.revenue_generated ?? 29750)}
                    </dd>
                  </div>
                </dl>

                {!spotlight ? (
                  <p className="text-[10px] italic text-muted-foreground">
                    Exemple illustratif. Les études publiées apparaîtront ici.
                  </p>
                ) : null}
              </div>
            </div>
          </motion.aside>
        </div>

        <motion.a
          href="#resultats"
          variants={item}
          aria-label="Scroller vers les résultats"
          className="group hidden items-center gap-2 self-center text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
        >
          Scroller
          <span
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border transition-all group-hover:border-brand/40 group-hover:bg-brand/5 group-hover:text-brand-deep"
          >
            <ArrowDown className="h-3 w-3" />
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
}
