import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  CaseStudyCard,
  type CaseStudyCardData,
} from "@/components/public/case-study-card";

export function RelatedCases({ items }: { items: CaseStudyCardData[] }) {
  if (items.length === 0) return null;

  return (
    <section
      id="etudes-similaires"
      aria-labelledby="related-title"
      className="bg-surface-muted/60 py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-deep">
              Études similaires
            </p>
            <h2
              id="related-title"
              className="font-display text-[clamp(26px,3.2vw,40px)] font-semibold leading-[1.05] tracking-tight text-foreground"
            >
              D&apos;autres transformations comparables.
            </h2>
          </div>
          <Link
            href="/etudes-de-cas"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-deep transition-colors hover:text-accent"
          >
            Toutes les études
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </header>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((item, i) => (
            <CaseStudyCard
              key={item.slug}
              data={item}
              variant="default"
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
