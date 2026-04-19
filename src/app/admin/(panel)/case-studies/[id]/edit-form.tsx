"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import type { Database } from "@/types/database";
import { updateCaseStudyAction } from "../actions";

type CaseStudy = Database["public"]["Tables"]["case_studies"]["Row"];

const NONE = "__none__";

type Props = {
  caseStudy: CaseStudy;
  sectors: { id: string; name: string }[];
  services: { id: string; name: string }[];
  selectedServiceIds: string[];
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function Field({
  label,
  name,
  children,
  hint,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function TextInput({
  name,
  defaultValue,
  placeholder,
}: {
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
}) {
  return (
    <Input
      id={name}
      name={name}
      defaultValue={defaultValue ?? ""}
      placeholder={placeholder}
    />
  );
}

function NumberInput({
  name,
  defaultValue,
  step = "any",
}: {
  name: string;
  defaultValue?: number | null;
  step?: string;
}) {
  return (
    <Input
      id={name}
      name={name}
      type="number"
      step={step}
      defaultValue={defaultValue ?? ""}
    />
  );
}

function TextareaInput({
  name,
  defaultValue,
  rows = 3,
}: {
  name: string;
  defaultValue?: string | null;
  rows?: number;
}) {
  return (
    <Textarea
      id={name}
      name={name}
      rows={rows}
      defaultValue={defaultValue ?? ""}
    />
  );
}

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
  const [status, setStatus] = useState<CaseStudy["status"]>(caseStudy.status);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set(selectedServiceIds),
  );

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
    fd.delete("service_ids[]");
    for (const id of selectedServices) fd.append("service_ids[]", id);

    startTransition(async () => {
      const result = await updateCaseStudyAction(caseStudy.id, fd);
      if (!result.success) {
        toast.error(result.error ?? "Echec de la sauvegarde");
        return;
      }
      toast.success("Etude de cas enregistree");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border bg-card p-4">
        <div className="flex items-center gap-3">
          <Switch
            id="publish-toggle"
            checked={status === "published"}
            onCheckedChange={(checked) =>
              setStatus(checked ? "published" : "draft")
            }
          />
          <Label htmlFor="publish-toggle" className="cursor-pointer">
            {status === "published"
              ? "Publiee"
              : status === "archived"
                ? "Archivee"
                : "Brouillon"}
          </Label>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      {/* Block 1 — Informations generales */}
      <Section title="1. Informations generales">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nom du projet *" name="project_name">
            <TextInput
              name="project_name"
              defaultValue={caseStudy.project_name}
            />
          </Field>
          <Field
            label="Slug *"
            name="slug"
            hint="Utilise dans l'URL publique."
          >
            <TextInput name="slug" defaultValue={caseStudy.slug} />
          </Field>
          <Field label="Client" name="client_name">
            <TextInput
              name="client_name"
              defaultValue={caseStudy.client_name}
            />
          </Field>
          <Field label="Secteur" name="sector_id">
            <Select
              value={sectorId}
              onValueChange={(v) => setSectorId(v ?? NONE)}
            >
              <SelectTrigger id="sector_id">
                <SelectValue placeholder="Selectionner..." />
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
          <Field label="Cover image URL" name="cover_image_url">
            <TextInput
              name="cover_image_url"
              defaultValue={caseStudy.cover_image_url}
              placeholder="https://..."
            />
          </Field>
          <Field label="Logo client URL" name="client_logo_url">
            <TextInput
              name="client_logo_url"
              defaultValue={caseStudy.client_logo_url}
              placeholder="https://..."
            />
          </Field>
        </div>
        <Field label="Services associes" name="service_ids">
          <div className="flex flex-wrap gap-2">
            {services.map((s) => {
              const active = selectedServices.has(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleService(s.id)}
                  className={
                    "rounded-full border px-3 py-1 text-xs transition-colors " +
                    (active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-muted")
                  }
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </Field>
      </Section>

      {/* Block 2 — Presentation initiale */}
      <Section
        title="2. Presentation initiale"
        description="Situation du client, probleme, objectif business."
      >
        <Field label="Situation initiale" name="initial_situation">
          <TextareaInput
            name="initial_situation"
            defaultValue={caseStudy.initial_situation}
          />
        </Field>
        <Field
          label="Probleme cle (court, accroche)"
          name="short_problem"
        >
          <TextareaInput
            name="short_problem"
            defaultValue={caseStudy.short_problem}
            rows={2}
          />
        </Field>
        <Field label="Objectif business" name="business_goal">
          <TextareaInput
            name="business_goal"
            defaultValue={caseStudy.business_goal}
          />
        </Field>
      </Section>

      {/* Block 3 — Strategie */}
      <Section
        title="3. Strategie"
        description="Section cle. Angle, positionnement, offre, tunnel, ciblage."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Angle marketing" name="strategy_angle">
            <TextareaInput
              name="strategy_angle"
              defaultValue={caseStudy.strategy_angle}
            />
          </Field>
          <Field label="Positionnement" name="positioning">
            <TextareaInput
              name="positioning"
              defaultValue={caseStudy.positioning}
            />
          </Field>
          <Field label="Offre proposee" name="offer_details">
            <TextareaInput
              name="offer_details"
              defaultValue={caseStudy.offer_details}
            />
          </Field>
          <Field label="Tunnel de conversion" name="funnel_details">
            <TextareaInput
              name="funnel_details"
              defaultValue={caseStudy.funnel_details}
            />
          </Field>
        </div>
        <Field label="Ciblage" name="targeting_details">
          <TextareaInput
            name="targeting_details"
            defaultValue={caseStudy.targeting_details}
          />
        </Field>
      </Section>

      {/* Block 4 — Execution */}
      <Section
        title="4. Execution"
        description="Ce qui a ete realise concretement : pubs, contenus, pages."
      >
        <Field label="Details d'execution" name="execution_details">
          <TextareaInput
            name="execution_details"
            defaultValue={caseStudy.execution_details}
            rows={5}
          />
        </Field>
      </Section>

      {/* Block 5 — Resultats */}
      <Section
        title="5. Resultats"
        description="Chiffres cles mesures. Utilises dans le bloc ROI du site."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Nombre de leads" name="leads_count">
            <NumberInput
              name="leads_count"
              defaultValue={caseStudy.leads_count}
              step="1"
            />
          </Field>
          <Field label="Cout par lead (EUR)" name="cost_per_lead">
            <NumberInput
              name="cost_per_lead"
              defaultValue={caseStudy.cost_per_lead}
            />
          </Field>
          <Field label="Clients generes" name="clients_count">
            <NumberInput
              name="clients_count"
              defaultValue={caseStudy.clients_count}
              step="1"
            />
          </Field>
          <Field label="Budget ads (EUR)" name="ad_budget">
            <NumberInput
              name="ad_budget"
              defaultValue={caseStudy.ad_budget}
            />
          </Field>
          <Field label="CA genere (EUR)" name="revenue_generated">
            <NumberInput
              name="revenue_generated"
              defaultValue={caseStudy.revenue_generated}
            />
          </Field>
          <Field label="ROAS" name="roas">
            <NumberInput name="roas" defaultValue={caseStudy.roas} />
          </Field>
          <Field
            label="ROI (x)"
            name="roi"
            hint="Ex: 8.5 pour x8.5"
          >
            <NumberInput name="roi" defaultValue={caseStudy.roi} />
          </Field>
        </div>
      </Section>

      {/* Block 6 — Avant / Apres */}
      <Section
        title="6. Avant / Apres"
        description="Transformation concrete vue par le client."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Trafic avant" name="traffic_before">
            <TextInput
              name="traffic_before"
              defaultValue={caseStudy.traffic_before}
            />
          </Field>
          <Field label="Trafic apres" name="traffic_after">
            <TextInput
              name="traffic_after"
              defaultValue={caseStudy.traffic_after}
            />
          </Field>
          <Field label="CA avant" name="revenue_before">
            <TextInput
              name="revenue_before"
              defaultValue={caseStudy.revenue_before}
            />
          </Field>
          <Field label="CA apres" name="revenue_after">
            <TextInput
              name="revenue_after"
              defaultValue={caseStudy.revenue_after}
            />
          </Field>
          <Field label="Visibilite avant" name="visibility_before">
            <TextInput
              name="visibility_before"
              defaultValue={caseStudy.visibility_before}
            />
          </Field>
          <Field label="Visibilite apres" name="visibility_after">
            <TextInput
              name="visibility_after"
              defaultValue={caseStudy.visibility_after}
            />
          </Field>
        </div>
      </Section>

      {/* Block 9 — Conclusion */}
      <Section
        title="9. Conclusion"
        description="Impact business final et temoignage client pour le closing."
      >
        <Field label="Conclusion / impact" name="conclusion">
          <TextareaInput
            name="conclusion"
            defaultValue={caseStudy.conclusion}
          />
        </Field>
        <Field label="Temoignage client" name="testimonial">
          <TextareaInput
            name="testimonial"
            defaultValue={caseStudy.testimonial}
          />
        </Field>
      </Section>

      <div className="sticky bottom-4 flex items-center justify-end gap-2 rounded-lg border bg-card/95 p-3 shadow-lg backdrop-blur">
        <span className="text-xs text-muted-foreground">
          Les medias et preuves s&apos;enregistrent automatiquement.
        </span>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
