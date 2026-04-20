"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";
import { updateGlobalStatsAction } from "./actions";

type Stats = Database["public"]["Tables"]["global_stats"]["Row"];

type Computed = {
  total_views: number | null;
  total_leads: number | null;
  total_clients: number | null;
  average_roas: number | null;
  total_revenue: number | null;
};

type FieldKey = keyof Computed;

const fields: {
  key: FieldKey;
  label: string;
  hint?: string;
  type: "integer" | "decimal";
}[] = [
  {
    key: "total_views",
    label: "Total vues générées",
    hint: "Saisie manuelle — pas de source auto.",
    type: "integer",
  },
  {
    key: "total_leads",
    label: "Total leads qualifiés",
    type: "integer",
  },
  {
    key: "total_clients",
    label: "Total clients générés",
    type: "integer",
  },
  {
    key: "average_roas",
    label: "ROAS moyen",
    hint: "Moyenne arithmétique des ROAS étude par étude.",
    type: "decimal",
  },
  {
    key: "total_revenue",
    label: "CA total généré (EUR)",
    type: "decimal",
  },
];

export function GlobalStatsForm({
  stats,
  computed,
}: {
  stats: Stats;
  computed: Computed;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [values, setValues] = useState<Record<FieldKey, string>>({
    total_views: String(stats.total_views ?? 0),
    total_leads: String(stats.total_leads ?? 0),
    total_clients: String(stats.total_clients ?? 0),
    average_roas: String(stats.average_roas ?? 0),
    total_revenue: String(stats.total_revenue ?? 0),
  });

  function setField(key: FieldKey, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function formatComputed(key: FieldKey, v: number): string {
    if (key === "average_roas") return `×${v.toFixed(1)}`;
    return new Intl.NumberFormat("fr-FR").format(v);
  }

  function applyComputed(key: FieldKey) {
    const c = computed[key];
    if (c === null || c === undefined) return;
    const str = key === "average_roas" ? c.toFixed(2) : String(Math.round(c));
    setField(key, str);
    toast.success(`Valeur calculée appliquée`);
  }

  function diff(key: FieldKey): number | null {
    const c = computed[key];
    if (c === null || c === undefined) return null;
    const manual = Number(values[key] || 0);
    return manual - c;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    for (const [k, v] of Object.entries(values)) {
      fd.set(k, v);
    }
    startTransition(async () => {
      const result = await updateGlobalStatsAction(stats.id, fd);
      if (!result.success) {
        toast.error(result.error ?? "Échec");
        return;
      }
      toast.success("Stats mises à jour");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((f) => {
          const currentDiff = diff(f.key);
          const hasComputed =
            computed[f.key] !== null && computed[f.key] !== undefined;
          const match =
            currentDiff !== null && Math.abs(currentDiff) < 0.01;

          return (
            <div
              key={f.key}
              className={cn(
                "space-y-2 rounded-xl border border-border bg-background p-4 transition-colors",
                "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <Label
                  htmlFor={f.key}
                  className="text-[13px] font-medium text-foreground"
                >
                  {f.label}
                </Label>
                {hasComputed ? (
                  <button
                    type="button"
                    onClick={() => applyComputed(f.key)}
                    disabled={match}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors",
                      match
                        ? "border-border bg-muted text-muted-foreground cursor-not-allowed"
                        : "border-brand/30 bg-brand/5 text-brand-deep hover:border-brand/60 hover:bg-brand/10",
                    )}
                    aria-label={`Appliquer la valeur calculée pour ${f.label}`}
                  >
                    <Sparkles className="h-2.5 w-2.5" />
                    {match ? "Aligné" : "Utiliser calculé"}
                  </button>
                ) : null}
              </div>

              <Input
                id={f.key}
                name={f.key}
                type="number"
                min={0}
                step={f.type === "integer" ? 1 : "0.01"}
                value={values[f.key]}
                onChange={(e) => setField(f.key, e.target.value)}
                className="font-display text-lg font-semibold tabular-nums tracking-tight"
              />

              {hasComputed ? (
                <p className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="text-muted-foreground">
                    Valeur calculée :{" "}
                    <span className="font-display font-semibold tabular-nums text-foreground">
                      {formatComputed(f.key, computed[f.key] as number)}
                    </span>
                  </span>
                </p>
              ) : f.hint ? (
                <p className="text-[11px] text-muted-foreground">{f.hint}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur">
        <p className="text-[11px] text-muted-foreground">
          Les valeurs publiées s&apos;appliquent sur la home publique.
        </p>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
