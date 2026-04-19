import { LoginForm } from "./login-form";

type SearchParams = Promise<{ redirectTo?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { redirectTo } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-accent">
            Portfolio ROI
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Espace d&apos;administration
          </p>
        </div>
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
