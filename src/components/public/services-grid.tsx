"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Film,
  Megaphone,
  Monitor,
  Palette,
  Route,
  Search,
  Sparkles,
} from "lucide-react";
import type { ServiceRow } from "@/lib/public-data";

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

const serviceMeta: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }
> = {
  "meta-ads": {
    icon: Megaphone,
    description:
      "Campagnes Meta Ads architecturées pour générer un CPA stable et un ROAS mesuré.",
  },
  "creation-contenu": {
    icon: Film,
    description:
      "UGC, reels et creatives vidéo conçus pour convertir — pas juste faire joli.",
  },
  "site-web": {
    icon: Monitor,
    description:
      "Sites et landing pages pensés pour transformer le trafic en rendez-vous.",
  },
  funnel: {
    icon: Route,
    description:
      "Tunnels de conversion de bout en bout, de l'ad à la signature.",
  },
  seo: {
    icon: Search,
    description:
      "SEO technique et contenu qui positionne sur les requêtes à fort intent.",
  },
  branding: {
    icon: Palette,
    description:
      "Identité visuelle et tone-of-voice pensés pour tenir en rendez-vous.",
  },
};

export function ServicesGrid({ items }: { items: ServiceRow[] }) {
  if (items.length === 0) return null;
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative bg-surface-muted/70 py-10"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ duration: 0.55, ease }}
          className="max-w-2xl space-y-3"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-deep">
            Services
          </p>
          <h2
            id="services-title"
            className="font-display text-[clamp(28px,3.4vw,44px)] font-semibold leading-[1.05] tracking-tight text-foreground text-balance"
          >
            Ce qu&apos;on vend, réellement.
          </h2>
          <p className="text-muted-foreground">
            Cinq leviers que l&apos;on active pour produire les ROI qui
            apparaissent dans les études de cas.
          </p>
        </motion.header>

        <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {items.map((service, i) => {
            const meta = serviceMeta[service.slug];
            const Icon = meta?.icon ?? Sparkles;
            const description =
              meta?.description ??
              "Prestation sur-mesure, détaillée en rendez-vous selon votre contexte.";
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px 0px" }}
                transition={{
                  duration: 0.45,
                  ease,
                  delay: Math.min(i * 0.05, 0.3),
                }}
                className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md md:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand-deep">
                    <Icon className="h-4 w-4" />
                  </span>
                  <Link
                    href={`/etudes-de-cas?service=${service.slug}`}
                    className="text-muted-foreground transition-colors hover:text-brand-deep"
                    aria-label={`Voir les études avec ${service.name}`}
                  >
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
                <Link
                  href={`/etudes-de-cas?service=${service.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-brand-deep transition-colors group-hover:text-accent"
                >
                  Voir les études associées
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
