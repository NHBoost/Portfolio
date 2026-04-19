"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Database } from "@/types/database";
import { updateGlobalStatsAction } from "./actions";

type Stats = Database["public"]["Tables"]["global_stats"]["Row"];

export function GlobalStatsForm({ stats }: { stats: Stats }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateGlobalStatsAction(stats.id, fd);
      if (!result.success) {
        toast.error(result.error ?? "Echec");
        return;
      }
      toast.success("Stats mises a jour");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="total_views">Total vues generees</Label>
          <Input
            id="total_views"
            name="total_views"
            type="number"
            min={0}
            step={1}
            defaultValue={String(stats.total_views ?? 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="total_leads">Total leads</Label>
          <Input
            id="total_leads"
            name="total_leads"
            type="number"
            min={0}
            step={1}
            defaultValue={String(stats.total_leads ?? 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="total_clients">Total clients</Label>
          <Input
            id="total_clients"
            name="total_clients"
            type="number"
            min={0}
            step={1}
            defaultValue={String(stats.total_clients ?? 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="average_roas">ROAS moyen</Label>
          <Input
            id="average_roas"
            name="average_roas"
            type="number"
            min={0}
            step="0.01"
            defaultValue={String(stats.average_roas ?? 0)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="total_revenue">CA total genere (EUR)</Label>
          <Input
            id="total_revenue"
            name="total_revenue"
            type="number"
            min={0}
            step="0.01"
            defaultValue={String(stats.total_revenue ?? 0)}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
