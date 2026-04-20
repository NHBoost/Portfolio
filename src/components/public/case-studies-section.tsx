import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  CaseStudyCard,
  type CaseStudyCardData,
} from "./case-study-card";

export function CaseStudiesSection({
  items,
}: {
  items: CaseStudyCardData[];
}) {
  if (items.length === 0) {
    return (
      <section
        id="etudes"
        aria-labelledby="etudes-section-title"
        className="relative bg-surface-muted/60 py-10"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-4 md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-deep">
            Études de cas
          </p>
          <h2
            id="etudes-section-title"
            className="max-w-3xl font-display text-[clamp(30px,4vw,48px)] font-semibold leading-[1.04] tracking-tight text-foreground text-balance"
          >
            Les études publiées apparaîtront ici.
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Cette section est alimentée depuis l&apos;administration. Chaque
            étude publiée passe en tête si son ROI dépasse les autres.
          </p>
        </div>
      </section>
    );
  }

  const [feature, ...rest] = items;

  return (
    <section
      id="etudes"
      aria-labelledby="etudes-section-title"
      className="relative bg-surface-muted/60 py-10"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 md:px-8">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-deep">
              Études de cas
            </p>
            <h2
              id="etudes-section-title"
              className="font-display text-[clamp(30px,4vw,48px)] font-semibold leading-[1.04] tracking-tight text-foreground text-balance"
            >
              Les meilleurs ROI générés pour nos clients.
            </h2>
            <p className="text-muted-foreground">
              Stratégie, exécution, chiffres mesurés. Classées par impact.
            </p>
          </div>
          <Link
            href="/etudes-de-cas"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-deep transition-colors hover:text-accent"
          >
            Voir toutes les études
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </header>

        <div className="grid gap-5 md:grid-cols-3 md:auto-rows-fr">
          <CaseStudyCard data={feature} variant="feature" index={0} />
          {rest.map((c, i) => (
            <CaseStudyCard
              key={c.slug}
              data={c}
              variant="default"
              index={i + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
