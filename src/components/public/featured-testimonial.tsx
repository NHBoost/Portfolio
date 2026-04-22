"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import type { FeaturedTestimonialEntry } from "@/lib/public-data";

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

function initialsOf(name: string | null): string {
  if (!name) return "C";
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function FeaturedTestimonial({
  entry,
}: {
  entry: FeaturedTestimonialEntry | null;
}) {
  if (!entry) return null;

  return (
    <section
      id="temoignage"
      aria-labelledby="featured-testimonial-title"
      className="relative overflow-hidden bg-accent py-10 text-accent-foreground"
    >
      {/* Subtle grid pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      {/* Brand glow right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 h-[440px] w-[560px] -translate-y-1/2 rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.08 235 / 0.4), transparent 65%)",
        }}
      />
      {/* Giant decorative quote glyph */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-6 top-0 select-none font-display text-[280px] font-black leading-none tracking-tighter text-white/[0.04] md:text-[420px]"
      >
        &ldquo;
      </div>

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
          <p className="font-display text-[clamp(28px,3.8vw,48px)] font-semibold italic leading-[1.15] tracking-[-0.015em] text-accent-foreground text-balance">
            <span
              aria-hidden
              className="mr-1 font-display text-brand"
            >
              &ldquo;
            </span>
            {entry.testimonial}
            <span
              aria-hidden
              className="ml-1 font-display text-brand"
            >
              &rdquo;
            </span>
          </p>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px 0px" }}
          transition={{ duration: 0.55, ease, delay: 0.15 }}
          className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-6 md:mt-12 md:flex-row md:items-center md:justify-between md:gap-8"
        >
          <div className="flex items-center gap-4">
            <span
              aria-hidden
              className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-display text-base font-bold tracking-tight text-white ring-1 ring-white/15"
              style={{
                background:
                  "radial-gradient(ellipse at top left, oklch(0.65 0.08 235 / 0.6), transparent 60%), linear-gradient(135deg, oklch(0.35 0.08 265), oklch(0.25 0.08 265))",
              }}
            >
              {initialsOf(entry.client_name)}
              <span
                aria-hidden
                className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] text-accent ring-2 ring-accent"
                title="Client vérifié"
              >
                <ShieldCheck className="h-3 w-3" />
              </span>
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold tracking-tight text-accent-foreground">
                {entry.client_name ?? "Client"}
              </span>
              <span className="mt-0.5 flex items-center gap-1.5 text-xs text-accent-foreground/60">
                {entry.sector ? (
                  <span className="rounded-full border border-white/15 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-accent-foreground/80">
                    {entry.sector}
                  </span>
                ) : null}
                <span className="truncate">{entry.project_name}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-6">
            {entry.roi ? (
              <div className="flex items-center gap-3 rounded-2xl border border-brand/30 bg-white/[0.04] px-4 py-2 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-brand" />
                <div className="flex flex-col leading-none">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
                    Retour mesuré
                  </span>
                  <span className="mt-1 flex items-baseline gap-0.5 font-display font-black leading-none tabular-nums text-accent-foreground">
                    <span className="text-sm">×</span>
                    <span className="text-2xl">{entry.roi.toFixed(1)}</span>
                  </span>
                </div>
              </div>
            ) : null}
            <Link
              href={`/etudes-de-cas/${entry.slug}`}
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-accent-foreground/80 transition-colors hover:text-brand"
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
