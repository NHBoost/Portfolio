"use client";

import { motion } from "framer-motion";
import { Counter } from "./counter";
import type { GlobalStats } from "@/lib/public-data";

type StatDef = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

export function GlobalStatsBand({ stats }: { stats: GlobalStats | null }) {
  if (!stats) return null;

  const items: StatDef[] = [
    { label: "Vues générées", value: Number(stats.total_views ?? 0) },
    { label: "Leads qualifiés", value: Number(stats.total_leads ?? 0) },
    { label: "Clients générés", value: Number(stats.total_clients ?? 0) },
    {
      label: "ROAS moyen",
      value: Number(stats.average_roas ?? 0),
      prefix: "×",
      decimals: 1,
    },
    {
      label: "CA généré",
      value: Number(stats.total_revenue ?? 0),
      suffix: " €",
    },
  ];

  const hasValues = items.some((i) => i.value > 0);
  if (!hasValues) return null;

  return (
    <section
      id="resultats"
      aria-labelledby="resultats-title"
      className="relative bg-accent py-20 text-accent-foreground md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex flex-col gap-3"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand/80">
            Résultats cumulés · toutes études publiées
          </p>
          <h2
            id="resultats-title"
            className="max-w-2xl text-pretty font-display text-3xl font-semibold tracking-tight text-accent-foreground md:text-4xl"
          >
            La somme de ce que l&apos;on a fait gagner à nos clients.
          </h2>
        </motion.div>

        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-8">
          {items.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px 0px" }}
              transition={{
                duration: 0.55,
                ease: [0.2, 0.8, 0.2, 1],
                delay: i * 0.07,
              }}
              className="border-t border-white/15 pt-5"
            >
              <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent-foreground/60">
                {stat.label}
              </dt>
              <dd className="mt-3 font-display text-[40px] font-black leading-[0.95] tracking-tight text-accent-foreground tabular-nums lg:text-[52px]">
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
    </section>
  );
}
