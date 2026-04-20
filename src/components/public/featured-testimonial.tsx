"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Quote } from "lucide-react";
import type { FeaturedTestimonialEntry } from "@/lib/public-data";

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export function FeaturedTestimonial({
  entry,
}: {
  entry: FeaturedTestimonialEntry | null;
}) {
  if (!entry) return null;

  return (
    <section
      aria-labelledby="featured-testimonial-title"
      className="relative overflow-hidden bg-accent py-10 text-accent-foreground"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 h-[440px] w-[560px] -translate-y-1/2 rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.08 235 / 0.4), transparent 65%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-5xl px-4 md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ duration: 0.5, ease }}
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand"
        >
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_0_3px_rgba(86,148,189,0.25)]"
          />
          Ce que nos clients disent
        </motion.p>

        <motion.blockquote
          id="featured-testimonial-title"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ duration: 0.6, ease, delay: 0.08 }}
          className="relative mt-8 max-w-4xl"
        >
          <Quote
            aria-hidden
            className="absolute -left-1 -top-6 h-10 w-10 text-brand/30 md:-left-4 md:-top-8 md:h-12 md:w-12"
          />
          <p className="font-display text-[clamp(28px,3.8vw,48px)] font-semibold italic leading-[1.15] tracking-[-0.015em] text-accent-foreground text-balance">
            « {entry.testimonial} »
          </p>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px 0px" }}
          transition={{ duration: 0.55, ease, delay: 0.15 }}
          className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-center gap-4">
            <span
              aria-hidden
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.08] font-display text-base font-bold tracking-tight text-accent-foreground ring-1 ring-white/10"
            >
              {entry.client_name?.charAt(0).toUpperCase() ?? "C"}
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold tracking-tight text-accent-foreground">
                {entry.client_name ?? "Client"}
              </span>
              <span className="text-xs text-accent-foreground/60">
                {entry.sector ? `${entry.sector} · ` : ""}
                {entry.project_name}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            {entry.roi ? (
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                  ROI
                </span>
                <span className="font-display text-2xl font-black leading-none tabular-nums text-accent-foreground">
                  ×{entry.roi.toFixed(1)}
                </span>
              </div>
            ) : null}
            <Link
              href={`/etudes-de-cas/${entry.slug}`}
              className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-accent-foreground transition-colors hover:border-brand/60 hover:bg-brand/10 hover:text-brand"
            >
              Lire l&apos;étude complète
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
