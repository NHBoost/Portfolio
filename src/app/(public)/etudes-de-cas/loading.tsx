import { CaseStudyCardSkeleton } from "@/components/public/case-study-card-skeleton";

export default function Loading() {
  return (
    <>
      <section className="relative pb-10 pt-16 md:pb-12 md:pt-24">
        <div className="relative mx-auto w-full max-w-6xl px-4 md:px-8">
          <div className="h-3 w-40 animate-pulse rounded-md bg-muted" />
          <div className="mt-4 h-14 w-3/4 animate-pulse rounded-xl bg-muted" />
          <div className="mt-6 h-4 w-1/2 animate-pulse rounded-md bg-muted/70" />
        </div>
      </section>
      <section className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-8">
        <div className="mb-8 h-28 animate-pulse rounded-2xl bg-card" />
        <div className="grid gap-5 md:grid-cols-3 md:auto-rows-fr">
          <CaseStudyCardSkeleton variant="feature" />
          <CaseStudyCardSkeleton />
          <CaseStudyCardSkeleton />
          <CaseStudyCardSkeleton />
          <CaseStudyCardSkeleton />
        </div>
      </section>
    </>
  );
}
