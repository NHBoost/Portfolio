"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Briefcase,
  LayoutGrid,
  Palette,
  Settings2,
  Tag,
  Wrench,
} from "lucide-react";

type Item = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

const items: Item[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid, exact: true },
  { href: "/admin/case-studies", label: "Etudes de cas", icon: Briefcase },
  { href: "/admin/sectors", label: "Secteurs", icon: Tag },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/global-stats", label: "Stats globales", icon: BarChart3 },
  {
    href: "/admin/franchise-branding",
    label: "Branding",
    icon: Palette,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r bg-card md:flex md:flex-col">
      <div className="flex h-14 items-center border-b px-5">
        <Link
          href="/admin"
          className="text-sm font-semibold tracking-tight text-accent"
        >
          Portfolio ROI
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
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
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Voir le site public
        </Link>
      </div>
    </aside>
  );
}
