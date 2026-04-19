"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL = "__all__";

type Props = {
  sectors: { id: string; name: string }[];
  initial: {
    status?: string;
    sector?: string;
    q?: string;
  };
};

export function CaseStudyFilters({ sectors, initial }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function update(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (!value || value === ALL) params.delete(key);
      else params.set(key, value);
    }
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `?${qs}` : "?");
    });
  }

  return (
    <div
      className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3"
      aria-busy={isPending}
    >
      <Input
        placeholder="Rechercher un projet..."
        defaultValue={initial.q ?? ""}
        onBlur={(e) => update({ q: e.currentTarget.value })}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            update({ q: e.currentTarget.value });
          }
        }}
        className="max-w-sm"
      />

      <Select
        value={initial.status ?? ALL}
        onValueChange={(v) => update({ status: v })}
      >
        <SelectTrigger className="w-40">
          {initial.status ? (
            <SelectValue />
          ) : (
            <span className="text-muted-foreground">Tous statuts</span>
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Tous statuts</SelectItem>
          <SelectItem value="draft">Brouillon</SelectItem>
          <SelectItem value="published">Publiee</SelectItem>
          <SelectItem value="archived">Archivee</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={initial.sector ?? ALL}
        onValueChange={(v) => update({ sector: v })}
      >
        <SelectTrigger className="w-48">
          {initial.sector ? (
            <SelectValue />
          ) : (
            <span className="text-muted-foreground">Tous secteurs</span>
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Tous secteurs</SelectItem>
          {sectors.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
