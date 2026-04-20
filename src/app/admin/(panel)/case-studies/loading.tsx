export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-col gap-6 p-6 md:p-10">
      <div className="h-3 w-24 animate-pulse rounded-md bg-muted" />
      <div className="mt-3 h-10 w-80 animate-pulse rounded-lg bg-muted" />
      <div className="mt-2 h-4 w-96 animate-pulse rounded-md bg-muted/70" />
      <div className="mt-8 h-12 w-full animate-pulse rounded-xl bg-card" />
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-4 p-4"
              aria-hidden
            >
              <div className="col-span-2 h-4 animate-pulse rounded bg-muted" />
              <div className="h-4 animate-pulse rounded bg-muted/70" />
              <div className="h-4 animate-pulse rounded bg-muted/70" />
              <div className="h-4 animate-pulse rounded bg-muted" />
              <div className="h-4 animate-pulse rounded bg-muted/70" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
