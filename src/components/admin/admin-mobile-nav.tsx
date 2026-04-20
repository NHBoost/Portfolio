"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Briefcase,
  ExternalLink,
  LayoutGrid,
  Menu,
  Palette,
  Tag,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

const groups: { label: string; items: Item[] }[] = [
  {
    label: "Workspace",
    items: [
      { href: "/admin", label: "Overview", icon: LayoutGrid, exact: true },
      { href: "/admin/case-studies", label: "Études de cas", icon: Briefcase },
    ],
  },
  {
    label: "Bibliothèque",
    items: [
      { href: "/admin/sectors", label: "Secteurs", icon: Tag },
      { href: "/admin/services", label: "Services", icon: Wrench },
    ],
  },
  {
    label: "Paramètres",
    items: [
      { href: "/admin/global-stats", label: "Stats globales", icon: BarChart3 },
      { href: "/admin/franchise-branding", label: "Branding", icon: Palette },
    ],
  },
];

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Ouvrir la navigation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted md:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease }}
            className="fixed inset-0 z-50 bg-black/40 md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.3, ease }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-72 flex-col border-r border-sidebar-border bg-sidebar"
              aria-label="Navigation admin"
            >
              <div className="flex h-16 items-center justify-between px-5">
                <Link href="/admin" className="flex items-center gap-2.5">
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
                <button
                  type="button"
                  aria-label="Fermer"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-2 pb-4">
                {groups.map((group) => (
                  <div key={group.label} className="space-y-1">
                    <p className="px-3 pt-5 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                      {group.label}
                    </p>
                    {group.items.map((item) => {
                      const active = item.exact
                        ? pathname === item.href
                        : pathname === item.href ||
                          pathname.startsWith(`${item.href}/`);
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
                              "h-4 w-4 shrink-0",
                              active
                                ? "text-brand-deep"
                                : "text-muted-foreground",
                            )}
                          />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
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
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
