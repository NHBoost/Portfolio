import { LoginForm } from "./login-form";

type SearchParams = Promise<{ redirectTo?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { redirectTo } = await searchParams;

  return (
    <div className="relative grid min-h-screen place-items-center bg-surface-muted px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 mesh-grid"
      />
      <div className="relative w-full max-w-sm">
        <div className="mb-10 flex flex-col items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-md ring-1 ring-black/5">
            <span className="font-display text-lg font-black leading-none tracking-tight">
              P
            </span>
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-deep">
              Portfolio ROI · Admin
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
              Bienvenue
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Connecte-toi pour piloter les études de cas et les performances.
            </p>
          </div>
        </div>
        <LoginForm redirectTo={redirectTo} />
        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          Accès réservé à l&apos;équipe éditoriale.
        </p>
      </div>
    </div>
  );
}
