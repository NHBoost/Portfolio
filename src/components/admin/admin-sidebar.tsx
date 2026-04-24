"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Briefcase,
  ExternalLink,
  Globe,
  Images,
  LayoutGrid,
  Palette,
  Tag,
  Wrench,
} from "lucide-react";

type Item = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

const primary: Item[] = [
  { href: "/admin", label: "Overview", icon: LayoutGrid, exact: true },
  { href: "/admin/case-studies", label: "Études de cas", icon: Briefcase },
  { href: "/admin/websites", label: "Sites web", icon: Globe },
  { href: "/admin/realisations", label: "Réalisations", icon: Images },
];

const library: Item[] = [
  { href: "/admin/sectors", label: "Secteurs", icon: Tag },
  { href: "/admin/services", label: "Services", icon: Wrench },
];

const settings: Item[] = [
  { href: "/admin/global-stats", label: "Stats globales", icon: BarChart3 },
  { href: "/admin/franchise-branding", label: "Branding", icon: Palette },
];

function NavGroup({
  label,
  items,
  pathname,
}: {
  label: string;
  items: Item[];
  pathname: string;
}) {
  return (
    <div className="space-y-1">
      <p className="px-3 pt-5 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
        {label}
      </p>
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            {active ? (
              <span
                aria-hidden
                className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-brand"
              />
            ) : null}
            <Icon
              className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                active
                  ? "text-brand-deep"
                  : "text-muted-foreground group-hover:text-foreground",
              )}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
      <div className="flex h-16 items-center px-5">
        <Link
          href="/admin"
          className="group flex items-center gap-2.5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground shadow-sm ring-1 ring-black/5">
            <span className="font-display text-[15px] font-black leading-none tracking-tight">
              P
            </span>
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Portfolio ROI
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Admin
            </span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <NavGroup label="Workspace" items={primary} pathname={pathname} />
        <NavGroup label="Bibliothèque" items={library} pathname={pathname} />
        <NavGroup label="Paramètres" items={settings} pathname={pathname} />
      </div>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-md px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground"
        >
          <span>Voir le site public</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </aside>
  );
}
