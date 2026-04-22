"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  Rocket,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

type Step = {
  number: string;
  label: string;
  duration: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  deliverables: string[];
  accent: string;
};

const steps: Step[] = [
  {
    number: "01",
    label: "Cadrage",
    duration: "Semaine 1",
    title: "On remonte jusqu'au business.",
    description:
      "Audit des canaux, du tunnel, de l'offre. On identifie les deux leviers qui font vraiment bouger le chiffre d'affaires — pas les vingt.",
    icon: Target,
    deliverables: [
      "Diagnostic 360° canaux & offre",
      "Objectif business chiffré",
      "KPIs de pilotage définis",
    ],
    accent: "from-brand/20",
  },
  {
    number: "02",
    label: "Exécution",
    duration: "Semaines 2–4",
    title: "On shipe en semaines, pas en mois.",
    description:
      "Creatives, landing, ads, tunnel : tout est produit et branché en 2 à 4 semaines. Pas de slides, pas d'agence satellite.",
    icon: Rocket,
    deliverables: [
      "Creatives & UGC tournés",
      "Tunnel complet déployé",
      "Campagnes Meta Ads lancées",
    ],
    accent: "from-brand-deep/25",
  },
  {
    number: "03",
    label: "Résultats",
    duration: "En continu",
    title: "On rend des comptes, pas des rapports.",
    description:
      "Dashboard partagé, chiffres à jour en temps réel, point hebdomadaire. Vous lisez le ROI, vous ne le devinez pas.",
    icon: BarChart3,
    deliverables: [
      "Dashboard live partagé",
      "Point hebdo orienté CA",
      "Itérations data-driven",
    ],
    accent: "from-accent/20",
  },
];

export function ProcessSection() {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="relative overflow-hidden bg-background py-10"
    >
      {/* Decorative mesh grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[320px] opacity-25 mesh-grid [mask-image:radial-gradient(ellipse_at_top,rgba(0,0,0,0.9),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 md:px-8">
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ duration: 0.55, ease }}
          className="mb-12 flex flex-col gap-3 md:mb-16"
        >
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-deep">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_0_3px_rgba(86,148,189,0.18)]"
            />
            Comment on travaille
          </p>
          <h2
            id="process-title"
            className="max-w-3xl font-display text-[clamp(30px,4.2vw,52px)] font-semibold leading-[1.02] tracking-[-0.02em] text-foreground text-balance"
          >
            Un process en trois temps.{" "}
            <span className="text-muted-foreground/80">
              Pensé pour rendre du ROI, pas des livrables.
            </span>
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            De l&apos;audit au dashboard partagé, en 4 semaines chrono — puis
            on itère ensemble chaque semaine sur la performance.
          </p>
        </motion.header>

        <div className="relative">
          {/* Horizontal connector line (desktop) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-[72px] hidden h-px lg:block"
            style={{
              background:
                "repeating-linear-gradient(to right, oklch(0.65 0.08 235 / 0.35) 0 6px, transparent 6px 14px)",
            }}
          />

          <ol className="grid gap-5 lg:grid-cols-3 lg:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === steps.length - 1;
              return (
                <motion.li
                  key={step.number}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px 0px" }}
                  transition={{
                    duration: 0.55,
                    ease,
                    delay: 0.1 + i * 0.12,
                  }}
                  className="relative"
                >
                  {/* Desktop arrow between cards */}
                  {!isLast ? (
                    <motion.span
                      aria-hidden
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-60px 0px" }}
                      transition={{
                        duration: 0.4,
                        ease,
                        delay: 0.4 + i * 0.12,
                      }}
                      className="absolute -right-3 top-[64px] z-20 hidden h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-brand-deep shadow-sm lg:flex"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </motion.span>
                  ) : null}

                  <article
                    className={cn(
                      "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs transition-all duration-300",
                      "hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg md:p-7",
                    )}
                  >
                    {/* Background gradient accent */}
                    <div
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-radial blur-2xl opacity-60",
                        "bg-gradient-to-br via-transparent to-transparent",
                        step.accent,
                      )}
                    />

                    {/* Header row: big number + icon badge */}
                    <div className="relative flex items-start justify-between gap-4">
                      <span className="font-display text-[56px] font-black leading-[0.85] tracking-[-0.04em] text-accent/25 tabular-nums transition-colors duration-300 group-hover:text-accent/40 md:text-[72px]">
                        {step.number}
                      </span>
                      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand-deep ring-1 ring-brand/20 transition-all duration-300 group-hover:bg-brand group-hover:text-white group-hover:ring-brand">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                    </div>

                    {/* Meta: label + duration chip */}
                    <div className="relative mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-deep">
                        {step.label}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        <span
                          aria-hidden
                          className="h-1 w-1 rounded-full bg-brand"
                        />
                        {step.duration}
                      </span>
                    </div>

                    {/* Title + description */}
                    <h3 className="relative mt-4 font-display text-[20px] font-semibold leading-[1.2] tracking-tight text-foreground text-balance md:text-[22px]">
                      {step.title}
                    </h3>
                    <p className="relative mt-3 text-pretty text-[14px] leading-relaxed text-muted-foreground md:text-[15px]">
                      {step.description}
                    </p>

                    {/* Deliverables with checkmarks */}
                    <ul className="relative mt-6 flex flex-col gap-2 border-t border-border/70 pt-5">
                      {step.deliverables.map((d) => (
                        <li
                          key={d}
                          className="flex items-start gap-2.5 text-[13px] leading-snug text-foreground/90"
                        >
                          <span
                            aria-hidden
                            className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand-deep"
                          >
                            <Check className="h-2.5 w-2.5" strokeWidth={3} />
                          </span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </article>
                </motion.li>
              );
            })}
          </ol>
        </div>

        {/* Timeline footer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px 0px" }}
          transition={{ duration: 0.5, ease, delay: 0.55 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 text-[12px] text-muted-foreground md:text-[13px]"
        >
          <span
            aria-hidden
            className="h-px w-8 bg-gradient-to-r from-transparent via-border to-border"
          />
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="flex h-1.5 w-1.5 rounded-full bg-brand"
            />
            Durée totale : <strong className="font-semibold text-foreground">4 à 6 semaines</strong>
            {" "}avant les premiers résultats chiffrés
          </span>
          <span
            aria-hidden
            className="h-px w-8 bg-gradient-to-l from-transparent via-border to-border"
          />
        </motion.p>
      </div>
    </section>
  );
}
