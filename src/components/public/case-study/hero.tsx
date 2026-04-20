"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { Database } from "@/types/database";
import { formatCurrency, formatNumber } from "@/lib/format";

type Study = Database["public"]["Tables"]["case_studies"]["Row"] & {
  sector?: { name: string } | null;
};

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export function CaseHero({
  study,
  services,
}: {
  study: Study;
  services: { slug: string; name: string }[];
}) {
  const quick = [
    {
      label: "Budget ads",
      value: study.ad_budget ? formatCurrency(Number(study.ad_budget)) : "—",
    },
    {
      label: "CA généré",
      value: study.revenue_generated
        ? formatCurrency(Number(study.revenue_generated))
        : "—",
    },
    {
      label: "Leads",
      value: study.leads_count ? formatNumber(study.leads_count) : "—",
    },
    {
      label: "Clients",
      value: study.clients_count ? formatNumber(study.clients_count) : "—",
    },
  ];

  return (
    <section className="relative py-10">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <Link
          href="/etudes-de-cas"
          className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Toutes les études
        </Link>

        <div className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr] md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              {study.sector?.name ? (
                <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-deep">
                  {study.sector.name}
                </span>
              ) : null}
              {services.slice(0, 4).map((s) => (
                <span
                  key={s.slug}
                  className="rounded-full border border-border/70 bg-background px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                >
                  {s.name}
                </span>
              ))}
            </div>

            <h1 className="font-display text-[clamp(36px,5.5vw,64px)] font-semibold leading-[1] tracking-[-0.02em] text-foreground text-balance">
              {study.project_name}
            </h1>

            {study.client_name ? (
              <p className="text-sm text-muted-foreground">
                <span className="text-muted-foreground/70">Client · </span>
                <span className="text-foreground">{study.client_name}</span>
              </p>
            ) : null}

            {study.short_problem ? (
              <p className="max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
                {study.short_problem}
              </p>
            ) : null}
          </motion.div>

          {study.roi ? (
            <motion.aside
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease, delay: 0.1 }}
              className="flex flex-col justify-end"
            >
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-1/3 top-0 h-full w-2/3 opacity-40 mesh-grid"
                />
                <p className="relative text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-deep">
                  Retour sur investissement
                </p>
                <p className="relative mt-2 flex items-baseline gap-2 font-display font-black leading-[0.85] tracking-tight text-accent">
                  <span className="text-4xl">×</span>
                  <span className="text-[84px] tabular-nums md:text-[96px]">
                    {Number(study.roi).toFixed(1)}
                  </span>
                </p>
                {study.roas ? (
                  <p className="relative mt-3 text-xs text-muted-foreground">
                    ROAS mesuré : ×
                    <span className="tabular-nums">
                      {Number(study.roas).toFixed(1)}
                    </span>
                  </p>
                ) : null}
              </div>
            </motion.aside>
          ) : null}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease, delay: 0.2 }}
          className="mt-12"
        >
          {study.cover_image_url ? (
            <div className="relative aspect-[16/7] w-full overflow-hidden rounded-3xl border border-border shadow-sm">
              <Image
                src={study.cover_image_url}
                alt={`Cover ${study.project_name}`}
                fill
                priority
                sizes="(min-width: 1280px) 1152px, (min-width: 768px) 92vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              aria-hidden
              className="aspect-[16/7] w-full overflow-hidden rounded-3xl border border-border shadow-sm"
              style={{
                background:
                  "radial-gradient(ellipse at 20% 20%, oklch(0.65 0.08 235 / 0.24), transparent 60%), radial-gradient(ellipse at 80% 70%, oklch(0.65 0.08 235 / 0.18), transparent 55%), linear-gradient(135deg, oklch(0.29 0.09 270), oklch(0.48 0.09 245))",
              }}
            />
          )}
        </motion.div>

        <dl className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 border-t border-border pt-10 md:grid-cols-4 md:gap-x-8">
          {quick.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease, delay: 0.1 + i * 0.06 }}
            >
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="mt-2 font-display text-2xl font-semibold tabular-nums text-foreground md:text-3xl">
                {stat.value}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
