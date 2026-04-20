"use client";

import { motion } from "framer-motion";
import {
  Camera,
  Compass,
  FileText,
  Flag,
  Megaphone,
  MessageCircle,
  Route,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/format";
const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export type MediaRow = {
  id: string;
  media_type:
    | "image"
    | "video"
    | "screenshot"
    | "proof"
    | "ad_creative"
    | "ugc";
  file_url: string;
  title: string | null;
  description: string | null;
  sort_order: number;
};

export type ProofRow = {
  id: string;
  proof_type:
    | "ads_manager"
    | "crm"
    | "lead_form"
    | "analytics"
    | "testimonial";
  title: string | null;
  file_url: string | null;
  note: string | null;
};

export function SectionShell({
  number,
  eyebrow,
  title,
  description,
  children,
  tone = "default",
  id,
}: {
  number: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  tone?: "default" | "muted" | "dark";
  id?: string;
}) {
  const bg =
    tone === "dark"
      ? "bg-accent text-accent-foreground"
      : tone === "muted"
        ? "bg-surface-muted/60"
        : "bg-background";

  const rule =
    tone === "dark" ? "bg-white/20" : "bg-border";

  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className={cn("relative py-10", bg)}
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ duration: 0.55, ease }}
          className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-12"
        >
          <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
            <span
              className={cn(
                "font-display text-[11px] font-bold uppercase tracking-[0.24em]",
                tone === "dark" ? "text-brand" : "text-brand-deep",
              )}
            >
              {number}
            </span>
            <span className={cn("h-px w-10 md:w-14", rule)} aria-hidden />
            <span
              className={cn(
                "text-[11px] font-medium uppercase tracking-[0.2em]",
                tone === "dark"
                  ? "text-accent-foreground/70"
                  : "text-muted-foreground",
              )}
            >
              {eyebrow}
            </span>
          </div>
          <div className="max-w-3xl space-y-3">
            <h2
              id={id ? `${id}-title` : undefined}
              className={cn(
                "font-display text-[clamp(26px,3.2vw,44px)] font-semibold leading-[1.05] tracking-tight text-balance",
                tone === "dark" ? "text-accent-foreground" : "text-foreground",
              )}
            >
              {title}
            </h2>
            {description ? (
              <p
                className={cn(
                  "text-pretty text-[15px] md:text-base",
                  tone === "dark"
                    ? "text-accent-foreground/80"
                    : "text-muted-foreground",
                )}
              >
                {description}
              </p>
            ) : null}
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px 0px" }}
          transition={{ duration: 0.55, ease, delay: 0.08 }}
          className="mt-12 md:mt-14"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

function InfoBlock({
  label,
  body,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  body: string | null;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "dark";
}) {
  if (!body) return null;
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border p-6",
        tone === "dark"
          ? "border-white/10 bg-white/[0.04]"
          : "border-border bg-card",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg",
            tone === "dark"
              ? "bg-brand/20 text-brand"
              : "bg-brand/10 text-brand-deep",
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <p
          className={cn(
            "text-[11px] font-semibold uppercase tracking-[0.16em]",
            tone === "dark"
              ? "text-accent-foreground/80"
              : "text-muted-foreground",
          )}
        >
          {label}
        </p>
      </div>
      <p
        className={cn(
          "text-sm leading-relaxed text-pretty",
          tone === "dark"
            ? "text-accent-foreground/90"
            : "text-foreground",
        )}
      >
        {body}
      </p>
    </div>
  );
}

export function PresentationSection({
  initialSituation,
  shortProblem,
  businessGoal,
}: {
  initialSituation: string | null;
  shortProblem: string | null;
  businessGoal: string | null;
}) {
  if (!initialSituation && !shortProblem && !businessGoal) return null;
  return (
    <SectionShell
      id="presentation"
      number="01"
      eyebrow="Présentation"
      title="Le contexte de départ."
      description="Où en était le client avant l'intervention, et ce qu'il visait réellement."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <InfoBlock
          label="Situation initiale"
          body={initialSituation}
          icon={Flag}
        />
        <InfoBlock
          label="Problème clé"
          body={shortProblem}
          icon={Compass}
        />
        <InfoBlock
          label="Objectif business"
          body={businessGoal}
          icon={Target}
        />
      </div>
    </SectionShell>
  );
}

export function StrategySection({
  angle,
  positioning,
  offer,
  funnel,
  targeting,
}: {
  angle: string | null;
  positioning: string | null;
  offer: string | null;
  funnel: string | null;
  targeting: string | null;
}) {
  if (!angle && !positioning && !offer && !funnel && !targeting) return null;
  return (
    <SectionShell
      id="strategie"
      number="02"
      eyebrow="Stratégie"
      tone="dark"
      title={
        <>
          La stratégie, posée avant{" "}
          <span className="text-brand">la première publicité.</span>
        </>
      }
      description="Angle, positionnement, offre, tunnel et ciblage — les cinq décisions qui ont rendu le résultat inévitable."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <InfoBlock
          label="Angle marketing"
          body={angle}
          icon={Megaphone}
          tone="dark"
        />
        <InfoBlock
          label="Positionnement"
          body={positioning}
          icon={Compass}
          tone="dark"
        />
        <InfoBlock
          label="Offre proposée"
          body={offer}
          icon={FileText}
          tone="dark"
        />
        <InfoBlock
          label="Tunnel de conversion"
          body={funnel}
          icon={Route}
          tone="dark"
        />
        <InfoBlock
          label="Ciblage"
          body={targeting}
          icon={Users}
          tone="dark"
        />
      </div>
    </SectionShell>
  );
}

export function ExecutionSection({
  execution,
  media,
}: {
  execution: string | null;
  media: MediaRow[];
}) {
  const gallery = media.filter((m) =>
    ["image", "screenshot", "ad_creative", "ugc", "video"].includes(
      m.media_type,
    ),
  );
  if (!execution && gallery.length === 0) return null;

  return (
    <SectionShell
      id="execution"
      number="03"
      eyebrow="Exécution"
      title="Ce qui a été livré sur le terrain."
      description="Les assets, les pages et les séquences réellement déployés."
    >
      {execution ? (
        <div className="mb-10 max-w-3xl whitespace-pre-line text-[15px] leading-relaxed text-foreground md:text-base">
          {execution}
        </div>
      ) : null}

      {gallery.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {gallery.slice(0, 8).map((m) => (
            <figure
              key={m.id}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              {m.media_type === "video" || m.media_type === "ugc" ? (
                <video
                  src={m.file_url}
                  className="aspect-[3/4] h-full w-full object-cover"
                  muted
                  playsInline
                  controls
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.file_url}
                  alt={m.title ?? ""}
                  className="aspect-[3/4] h-full w-full object-cover"
                />
              )}
              {m.title ? (
                <figcaption className="border-t border-border bg-card px-3 py-2 text-[11px] text-muted-foreground">
                  {m.title}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}
    </SectionShell>
  );
}

function StatTile({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption?: string;
}) {
  return (
    <div className="flex flex-col border-t border-white/10 pt-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent-foreground/70">
        {label}
      </p>
      <p className="mt-2 font-display text-4xl font-black leading-none tabular-nums text-accent-foreground md:text-5xl">
        {value}
      </p>
      {caption ? (
        <p className="mt-2 text-xs text-accent-foreground/60">{caption}</p>
      ) : null}
    </div>
  );
}

export function ResultsSection({
  leads,
  costPerLead,
  clients,
  revenue,
  roas,
  proofs,
}: {
  leads: number | null;
  costPerLead: number | null;
  clients: number | null;
  revenue: number | null;
  roas: number | null;
  proofs: ProofRow[];
}) {
  const hasStat = leads || costPerLead || clients || revenue || roas;
  if (!hasStat && proofs.length === 0) return null;

  const proofTypeLabel: Record<string, string> = {
    ads_manager: "Ads Manager",
    crm: "CRM",
    lead_form: "Formulaire lead",
    analytics: "Analytics",
    testimonial: "Témoignage",
  };

  return (
    <SectionShell
      id="resultats"
      number="04"
      eyebrow="Résultats"
      tone="dark"
      title={
        <>
          Les chiffres,{" "}
          <span className="text-brand">mesurés et vérifiables.</span>
        </>
      }
      description="Pas d'impressions, pas de portée. Uniquement ce qui s'encaisse."
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
        {leads ? (
          <StatTile
            label="Leads qualifiés"
            value={formatNumber(leads)}
          />
        ) : null}
        {costPerLead ? (
          <StatTile
            label="Coût par lead"
            value={formatCurrency(costPerLead)}
          />
        ) : null}
        {clients ? (
          <StatTile
            label="Clients générés"
            value={formatNumber(clients)}
          />
        ) : null}
        {roas ? (
          <StatTile label="ROAS" value={`×${Number(roas).toFixed(1)}`} />
        ) : null}
        {revenue ? (
          <StatTile
            label="CA généré"
            value={formatCurrency(revenue)}
          />
        ) : null}
      </div>

      {proofs.length > 0 ? (
        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {proofs.map((p) => (
            <figure
              key={p.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-2"
            >
              {p.file_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.file_url}
                  alt={p.title ?? ""}
                  className="aspect-video w-full rounded-xl object-cover"
                />
              ) : null}
              <figcaption className="px-3 pb-2 pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
                  {proofTypeLabel[p.proof_type] ?? p.proof_type}
                </p>
                {p.title ? (
                  <p className="mt-1 text-sm font-medium text-accent-foreground">
                    {p.title}
                  </p>
                ) : null}
                {p.note ? (
                  <p className="mt-1 text-xs text-accent-foreground/70">
                    {p.note}
                  </p>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
    </SectionShell>
  );
}

export function BeforeAfterSection({
  trafficBefore,
  trafficAfter,
  revenueBefore,
  revenueAfter,
  visibilityBefore,
  visibilityAfter,
}: {
  trafficBefore: string | null;
  trafficAfter: string | null;
  revenueBefore: string | null;
  revenueAfter: string | null;
  visibilityBefore: string | null;
  visibilityAfter: string | null;
}) {
  const rows: {
    label: string;
    before: string | null;
    after: string | null;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      label: "Trafic",
      before: trafficBefore,
      after: trafficAfter,
      icon: TrendingUp,
    },
    {
      label: "Chiffre d'affaires",
      before: revenueBefore,
      after: revenueAfter,
      icon: FileText,
    },
    {
      label: "Visibilité",
      before: visibilityBefore,
      after: visibilityAfter,
      icon: Camera,
    },
  ].filter((row) => row.before || row.after);

  if (rows.length === 0) return null;

  return (
    <SectionShell
      id="avant-apres"
      number="05"
      eyebrow="Avant / Après"
      tone="muted"
      title="La transformation, côté client."
      description="Ce qui a concrètement changé dans le business entre le jour 1 et le jour final."
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-px bg-border">
          <div className="bg-card p-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Dimension
          </div>
          <div className="bg-card p-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Avant
          </div>
          <div className="bg-card p-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-deep">
            Après
          </div>
          {rows.map((row) => {
            const Icon = row.icon;
            return (
              <div key={row.label} className="contents">
                <div className="flex items-center gap-2 bg-card p-4 font-display text-sm font-semibold text-foreground">
                  <Icon className="h-3.5 w-3.5 text-brand-deep" />
                  {row.label}
                </div>
                <div className="bg-card p-4 text-sm text-muted-foreground">
                  {row.before ?? "—"}
                </div>
                <div className="bg-card p-4 text-sm font-medium text-foreground">
                  {row.after ?? "—"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

export function ConclusionSection({
  conclusion,
  testimonial,
  clientName,
}: {
  conclusion: string | null;
  testimonial: string | null;
  clientName: string | null;
}) {
  if (!conclusion && !testimonial) return null;
  return (
    <SectionShell
      id="conclusion"
      number="06"
      eyebrow="Conclusion"
      title="Ce que ça a vraiment changé."
    >
      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:gap-12">
        {conclusion ? (
          <p className="text-pretty text-lg leading-relaxed text-foreground md:text-[20px]">
            {conclusion}
          </p>
        ) : null}
        {testimonial ? (
          <figure className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm md:p-7">
            <MessageCircle
              className="h-5 w-5 text-brand-deep"
              aria-hidden
            />
            <blockquote className="mt-4 text-pretty font-display text-lg italic leading-snug tracking-tight text-foreground md:text-xl">
              « {testimonial} »
            </blockquote>
            {clientName ? (
              <figcaption className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {clientName}
              </figcaption>
            ) : null}
          </figure>
        ) : null}
      </div>
    </SectionShell>
  );
}
