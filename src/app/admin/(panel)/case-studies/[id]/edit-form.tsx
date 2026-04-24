"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  BookOpen,
  ClipboardList,
  LineChart,
  Rocket,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaUrlInput } from "@/components/admin/media-url-input";
import type { Database } from "@/types/database";
import { cn } from "@/lib/utils";
import { formatCurrency, formatRoi } from "@/lib/format";
import { updateCaseStudyAction } from "../actions";

type CaseStudy = Database["public"]["Tables"]["case_studies"]["Row"];
type Status = CaseStudy["status"];

const NONE = "__none__";

type Props = {
  caseStudy: CaseStudy;
  sectors: { id: string; name: string }[];
  services: { id: string; name: string }[];
  selectedServiceIds: string[];
};

type SectionDef = {
  number: string;
  id: string;
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
};

const sections: SectionDef[] = [
  {
    number: "01",
    id: "general",
    title: "Informations générales",
    description: "Contexte client, slug public, assets visuels clés.",
    icon: BookOpen,
  },
  {
    number: "02",
    id: "presentation",
    title: "Présentation initiale",
    description: "Situation de départ, problème, objectif business.",
    icon: ClipboardList,
  },
  {
    number: "03",
    id: "strategy",
    title: "Stratégie",
    description: "Angle, positionnement, offre, tunnel, ciblage.",
    icon: Target,
  },
  {
    number: "04",
    id: "execution",
    title: "Exécution",
    description: "Ce qui a été livré concrètement sur le terrain.",
    icon: Rocket,
  },
  {
    number: "05",
    id: "results",
    title: "Résultats & ROI",
    description: "Chiffres clés de la campagne, calcul de ROI en temps réel.",
    icon: Trophy,
  },
  {
    number: "06",
    id: "before-after",
    title: "Avant / Après",
    description: "Transformation concrète vécue par le client.",
    icon: LineChart,
  },
  {
    number: "07",
    id: "conclusion",
    title: "Conclusion",
    description: "Impact business final et témoignage pour le closing.",
    icon: Sparkles,
  },
];

function Section({
  section,
  children,
}: {
  section: SectionDef;
  children: React.ReactNode;
}) {
  const Icon = section.icon;
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      className="scroll-mt-24 rounded-2xl border border-border bg-card shadow-xs"
    >
      <header className="flex items-start gap-4 border-b border-border/70 px-6 py-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand-deep">
          <Icon className="h-4 w-4" />
        </span>
        <div className="flex flex-col">
          <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-deep">
            Section {section.number}
          </p>
          <h2
            id={`${section.id}-title`}
            className="font-display text-lg font-semibold tracking-tight text-foreground"
          >
            {section.title}
          </h2>
          {section.description ? (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {section.description}
            </p>
          ) : null}
        </div>
      </header>
      <div className="space-y-5 px-6 py-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  name,
  children,
  hint,
  className,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={name} className="text-xs font-medium">
        {label}
      </Label>
      {children}
      {hint ? (
        <p className="text-xs text-muted-foreground/80">{hint}</p>
      ) : null}
    </div>
  );
}

function numberValue(v: string) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

const statusMeta: Record<Status, { label: string; dot: string; text: string }> =
  {
    published: {
      label: "Publiée",
      dot: "bg-emerald-500",
      text: "text-emerald-700",
    },
    draft: {
      label: "Brouillon",
      dot: "bg-amber-400",
      text: "text-amber-700",
    },
    archived: {
      label: "Archivée",
      dot: "bg-muted-foreground/50",
      text: "text-muted-foreground",
    },
  };

export function CaseStudyEditForm({
  caseStudy,
  sectors,
  services,
  selectedServiceIds,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sectorId, setSectorId] = useState<string>(
    caseStudy.sector_id ?? NONE,
  );
  const [status, setStatus] = useState<Status>(caseStudy.status);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set(selectedServiceIds),
  );

  // Live ROI calculation state
  const [adBudget, setAdBudget] = useState<string>(
    String(caseStudy.ad_budget ?? ""),
  );
  const [revenue, setRevenue] = useState<string>(
    String(caseStudy.revenue_generated ?? ""),
  );
  const [roiOverride, setRoiOverride] = useState<string>(
    String(caseStudy.roi ?? ""),
  );
  const [coverImageUrl, setCoverImageUrl] = useState<string>(
    caseStudy.cover_image_url ?? "",
  );
  const [clientLogoUrl, setClientLogoUrl] = useState<string>(
    caseStudy.client_logo_url ?? "",
  );

  const liveRoi = useMemo(() => {
    const b = numberValue(adBudget);
    const r = numberValue(revenue);
    if (b <= 0 || r <= 0) return null;
    return r / b;
  }, [adBudget, revenue]);

  function toggleService(id: string) {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    fd.set("sector_id", sectorId === NONE ? "" : sectorId);
    fd.set("status", status);
    fd.set("cover_image_url", coverImageUrl);
    fd.set("client_logo_url", clientLogoUrl);
    // If user didn't explicitly override ROI, persist the live value
    if (!fd.get("roi") && liveRoi) {
      fd.set("roi", liveRoi.toFixed(2));
    }
    fd.delete("service_ids[]");
    for (const id of selectedServices) fd.append("service_ids[]", id);

    startTransition(async () => {
      const result = await updateCaseStudyAction(caseStudy.id, fd);
      if (!result.success) {
        toast.error(result.error ?? "Échec de la sauvegarde");
        return;
      }
      toast.success("Étude de cas enregistrée");
      router.refresh();
    });
  }

  const meta = statusMeta[status];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sticky action bar */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-16 z-20 -mx-6 flex flex-wrap items-center gap-3 border-b border-border bg-background/85 px-6 py-3 backdrop-blur md:-mx-10 md:px-10"
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium",
              meta.text,
            )}
          >
            <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
            {meta.label}
          </span>
          {liveRoi ? (
            <span className="hidden text-xs text-muted-foreground md:inline-flex">
              ROI calculé : <span className="ml-1 font-display font-semibold text-brand-deep">{formatRoi(liveRoi)}</span>
            </span>
          ) : null}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Select
            value={status}
            onValueChange={(v) => v && setStatus(v as Status)}
          >
            <SelectTrigger className="h-8 w-36 bg-card text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="published">Publiée</SelectItem>
              <SelectItem value="archived">Archivée</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={isPending} size="sm">
            {isPending ? "Sauvegarde..." : "Enregistrer"}
          </Button>
        </div>
      </motion.div>

      {/* Section anchors */}
      <nav
        aria-label="Navigation des sections"
        className="hidden flex-wrap gap-1.5 lg:flex"
      >
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand-deep"
          >
            <span className="font-display text-[10px] font-semibold text-muted-foreground/70 group-hover:text-brand-deep">
              {s.number}
            </span>
            <span>{s.title}</span>
          </a>
        ))}
      </nav>

      <Section section={sections[0]}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Nom du projet" name="project_name">
            <Input name="project_name" defaultValue={caseStudy.project_name} />
          </Field>
          <Field label="Slug" name="slug" hint="Utilisé dans l'URL publique.">
            <Input name="slug" defaultValue={caseStudy.slug} />
          </Field>
          <Field label="Client" name="client_name">
            <Input name="client_name" defaultValue={caseStudy.client_name ?? ""} />
          </Field>
          <Field label="Secteur" name="sector_id">
            <Select
              value={sectorId}
              onValueChange={(v) => setSectorId(v ?? NONE)}
            >
              <SelectTrigger id="sector_id">
                {sectorId !== NONE ? (
                  <SelectValue />
                ) : (
                  <span className="text-muted-foreground">— Aucun —</span>
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>— Aucun —</SelectItem>
                {sectors.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Image de couverture" name="cover_image_url">
            <MediaUrlInput
              id="cover_image_url"
              name="cover_image_url"
              value={coverImageUrl}
              onChange={setCoverImageUrl}
              accept={{ "image/*": [] }}
              pathPrefix={`case-studies/${caseStudy.slug ?? caseStudy.id}/cover`}
              previewHint="image"
              disabled={isPending}
            />
          </Field>
          <Field label="Logo client" name="client_logo_url">
            <MediaUrlInput
              id="client_logo_url"
              name="client_logo_url"
              value={clientLogoUrl}
              onChange={setClientLogoUrl}
              accept={{ "image/*": [] }}
              pathPrefix={`case-studies/${caseStudy.slug ?? caseStudy.id}/logo`}
              previewHint="image"
              disabled={isPending}
            />
          </Field>
        </div>
        <Field label="Services associés" name="service_ids">
          <div className="flex flex-wrap gap-1.5">
            {services.map((s) => {
              const active = selectedServices.has(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleService(s.id)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-all",
                    active
                      ? "border-brand bg-brand text-white shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-brand-deep",
                  )}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </Field>
      </Section>

      <Section section={sections[1]}>
        <Field label="Situation initiale" name="initial_situation">
          <Textarea
            name="initial_situation"
            rows={3}
            defaultValue={caseStudy.initial_situation ?? ""}
          />
        </Field>
        <Field
          label="Problème clé (court, accroche)"
          name="short_problem"
        >
          <Textarea
            name="short_problem"
            rows={2}
            defaultValue={caseStudy.short_problem ?? ""}
          />
        </Field>
        <Field label="Objectif business" name="business_goal">
          <Textarea
            name="business_goal"
            rows={3}
            defaultValue={caseStudy.business_goal ?? ""}
          />
        </Field>
      </Section>

      <Section section={sections[2]}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Angle marketing" name="strategy_angle">
            <Textarea
              name="strategy_angle"
              rows={3}
              defaultValue={caseStudy.strategy_angle ?? ""}
            />
          </Field>
          <Field label="Positionnement" name="positioning">
            <Textarea
              name="positioning"
              rows={3}
              defaultValue={caseStudy.positioning ?? ""}
            />
          </Field>
          <Field label="Offre proposée" name="offer_details">
            <Textarea
              name="offer_details"
              rows={3}
              defaultValue={caseStudy.offer_details ?? ""}
            />
          </Field>
          <Field label="Tunnel de conversion" name="funnel_details">
            <Textarea
              name="funnel_details"
              rows={3}
              defaultValue={caseStudy.funnel_details ?? ""}
            />
          </Field>
        </div>
        <Field label="Ciblage" name="targeting_details">
          <Textarea
            name="targeting_details"
            rows={3}
            defaultValue={caseStudy.targeting_details ?? ""}
          />
        </Field>
      </Section>

      <Section section={sections[3]}>
        <Field label="Détails d'exécution" name="execution_details">
          <Textarea
            name="execution_details"
            rows={5}
            defaultValue={caseStudy.execution_details ?? ""}
          />
        </Field>
      </Section>

      <Section section={sections[4]}>
        {/* Live ROI preview */}
        <div className="grid gap-3 rounded-xl border border-border bg-surface-muted/70 p-5 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Retour sur investissement
            </p>
            <p className="mt-1 flex items-baseline gap-1 font-display font-black leading-none tracking-tight text-accent">
              <span className="text-3xl">×</span>
              <span className="text-[56px] tabular-nums">
                {liveRoi ? liveRoi.toFixed(1) : "—"}
              </span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Calculé automatiquement à partir du CA et du budget saisis.
              {roiOverride && Number(roiOverride) > 0
                ? " Une valeur manuelle a été renseignée, elle prévaut."
                : ""}
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-4 self-center text-sm md:self-end md:text-right">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Budget ads
              </dt>
              <dd className="font-display text-lg font-semibold tabular-nums text-foreground">
                {formatCurrency(adBudget)}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                CA généré
              </dt>
              <dd className="font-display text-lg font-semibold tabular-nums text-foreground">
                {formatCurrency(revenue)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Nombre de leads" name="leads_count">
            <Input
              name="leads_count"
              type="number"
              step="1"
              defaultValue={caseStudy.leads_count ?? ""}
            />
          </Field>
          <Field label="Coût par lead (€)" name="cost_per_lead">
            <Input
              name="cost_per_lead"
              type="number"
              step="any"
              defaultValue={caseStudy.cost_per_lead ?? ""}
            />
          </Field>
          <Field label="Clients générés" name="clients_count">
            <Input
              name="clients_count"
              type="number"
              step="1"
              defaultValue={caseStudy.clients_count ?? ""}
            />
          </Field>
          <Field label="Budget ads (€)" name="ad_budget">
            <Input
              name="ad_budget"
              type="number"
              step="any"
              value={adBudget}
              onChange={(e) => setAdBudget(e.target.value)}
            />
          </Field>
          <Field label="CA généré (€)" name="revenue_generated">
            <Input
              name="revenue_generated"
              type="number"
              step="any"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
            />
          </Field>
          <Field label="ROAS" name="roas">
            <Input
              name="roas"
              type="number"
              step="any"
              defaultValue={caseStudy.roas ?? ""}
            />
          </Field>
          <Field
            label="ROI manuel (facultatif)"
            name="roi"
            hint="Laisser vide pour utiliser la valeur calculée."
            className="md:col-span-3"
          >
            <Input
              name="roi"
              type="number"
              step="any"
              value={roiOverride}
              onChange={(e) => setRoiOverride(e.target.value)}
              placeholder={liveRoi ? liveRoi.toFixed(2) : "Ex: 8.5"}
            />
          </Field>
        </div>
      </Section>

      <Section section={sections[5]}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Trafic avant" name="traffic_before">
            <Input
              name="traffic_before"
              defaultValue={caseStudy.traffic_before ?? ""}
            />
          </Field>
          <Field label="Trafic après" name="traffic_after">
            <Input
              name="traffic_after"
              defaultValue={caseStudy.traffic_after ?? ""}
            />
          </Field>
          <Field label="CA avant" name="revenue_before">
            <Input
              name="revenue_before"
              defaultValue={caseStudy.revenue_before ?? ""}
            />
          </Field>
          <Field label="CA après" name="revenue_after">
            <Input
              name="revenue_after"
              defaultValue={caseStudy.revenue_after ?? ""}
            />
          </Field>
          <Field label="Visibilité avant" name="visibility_before">
            <Input
              name="visibility_before"
              defaultValue={caseStudy.visibility_before ?? ""}
            />
          </Field>
          <Field label="Visibilité après" name="visibility_after">
            <Input
              name="visibility_after"
              defaultValue={caseStudy.visibility_after ?? ""}
            />
          </Field>
        </div>
      </Section>

      <Section section={sections[6]}>
        <Field label="Conclusion / impact" name="conclusion">
          <Textarea
            name="conclusion"
            rows={4}
            defaultValue={caseStudy.conclusion ?? ""}
          />
        </Field>
        <Field label="Témoignage client" name="testimonial">
          <Textarea
            name="testimonial"
            rows={3}
            defaultValue={caseStudy.testimonial ?? ""}
          />
        </Field>
      </Section>
    </form>
  );
}
