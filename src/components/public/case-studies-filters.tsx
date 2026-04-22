"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";
import { Sparkles, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

type Group = {
  key: string;
  label: string;
  options: Option[];
};

const ROI_OPTIONS: Option[] = [
  { value: "", label: "Tous ROI" },
  { value: "3", label: "× 3+" },
  { value: "5", label: "× 5+" },
  { value: "10", label: "× 10+" },
];

export function CaseStudiesFilters({
  sectors,
  services,
}: {
  sectors: { slug: string; name: string }[];
  services: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const groups: Group[] = useMemo(
    () => [
      {
        key: "sector",
        label: "Secteur",
        options: [
          { value: "", label: "Tous secteurs" },
          ...sectors.map((s) => ({ value: s.slug, label: s.name })),
        ],
      },
      {
        key: "service",
        label: "Service",
        options: [
          { value: "", label: "Tous services" },
          ...services.map((s) => ({ value: s.slug, label: s.name })),
        ],
      },
      { key: "roi", label: "ROI", options: ROI_OPTIONS },
    ],
    [sectors, services],
  );

  function current(key: string) {
    return searchParams.get(key) ?? "";
  }

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `?${qs}` : "?", { scroll: false });
    });
  }

  function resetAll() {
    startTransition(() => {
      router.replace("?", { scroll: false });
    });
  }

  const activeCount = groups.reduce(
    (count, group) => (current(group.key) ? count + 1 : count),
    0,
  );

  return (
    <aside
      aria-label="Filtres des études de cas"
      className="md:sticky md:top-24 md:self-start"
      aria-busy={isPending}
    >
      <details
        open
        className={cn(
          "group/details overflow-hidden rounded-2xl border border-border bg-card shadow-xs",
          "md:[&[open]>summary]:border-b",
        )}
      >
        <summary
          className={cn(
            "flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-foreground transition-colors",
            "md:cursor-default md:border-b md:border-border",
            "hover:bg-surface-muted/40 md:hover:bg-transparent",
            "[&::-webkit-details-marker]:hidden",
          )}
        >
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-brand-deep" />
            Filtres
            {activeCount > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-deep px-1.5 text-[10px] font-bold text-accent-foreground">
                {activeCount}
              </span>
            ) : null}
          </span>
          <span
            aria-hidden
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            {activeCount > 0 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  resetAll();
                }}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
              >
                <X className="h-2.5 w-2.5" />
                Reset
              </button>
            ) : null}
            <span className="rotate-0 transition-transform duration-200 group-open/details:rotate-180 md:hidden">
              ▾
            </span>
          </span>
        </summary>

        <div className="flex flex-col divide-y divide-border">
          {groups.map((group) => {
            const active = current(group.key);
            return (
              <div key={group.key} className="px-5 py-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {group.label}
                  </p>
                  {active ? (
                    <Sparkles
                      aria-hidden
                      className="h-3 w-3 text-brand-deep"
                    />
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.options.map((opt) => {
                    const isActive = active === opt.value;
                    return (
                      <button
                        key={opt.value || `${group.key}-all`}
                        type="button"
                        onClick={() => setFilter(group.key, opt.value)}
                        aria-pressed={isActive}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                          isActive
                            ? "border-accent bg-accent text-accent-foreground shadow-sm"
                            : "border-border bg-background text-muted-foreground hover:border-brand/40 hover:bg-brand/5 hover:text-brand-deep",
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </details>

      <p className="mt-3 hidden px-1 text-[11px] leading-relaxed text-muted-foreground md:block">
        Filtre par impact : combiner un secteur avec un seuil de ROI te
        montre les études les plus performantes pour un type de business.
      </p>
    </aside>
  );
}
