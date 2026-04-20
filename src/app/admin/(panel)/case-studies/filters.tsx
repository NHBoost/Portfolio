"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";
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
      className="flex flex-wrap items-center gap-2"
      aria-busy={isPending}
    >
      <div className="relative flex-1 min-w-[220px] max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          placeholder="Rechercher un projet..."
          defaultValue={initial.q ?? ""}
          onBlur={(e) => update({ q: e.currentTarget.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              update({ q: e.currentTarget.value });
            }
          }}
          className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm transition-colors placeholder:text-muted-foreground/70 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
      </div>

      <Select
        value={initial.status ?? ALL}
        onValueChange={(v) => update({ status: v })}
      >
        <SelectTrigger className="h-9 w-40 bg-card">
          {initial.status ? (
            <SelectValue />
          ) : (
            <span className="text-muted-foreground">Tous statuts</span>
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Tous statuts</SelectItem>
          <SelectItem value="draft">Brouillon</SelectItem>
          <SelectItem value="published">Publiée</SelectItem>
          <SelectItem value="archived">Archivée</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={initial.sector ?? ALL}
        onValueChange={(v) => update({ sector: v })}
      >
        <SelectTrigger className="h-9 w-48 bg-card">
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
