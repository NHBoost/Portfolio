"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
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

  const groups: Group[] = [
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
  ];

  return (
    <div
      className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5"
      aria-busy={isPending}
    >
      {groups.map((group) => {
        const active = current(group.key);
        return (
          <div
            key={group.key}
            className="flex flex-wrap items-center gap-2 md:flex-nowrap"
          >
            <p className="w-20 shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {group.options.map((opt) => {
                const isActive = active === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFilter(group.key, opt.value)}
                    aria-pressed={isActive}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs transition-colors",
                      isActive
                        ? "border-accent bg-accent text-accent-foreground"
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
  );
}
