import { cn } from "@/lib/utils";

export function CaseStudyCardSkeleton({
  variant = "default",
}: {
  variant?: "feature" | "default";
}) {
  const isFeature = variant === "feature";
  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-border bg-card",
        isFeature ? "md:col-span-2 md:row-span-2" : "",
      )}
      aria-hidden
    >
      <div
        className={cn(
          "animate-pulse bg-muted",
          isFeature ? "aspect-[16/9]" : "aspect-[3/2]",
        )}
      />
      <div className="flex flex-col gap-5 p-6">
        <div className="space-y-2">
          <div className="h-6 w-2/3 animate-pulse rounded-md bg-muted" />
          <div className="h-3 w-1/4 animate-pulse rounded-md bg-muted/70" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-full animate-pulse rounded-md bg-muted/70" />
          <div className="h-3 w-5/6 animate-pulse rounded-md bg-muted/70" />
        </div>
        <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
          <div className="h-8 animate-pulse rounded-md bg-muted" />
          <div className="h-8 animate-pulse rounded-md bg-muted" />
          <div className="h-8 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    </div>
  );
}
