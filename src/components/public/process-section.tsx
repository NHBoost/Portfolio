"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Rocket,
  Target,
} from "lucide-react";

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

type Step = {
  number: string;
  label: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  deliverables: string[];
};

const steps: Step[] = [
  {
    number: "01",
    label: "Cadrage",
    title: "On remonte jusqu'au business.",
    description:
      "Audit des canaux, du tunnel, de l'offre. On identifie les deux leviers qui font vraiment bouger le chiffre d'affaires — pas les vingt.",
    icon: Target,
    deliverables: [
      "Diagnostic 360°",
      "Objectif business chiffré",
      "KPIs de pilotage définis",
    ],
  },
  {
    number: "02",
    label: "Exécution",
    title: "On shipe en semaines, pas en mois.",
    description:
      "Creatives, landing, ads, tunnel : tout est produit et branché en 2 à 4 semaines. Pas de slides, pas d'agence satellite.",
    icon: Rocket,
    deliverables: [
      "Creatives & UGC",
      "Tunnel complet déployé",
      "Campagnes Meta Ads lancées",
    ],
  },
  {
    number: "03",
    label: "Résultats",
    title: "On rend des comptes, pas des rapports.",
    description:
      "Dashboard partagé, chiffres à jour en temps réel, point hebdomadaire. Vous lisez le ROI, vous ne le devinez pas.",
    icon: BarChart3,
    deliverables: [
      "Dashboard live partagé",
      "Point hebdo orienté CA",
      "Itérations sur la perf",
    ],
  },
];

export function ProcessSection() {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="relative overflow-hidden bg-background py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ duration: 0.55, ease }}
          className="mb-14 flex flex-col gap-3 md:mb-20"
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
        </motion.header>

        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[22px] top-12 hidden h-[calc(100%-6rem)] w-px bg-gradient-to-b from-border via-border/60 to-transparent md:block"
          />

          <ol className="space-y-10 md:space-y-14">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.li
                  key={step.number}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px 0px" }}
                  transition={{
                    duration: 0.55,
                    ease,
                    delay: 0.08 + i * 0.08,
                  }}
                  className="relative grid gap-6 md:grid-cols-[auto_1fr_1fr] md:gap-12"
                >
                  <div className="relative flex items-center gap-4 md:flex-col md:items-start md:gap-3">
                    <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card text-brand-deep shadow-[0_2px_6px_-2px_rgba(20,25,50,0.15)] transition-shadow group-hover:shadow-[0_4px_14px_-2px_rgba(20,25,50,0.2)]">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="flex flex-col leading-none md:mt-1">
                      <span className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-brand-deep">
                        {step.number}
                      </span>
                      <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {step.label}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-display text-[clamp(22px,2.4vw,28px)] font-semibold leading-[1.15] tracking-tight text-foreground text-balance">
                      {step.title}
                    </h3>
                    <p className="max-w-lg text-pretty text-[15px] leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>

                  <ul className="flex flex-col gap-2 text-sm md:self-center">
                    {step.deliverables.map((d) => (
                      <li
                        key={d}
                        className="flex items-start gap-2 text-foreground/90"
                      >
                        <span
                          aria-hidden
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand"
                        />
                        {d}
                      </li>
                    ))}
                  </ul>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
