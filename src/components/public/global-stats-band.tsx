"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Eye,
  MousePointerClick,
  Percent,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Counter } from "./counter";
import type { GlobalStats } from "@/lib/public-data";

type StatDef = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon: React.ComponentType<{ className?: string }>;
  totalRef?: number;
};

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export function GlobalStatsBand({ stats }: { stats: GlobalStats | null }) {
  if (!stats) return null;

  const revenue = Number(stats.total_revenue ?? 0);
  const leads = Number(stats.total_leads ?? 0);
  const clients = Number(stats.total_clients ?? 0);
  const roas = Number(stats.average_roas ?? 0);
  const views = Number(stats.total_views ?? 0);

  const hero =
    revenue > 0
      ? {
          label: "CA généré cumulé",
          value: revenue,
          suffix: " €",
        }
      : null;

  const rawSupports: StatDef[] = [
    {
      label: "ROAS moyen",
      value: roas,
      prefix: "×",
      decimals: 1,
      icon: Percent,
      totalRef: 10,
    },
    {
      label: "Clients générés",
      value: clients,
      icon: UserCheck,
      totalRef: leads || Math.max(clients * 4, 1),
    },
    {
      label: "Leads qualifiés",
      value: leads,
      icon: MousePointerClick,
      totalRef: views || Math.max(leads * 4, 1),
    },
    {
      label: "Vues générées",
      value: views,
      icon: Eye,
      totalRef: Math.max(views, 1),
    },
  ];

  const supports = rawSupports.filter((s) => s.value > 0);

  if (!hero && supports.length === 0) return null;

  return (
    <section
      id="resultats"
      aria-labelledby="resultats-title"
      className="relative overflow-hidden border-y border-border bg-surface-muted/70 py-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[320px] opacity-40 mesh-grid [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.9),transparent_85%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-[420px] w-[480px] rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.08 235 / 0.25), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 md:px-8">
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ duration: 0.55, ease }}
          className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl space-y-3">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-deep">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_0_3px_rgba(86,148,189,0.18)]"
              />
              Résultats cumulés · études publiées
            </p>
            <h2
              id="resultats-title"
              className="font-display text-[clamp(30px,4.2vw,52px)] font-semibold leading-[1.02] tracking-[-0.02em] text-foreground text-balance"
            >
              La somme de ce que l&apos;on a fait{" "}
              <span className="text-accent">gagner à nos clients.</span>
            </h2>
          </div>
          <Link
            href="/etudes-de-cas"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-deep transition-colors hover:text-accent"
          >
            Détail par étude
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.header>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-[1.15fr_1fr] md:gap-12 lg:gap-20">
          {hero ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px 0px" }}
              transition={{ duration: 0.6, ease, delay: 0.08 }}
              className="relative pl-6 md:pl-8"
            >
              {/* Brand vertical rail accent */}
              <span
                aria-hidden
                className="absolute left-0 top-2 h-[calc(100%-3rem)] w-[3px] rounded-full bg-gradient-to-b from-brand via-brand/60 to-transparent"
              />

              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <span
                  aria-hidden
                  className="flex h-5 w-5 items-center justify-center rounded-md bg-background text-brand-deep ring-1 ring-border"
                >
                  €
                </span>
                {hero.label}
              </p>

              <p className="mt-4 whitespace-nowrap font-display text-[clamp(44px,6.5vw,88px)] font-black leading-[0.92] tracking-[-0.03em] tabular-nums text-foreground">
                <Counter
                  value={hero.value}
                  suffix={hero.suffix}
                  decimals={0}
                />
              </p>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-2.5 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                <span>
                  Vérifié sur chaque étude publiée — montants encaissés
                </span>
              </div>

              <p className="mt-6 max-w-md text-pretty text-sm text-muted-foreground">
                Chiffre d&apos;affaires cumulé que nos études publiées ont
                généré pour les clients qui nous ont fait confiance.
              </p>
            </motion.div>
          ) : null}

          <motion.dl
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px 0px" }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
            }}
            className="flex flex-col md:self-end"
          >
            {supports.map((stat) => {
              const Icon = stat.icon;
              const ratio = Math.min(1, stat.value / Math.max(stat.totalRef ?? 1, 1));
              return (
                <motion.div
                  key={stat.label}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease },
                    },
                  }}
                  className="group relative flex flex-col gap-2 border-t border-border/80 py-5 first:border-t-transparent md:py-6"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      <span
                        aria-hidden
                        className="flex h-6 w-6 items-center justify-center rounded-md bg-background text-brand-deep ring-1 ring-border transition-colors duration-300 group-hover:ring-brand/40 group-hover:text-brand"
                      >
                        <Icon className="h-3 w-3" />
                      </span>
                      {stat.label}
                    </dt>
                    <dd className="font-display text-[clamp(26px,3.6vw,40px)] font-black leading-none tabular-nums text-foreground">
                      <Counter
                        value={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        decimals={stat.decimals ?? 0}
                      />
                    </dd>
                  </div>
                  <div
                    className="relative h-[3px] overflow-hidden rounded-full bg-border/60"
                    aria-hidden
                  >
                    <motion.span
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.max(8, ratio * 100)}%` }}
                      viewport={{ once: true, margin: "-40px 0px" }}
                      transition={{ duration: 0.9, ease, delay: 0.25 }}
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-deep via-brand to-brand/60"
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
