"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { FranchiseSettings } from "@/lib/public-data";

type NavLink = {
  href: string;
  label: string;
  exact?: boolean;
};

const links: NavLink[] = [
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
  const [hovered, setHovered] = useState<string | null>(null);

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
          "sticky top-0 z-40 transition-all duration-300",
          scrolled || mobileOpen
            ? "border-b border-border/80 bg-background/80 shadow-[0_1px_0_rgba(0,0,0,0.02)] backdrop-blur-xl"
            : "border-b border-transparent bg-background/0",
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
          {/* LOGO */}
          <Link
            href="/"
            aria-label={`${brandName} — accueil`}
            className="group inline-flex items-center gap-2.5 transition-opacity"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent text-accent-foreground ring-1 ring-inset ring-white/10 shadow-[0_2px_6px_-1px_rgba(20,25,50,0.35)] transition-transform duration-300 group-hover:scale-[1.03]">
              <span className="font-display text-[15px] font-black leading-none tracking-tight">
                {brandName.charAt(0).toUpperCase()}
              </span>
              <span
                aria-hidden
                className="absolute -inset-0.5 rounded-[12px] bg-[radial-gradient(circle_at_top,rgba(86,148,189,0.25),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[13px] font-semibold tracking-[-0.005em] text-foreground">
                {brandName}
              </span>
              <span className="mt-1 text-[9.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Performance mesurée
              </span>
            </span>
          </Link>

          {/* DESKTOP NAV — pill container with animated hover */}
          <nav
            aria-label="Navigation principale"
            onMouseLeave={() => setHovered(null)}
            className="hidden items-center rounded-full border border-border/80 bg-card/70 p-1 shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_1px_2px_rgba(20,25,50,0.04)] backdrop-blur-sm md:flex"
          >
            {links.map((l) => {
              const isActive = l.exact
                ? pathname === l.href
                : pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onMouseEnter={() => setHovered(l.href)}
                  onFocus={() => setHovered(l.href)}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-[12.5px] font-medium tracking-tight transition-colors duration-200",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {hovered === l.href ? (
                    <motion.span
                      layoutId="nav-hover"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-muted/80"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 34,
                        mass: 0.65,
                      }}
                    />
                  ) : null}
                  <span className="relative flex items-center gap-1.5">
                    {isActive ? (
                      <span
                        aria-hidden
                        className="h-1 w-1 rounded-full bg-brand shadow-[0_0_0_2px_rgba(86,148,189,0.15)]"
                      />
                    ) : null}
                    {l.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* CTA + MOBILE */}
          <div className="flex items-center gap-2">
            {cta ? (
              <Link
                href={cta}
                target={cta.startsWith("http") ? "_blank" : undefined}
                rel={cta.startsWith("http") ? "noreferrer" : undefined}
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "group hidden h-9 gap-1.5 rounded-full px-4 text-[12.5px] font-semibold shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_4px_12px_-2px_rgba(62,100,147,0.35)] transition-shadow hover:shadow-[0_1px_0_rgba(255,255,255,0.1)_inset,0_6px_18px_-2px_rgba(62,100,147,0.45)] md:inline-flex",
                )}
              >
                {ctaLabel}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ) : null}
            <button
              type="button"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all duration-200 hover:border-brand/40 hover:bg-muted active:scale-95 md:hidden"
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
                    "mt-8 w-full rounded-full",
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
