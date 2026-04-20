"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { FranchiseSettings } from "@/lib/public-data";

const links = [
  { href: "/", label: "Accueil", exact: true },
  { href: "/#etudes", label: "Études de cas" },
  { href: "/#resultats", label: "Résultats" },
  { href: "/#realisations", label: "Réalisations" },
  { href: "/#services", label: "Services" },
];

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export function Navbar({ settings }: { settings: FranchiseSettings | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const brandName = settings?.franchise_name ?? "Portfolio ROI";
  const cta =
    settings?.whatsapp_url ??
    (settings?.email ? `mailto:${settings.email}` : null);
  const ctaLabel = settings?.cta_text ?? "Prendre rendez-vous";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b border-transparent transition-all duration-200",
          scrolled || mobileOpen
            ? "border-border bg-background/85 backdrop-blur-md"
            : "bg-background/0",
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground shadow-sm ring-1 ring-black/5">
              <span className="font-display text-[15px] font-black leading-none tracking-tight">
                {brandName.charAt(0).toUpperCase()}
              </span>
            </span>
            <span className="font-display text-sm font-semibold tracking-tight text-foreground">
              {brandName}
            </span>
          </Link>

          <nav
            aria-label="Navigation principale"
            className="hidden flex-1 items-center justify-center gap-7 md:flex"
          >
            {links.map((l) => {
              const isActive = l.exact
                ? pathname === l.href
                : pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground",
                    isActive && "text-foreground",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            {cta ? (
              <Link
                href={cta}
                target={cta.startsWith("http") ? "_blank" : undefined}
                rel={cta.startsWith("http") ? "noreferrer" : undefined}
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "hidden md:inline-flex",
                )}
              >
                {ctaLabel}
                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            ) : null}
            <button
              type="button"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted md:hidden"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease }}
            className="fixed inset-x-0 top-16 bottom-0 z-30 bg-background md:hidden"
          >
            <motion.nav
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.3, ease }}
              aria-label="Menu mobile"
              className="flex flex-col gap-1 p-6"
            >
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center justify-between border-b border-border py-4 font-display text-2xl font-semibold tracking-tight text-foreground transition-colors hover:text-brand-deep"
                >
                  {l.label}
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
              {cta ? (
                <Link
                  href={cta}
                  target={cta.startsWith("http") ? "_blank" : undefined}
                  rel={cta.startsWith("http") ? "noreferrer" : undefined}
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "mt-8 w-full",
                  )}
                >
                  {ctaLabel}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              ) : null}
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
