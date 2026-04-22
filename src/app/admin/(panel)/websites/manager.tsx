"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ExternalLink,
  Globe,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  createWebsiteAction,
  deleteWebsiteAction,
  reorderWebsiteAction,
  updateWebsiteAction,
} from "./actions";

export type WebsiteRow = {
  id: string;
  url: string;
  title: string;
  activity: string | null;
  sort_order: number;
  case_study_id: string | null;
};

type CaseOption = { id: string; project_name: string };

const NONE = "__none__";

function displayHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function WebsitesManager({
  items,
  caseOptions,
}: {
  items: WebsiteRow[];
  caseOptions: CaseOption[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(items.length === 0);
  const [isPending, startTransition] = useTransition();

  function run(
    fn: () => Promise<{ success: boolean; error?: string }>,
    onSuccess?: () => void,
  ) {
    startTransition(async () => {
      const result = await fn();
      if (!result.success) {
        toast.error(result.error ?? "Action impossible");
        return;
      }
      onSuccess?.();
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {!showForm && !editingId ? (
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            onClick={() => setShowForm(true)}
            disabled={isPending}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Ajouter un site
          </Button>
        </div>
      ) : null}

      {showForm ? (
        <WebsiteForm
          caseOptions={caseOptions}
          onCancel={() => setShowForm(false)}
          onSubmit={(fd) =>
            run(
              () => createWebsiteAction(fd),
              () => {
                toast.success("Site ajouté");
                setShowForm(false);
              },
            )
          }
          submitLabel="Ajouter"
          isPending={isPending}
        />
      ) : null}

      {items.length === 0 && !showForm ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
          <Globe
            aria-hidden
            className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50"
          />
          <p className="font-display text-base font-semibold text-foreground">
            Aucun site ajouté
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Le premier site apparaîtra dans le carrousel mockup de la home.
          </p>
        </div>
      ) : null}

      <ul className="space-y-3">
        {items.map((w, i) => {
          const isEditing = editingId === w.id;
          return (
            <li
              key={w.id}
              className={cn(
                "rounded-xl border border-border bg-card transition-shadow",
                isEditing ? "shadow-sm" : "hover:shadow-xs",
              )}
            >
              {isEditing ? (
                <div className="p-5">
                  <WebsiteForm
                    initial={w}
                    caseOptions={caseOptions}
                    onCancel={() => setEditingId(null)}
                    onSubmit={(fd) =>
                      run(
                        () => updateWebsiteAction(w.id, fd),
                        () => {
                          toast.success("Site mis à jour");
                          setEditingId(null);
                        },
                      )
                    }
                    submitLabel="Enregistrer"
                    isPending={isPending}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:gap-4">
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand-deep">
                      <Globe className="h-4 w-4" />
                    </span>
                    <span className="flex flex-col leading-none text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      <span>#{String(i + 1).padStart(2, "0")}</span>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {w.title}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <a
                        href={w.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:text-foreground"
                      >
                        {displayHost(w.url)}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      {w.activity ? (
                        <>
                          <span className="text-muted-foreground/40">·</span>
                          <span>{w.activity}</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Monter"
                      disabled={i === 0 || isPending}
                      onClick={() =>
                        run(() => reorderWebsiteAction(w.id, "up"))
                      }
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Descendre"
                      disabled={i === items.length - 1 || isPending}
                      onClick={() =>
                        run(() => reorderWebsiteAction(w.id, "down"))
                      }
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Modifier"
                      onClick={() => setEditingId(w.id)}
                      disabled={isPending}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Supprimer"
                      disabled={isPending}
                      onClick={() => {
                        if (
                          !confirm(`Supprimer le site « ${w.title} » ?`)
                        )
                          return;
                        run(() => deleteWebsiteAction(w.id), () =>
                          toast.success("Site supprimé"),
                        );
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function WebsiteForm({
  initial,
  caseOptions,
  onSubmit,
  onCancel,
  submitLabel,
  isPending,
}: {
  initial?: WebsiteRow;
  caseOptions: CaseOption[];
  onSubmit: (fd: FormData) => void;
  onCancel: () => void;
  submitLabel: string;
  isPending: boolean;
}) {
  const [caseStudyId, setCaseStudyId] = useState<string>(
    initial?.case_study_id ?? NONE,
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("case_study_id", caseStudyId === NONE ? "" : caseStudyId);
    onSubmit(fd);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "space-y-4 rounded-2xl",
        initial ? "" : "border border-border bg-card p-5 md:p-6",
      )}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title" className="text-xs font-medium">
            Titre de l&apos;entreprise *
          </Label>
          <Input
            id="title"
            name="title"
            defaultValue={initial?.title ?? ""}
            required
            placeholder="Ex: Restaurant Le Colibri"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="activity" className="text-xs font-medium">
            Activité
          </Label>
          <Input
            id="activity"
            name="activity"
            defaultValue={initial?.activity ?? ""}
            placeholder="Ex: Restauration"
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="url" className="text-xs font-medium">
            URL du site *
          </Label>
          <Input
            id="url"
            name="url"
            type="url"
            defaultValue={initial?.url ?? ""}
            required
            placeholder="https://lecolibri.fr"
            className="font-mono text-sm"
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="case_study_id" className="text-xs font-medium">
            Étude de cas associée (optionnel)
          </Label>
          <Select
            value={caseStudyId}
            onValueChange={(v) => setCaseStudyId(v ?? NONE)}
          >
            <SelectTrigger id="case_study_id">
              {caseStudyId !== NONE ? (
                <SelectValue />
              ) : (
                <span className="text-muted-foreground">— Aucune —</span>
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>— Aucune —</SelectItem>
              {caseOptions.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.project_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[11px] text-muted-foreground/80">
            Si lié, un petit bouton « Étude » apparaîtra sous le mockup.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isPending}
        >
          <X className="mr-1 h-3.5 w-3.5" />
          Annuler
        </Button>
        <Button type="submit" size="sm" disabled={isPending}>
          <Check className="mr-1 h-3.5 w-3.5" />
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
