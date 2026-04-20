"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { FranchiseSettings } from "@/lib/public-data";
import { ArrowUpRight } from "lucide-react";

const links = [
  { href: "/#etudes", label: "Études de cas" },
  { href: "/#resultats", label: "Résultats" },
  { href: "/#services", label: "Services" },
];

export function Navbar({ settings }: { settings: FranchiseSettings | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const brandName = settings?.franchise_name ?? "Portfolio ROI";
  const cta =
    settings?.whatsapp_url ??
    (settings?.email ? `mailto:${settings.email}` : null);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-transparent transition-all duration-200",
        scrolled
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
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === l.href && "text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {cta ? (
            <Link
              href={cta}
              target={cta.startsWith("http") ? "_blank" : undefined}
              rel={cta.startsWith("http") ? "noreferrer" : undefined}
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              {settings?.cta_text ?? "Prendre rendez-vous"}
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          ) : (
            <span
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "pointer-events-none opacity-50",
              })}
            >
              Contact bientôt
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
