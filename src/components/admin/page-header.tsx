import Link from "next/link";
import { cn } from "@/lib/utils";

type Crumb = { href: string; label: string };

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl space-y-2">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav
            aria-label="Fil d'ariane"
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
          >
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1.5">
                <Link
                  href={crumb.href}
                  className="uppercase tracking-[0.14em] transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
                {i < breadcrumbs.length - 1 ? (
                  <span className="text-muted-foreground/50">/</span>
                ) : null}
              </span>
            ))}
          </nav>
        ) : eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-deep">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-[32px]">
          {title}
        </h1>
        {description ? (
          <p className="text-pretty text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
