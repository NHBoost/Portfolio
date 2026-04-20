"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Counter } from "./counter";
import type { GlobalStats } from "@/lib/public-data";

type StatDef = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export function GlobalStatsBand({ stats }: { stats: GlobalStats | null }) {
  if (!stats) return null;

  const revenue = Number(stats.total_revenue ?? 0);
  const leads = Number(stats.total_leads ?? 0);
  const clients = Number(stats.total_clients ?? 0);
  const roas = Number(stats.average_roas ?? 0);
  const views = Number(stats.total_views ?? 0);

  const hero: StatDef | null =
    revenue > 0
      ? {
          label: "CA généré cumulé",
          value: revenue,
          suffix: " €",
        }
      : null;

  const supports: StatDef[] = [
    {
      label: "ROAS moyen",
      value: roas,
      prefix: "×",
      decimals: 1,
    },
    {
      label: "Clients générés",
      value: clients,
    },
    {
      label: "Leads qualifiés",
      value: leads,
    },
    {
      label: "Vues générées",
      value: views,
    },
  ].filter((s) => s.value > 0);

  if (!hero && supports.length === 0) return null;

  return (
    <section
      id="resultats"
      aria-labelledby="resultats-title"
      className="relative overflow-hidden border-y border-border bg-surface-muted/70 py-24 md:py-32"
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
              className="relative"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {hero.label}
              </p>
              <p className="mt-4 whitespace-nowrap font-display text-[clamp(44px,6.5vw,88px)] font-black leading-[0.92] tracking-[-0.03em] tabular-nums text-foreground">
                <Counter
                  value={hero.value}
                  prefix={hero.prefix}
                  suffix={hero.suffix}
                  decimals={hero.decimals ?? 0}
                />
              </p>
              <p className="mt-6 max-w-sm text-pretty text-sm text-muted-foreground">
                Chiffre d&apos;affaires cumulé que nos études publiées ont
                généré pour les clients qui nous ont fait confiance.
              </p>
              <div
                aria-hidden
                className="mt-8 h-px w-16 bg-gradient-to-r from-brand via-brand/40 to-transparent"
              />
            </motion.div>
          ) : null}

          <dl className="flex flex-col md:self-end">
            {supports.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px 0px" }}
                transition={{
                  duration: 0.5,
                  ease,
                  delay: 0.15 + i * 0.06,
                }}
                className="group flex items-baseline justify-between gap-6 border-t border-border/80 py-5 first:border-t-transparent md:py-6"
              >
                <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <span
                    aria-hidden
                    className="h-1 w-1 rounded-full bg-muted-foreground/40 transition-colors duration-300 group-hover:bg-brand"
                  />
                  {stat.label}
                </dt>
                <dd className="font-display text-[clamp(30px,4vw,44px)] font-black leading-none tabular-nums text-foreground">
                  <Counter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals ?? 0}
                  />
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
