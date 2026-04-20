"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FranchiseSettings } from "@/lib/public-data";

export function FinalCta({
  settings,
  eyebrow = "Passer à l'action",
  title = "Parlons de ce que votre marketing devrait vraiment vous rapporter.",
  description = "Un échange de 20 minutes suffit pour évaluer le ROI réaliste d'une campagne chez vous. Sans engagement, orienté résultats.",
}: {
  settings: FranchiseSettings | null;
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const primary =
    settings?.whatsapp_url ??
    (settings?.email ? `mailto:${settings.email}` : null);
  const primaryLabel = settings?.cta_text ?? "Prendre rendez-vous";

  return (
    <section
      id="contact"
      aria-labelledby="final-cta-title"
      className="relative bg-background pb-24 pt-20 md:pb-32 md:pt-28"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 shadow-sm md:p-16"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-1/4 top-0 h-full w-2/3 opacity-25 mesh-grid [mask-image:radial-gradient(circle_at_right,rgba(0,0,0,0.85),transparent_70%)]"
          />
          <div className="relative grid gap-10 md:grid-cols-[1.5fr_1fr] md:items-end md:gap-16">
            <div className="space-y-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-deep">
                {eyebrow}
              </p>
              <h2
                id="final-cta-title"
                className="font-display text-[clamp(30px,4vw,48px)] font-semibold leading-[1.04] tracking-tight text-foreground text-balance"
              >
                {title}
              </h2>
              <p className="max-w-xl text-base text-muted-foreground">
                {description}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {primary ? (
                  <Link
                    href={primary}
                    target={primary.startsWith("http") ? "_blank" : undefined}
                    rel={
                      primary.startsWith("http") ? "noreferrer" : undefined
                    }
                    className={cn(
                      buttonVariants({ variant: "default", size: "lg" }),
                      "group px-5",
                    )}
                  >
                    {primaryLabel}
                    <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                ) : null}
                {settings?.email ? (
                  <a
                    href={`mailto:${settings.email}`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "lg" }),
                      "px-5 text-foreground",
                    )}
                  >
                    {settings.email}
                  </a>
                ) : null}
              </div>
            </div>

            <div className="space-y-4 border-t border-border/70 pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Autres canaux
              </p>
              <ul className="space-y-3 text-sm">
                {settings?.whatsapp_url ? (
                  <li>
                    <a
                      href={settings.whatsapp_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-brand-deep"
                    >
                      <MessageCircle className="h-4 w-4 text-brand-deep" />
                      WhatsApp direct
                    </a>
                  </li>
                ) : null}
                {settings?.phone ? (
                  <li>
                    <a
                      href={`tel:${settings.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-brand-deep"
                    >
                      <Phone className="h-4 w-4 text-brand-deep" />
                      {settings.phone}
                    </a>
                  </li>
                ) : null}
                {settings?.email ? (
                  <li>
                    <a
                      href={`mailto:${settings.email}`}
                      className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-brand-deep"
                    >
                      <Mail className="h-4 w-4 text-brand-deep" />
                      {settings.email}
                    </a>
                  </li>
                ) : null}
                {!settings?.whatsapp_url && !settings?.phone && !settings?.email ? (
                  <li className="text-muted-foreground">
                    Les coordonnées seront disponibles depuis l&apos;admin.
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
