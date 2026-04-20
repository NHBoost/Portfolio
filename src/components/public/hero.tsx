"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
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
}: {
  settings: FranchiseSettings | null;
  spotlight: Spotlight;
}) {
  const primaryCta =
    settings?.whatsapp_url ??
    (settings?.email ? `mailto:${settings.email}` : "#etudes");
  const primaryLabel = settings?.cta_text ?? "Parler à un expert";

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-background pt-14 pb-28 md:pt-20 md:pb-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-[520px] opacity-60 mesh-grid [mask-image:radial-gradient(circle_at_top,rgba(0,0,0,0.85),transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[min(680px,80vw)] -translate-x-1/2 rounded-b-[999px] blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.65 0.08 235 / 0.18), transparent 70%)",
        }}
      />

      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 md:px-8"
      >
        <motion.p
          variants={item}
          className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-card/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-brand-deep backdrop-blur"
        >
          <Sparkles className="h-3 w-3" />
          Portfolio · Performance mesurée
        </motion.p>

        <div className="grid items-end gap-12 md:grid-cols-[1.25fr_1fr] md:gap-16">
          <div className="space-y-8">
            <motion.h1
              id="hero-title"
              variants={item}
              className="font-display text-[clamp(40px,6vw,76px)] font-semibold leading-[0.98] tracking-[-0.02em] text-foreground text-balance"
            >
              Chaque euro investi{" "}
              <span className="text-muted-foreground/70">laisse</span>{" "}
              <span className="text-accent">une trace.</span>
            </motion.h1>
            <motion.p
              variants={item}
              className="max-w-xl text-pretty text-base text-muted-foreground md:text-lg"
            >
              Ce portfolio ne raconte pas ce que nous faisons. Il prouve
              combien ça rapporte à nos clients — en leads, en clients, en
              chiffre d&apos;affaires réellement encaissé.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap items-center gap-3">
              <Link
                href={primaryCta}
                target={primaryCta.startsWith("http") ? "_blank" : undefined}
                rel={primaryCta.startsWith("http") ? "noreferrer" : undefined}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "group px-5",
                )}
              >
                {primaryLabel}
                <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="#etudes"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "group px-5 text-foreground",
                )}
              >
                Voir les études
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </div>

          <motion.aside
            variants={item}
            aria-label="Étude de cas à la une"
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur md:p-7">
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
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-deep">
                    Étude à la une
                  </p>
                  {spotlight ? (
                    <Link
                      href={`/etudes-de-cas/${spotlight.slug}`}
                      className="text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Lire →
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
      </motion.div>
    </section>
  );
}
