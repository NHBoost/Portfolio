export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8">
      <div className="h-3 w-32 animate-pulse rounded-md bg-muted" />
      <div className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="flex gap-2">
            <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-16 w-full animate-pulse rounded-xl bg-muted" />
          <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted/70" />
          <div className="h-5 w-full animate-pulse rounded-md bg-muted/70" />
          <div className="h-5 w-5/6 animate-pulse rounded-md bg-muted/70" />
        </div>
        <div className="h-52 w-full animate-pulse rounded-2xl bg-muted" />
      </div>
      <div className="mt-12 aspect-[16/7] w-full animate-pulse rounded-3xl bg-muted" />
    </div>
  );
}
