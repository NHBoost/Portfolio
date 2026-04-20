"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatRoi } from "@/lib/format";

export type CaseStudyCardData = {
  slug: string;
  project_name: string;
  client_name: string | null;
  sector: string | null;
  short_problem: string | null;
  cover_image_url: string | null;
  ad_budget: number | null;
  revenue_generated: number | null;
  leads_count: number | null;
  roi: number | null;
};

type Variant = "feature" | "default";

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export function CaseStudyCard({
  data,
  variant = "default",
  index = 0,
}: {
  data: CaseStudyCardData;
  variant?: Variant;
  index?: number;
}) {
  const isFeature = variant === "feature";
  const href = `/etudes-de-cas/${data.slug}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px 0px" }}
      transition={{ duration: 0.55, ease, delay: index * 0.05 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border bg-card transition-shadow hover:shadow-lg",
        isFeature ? "md:col-span-2 md:row-span-2" : "",
      )}
    >
      <Link
        href={href}
        aria-label={`Lire l'étude ${data.project_name}`}
        className="flex h-full flex-col"
      >
        <div
          className={cn(
            "relative overflow-hidden",
            isFeature ? "aspect-[16/9]" : "aspect-[3/2]",
          )}
        >
          {data.cover_image_url ? (
            <Image
              src={data.cover_image_url}
              alt={`Cover ${data.project_name}`}
              fill
              sizes={
                isFeature
                  ? "(min-width: 1024px) 740px, (min-width: 768px) 66vw, 100vw"
                  : "(min-width: 1024px) 360px, (min-width: 768px) 33vw, 100vw"
              }
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 20%, oklch(0.65 0.08 235 / 0.22), transparent 60%), linear-gradient(135deg, oklch(0.29 0.09 270), oklch(0.48 0.09 245))",
              }}
              aria-hidden
            />
          )}

          {data.sector ? (
            <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/25 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white backdrop-blur-sm">
              {data.sector}
            </span>
          ) : null}

          {data.roi ? (
            <div className="absolute right-4 top-4 flex items-baseline gap-1 rounded-xl bg-white/95 px-3 py-1.5 text-accent shadow-sm backdrop-blur">
              <span className="font-display text-xs font-black leading-none">
                ×
              </span>
              <span className="font-display text-xl font-black leading-none tabular-nums">
                {data.roi.toFixed(1)}
              </span>
              <span className="ml-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                ROI
              </span>
            </div>
          ) : null}
        </div>

        <div
          className={cn(
            "flex flex-1 flex-col gap-5 p-6",
            isFeature && "md:p-8 md:gap-6",
          )}
        >
          <div>
            <h3
              className={cn(
                "font-display font-semibold leading-tight tracking-tight text-foreground text-balance",
                isFeature
                  ? "text-[clamp(24px,2.6vw,32px)]"
                  : "text-xl md:text-[22px]",
              )}
            >
              {data.project_name}
            </h3>
            {data.client_name ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {data.client_name}
              </p>
            ) : null}
          </div>
          {data.short_problem ? (
            <p
              className={cn(
                "flex-1 text-muted-foreground text-pretty",
                isFeature ? "text-[15px]" : "text-sm",
              )}
            >
              {data.short_problem}
            </p>
          ) : (
            <span aria-hidden className="flex-1" />
          )}

          <dl className="grid grid-cols-3 divide-x divide-border border-t border-border pt-4">
            <div className="pr-3">
              <dt className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Budget ads
              </dt>
              <dd className="mt-1 font-display text-sm font-semibold tabular-nums text-foreground">
                {data.ad_budget ? formatCurrency(data.ad_budget) : "—"}
              </dd>
            </div>
            <div className="px-3">
              <dt className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                CA généré
              </dt>
              <dd className="mt-1 font-display text-sm font-semibold tabular-nums text-foreground">
                {data.revenue_generated
                  ? formatCurrency(data.revenue_generated)
                  : "—"}
              </dd>
            </div>
            <div className="pl-3">
              <dt className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Leads
              </dt>
              <dd className="mt-1 font-display text-sm font-semibold tabular-nums text-foreground">
                {data.leads_count ?? "—"}
              </dd>
            </div>
          </dl>

          <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-deep transition-all group-hover:gap-1.5">
            Lire l&apos;étude
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export function CaseStudyGrid({
  items,
}: {
  items: CaseStudyCardData[];
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
        <p className="font-display text-xl font-semibold text-foreground">
          Aucune étude à afficher pour le moment
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Les études publiées apparaîtront ici, triées par impact.
        </p>
      </div>
    );
  }

  const [feature, ...rest] = items;
  return (
    <div className="grid gap-5 md:grid-cols-3 md:auto-rows-fr">
      <CaseStudyCard data={feature} variant="feature" index={0} />
      {rest.map((c, i) => (
        <CaseStudyCard
          key={c.slug}
          data={c}
          variant="default"
          index={i + 1}
        />
      ))}
    </div>
  );
}
