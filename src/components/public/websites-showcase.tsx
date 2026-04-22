"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export type ShowcaseSite = {
  url: string;
  title: string;
  sector?: string | null;
  caseSlug?: string | null;
};

function displayHost(url: string) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function PhoneMockup({ site, index }: { site: ShowcaseSite; index: number }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fallback if iframe never fires load within 8s (likely blocked by X-Frame-Options)
  useEffect(() => {
    const t = setTimeout(() => {
      if (!loaded) setFailed(true);
    }, 8000);
    return () => clearTimeout(t);
  }, [loaded]);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px 0px" }}
      transition={{ duration: 0.55, ease, delay: index * 0.06 }}
      className="group flex w-[min(85vw,280px)] shrink-0 snap-center flex-col items-center gap-5"
      aria-label={`Aperçu du site ${site.title}`}
    >
      {/* Phone body */}
      <div
        className={cn(
          "relative aspect-[9/17] w-full rounded-[34px] bg-[#0b1020] p-[10px]",
          "shadow-[0_30px_60px_-20px_rgba(11,16,32,0.45),0_12px_24px_-12px_rgba(11,16,32,0.3)]",
          "ring-1 ring-white/5",
        )}
      >
        {/* Dynamic island / notch */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[14px] z-20 flex h-[22px] w-[90px] -translate-x-1/2 items-center justify-center rounded-full bg-black"
        >
          <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-[#1f2541]" />
        </div>

        {/* Side buttons */}
        <span
          aria-hidden
          className="absolute -right-[2px] top-[88px] h-14 w-[3px] rounded-l-full bg-[#1f2541]"
        />
        <span
          aria-hidden
          className="absolute -left-[2px] top-[72px] h-8 w-[3px] rounded-r-full bg-[#1f2541]"
        />
        <span
          aria-hidden
          className="absolute -left-[2px] top-[116px] h-12 w-[3px] rounded-r-full bg-[#1f2541]"
        />
        <span
          aria-hidden
          className="absolute -left-[2px] top-[164px] h-12 w-[3px] rounded-r-full bg-[#1f2541]"
        />

        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[26px] bg-white">
          {/* Status bar overlay */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 pt-[6px] text-[9px] font-semibold tracking-tight text-black mix-blend-difference">
            <span className="text-white/90">
              {new Date().toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="flex items-center gap-1 text-white/90">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
                <rect x="0" y="4" width="2" height="4" rx="0.5" />
                <rect x="3" y="2" width="2" height="6" rx="0.5" />
                <rect x="6" y="0" width="2" height="8" rx="0.5" />
                <rect
                  x="9"
                  y="0"
                  width="2"
                  height="8"
                  rx="0.5"
                  opacity="0.5"
                />
              </svg>
              <svg
                width="12"
                height="8"
                viewBox="0 0 18 12"
                fill="currentColor"
              >
                <path d="M9 2C6.5 2 4.2 3 2.5 4.7l1.4 1.4A8 8 0 0 1 9 4c2 0 3.9.8 5.3 2.1l1.4-1.4A11 11 0 0 0 9 2zM9 6a4 4 0 0 0-2.8 1.2L9 10l2.8-2.8A4 4 0 0 0 9 6z" />
              </svg>
              <span className="ml-0.5 flex h-[8px] w-[14px] items-center justify-end rounded-[2px] border border-white/80 px-[1px]">
                <span className="h-full w-[10px] rounded-[0.5px] bg-white/90" />
              </span>
            </span>
          </div>

          {/* URL bar (fake browser chrome) */}
          <div className="pointer-events-none absolute inset-x-0 top-[22px] z-10 mx-3 flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1.5 text-[9px] font-medium text-black/70 backdrop-blur">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            <span className="truncate">{displayHost(site.url)}</span>
          </div>

          {/* Loading placeholder */}
          {!loaded && !failed ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="flex flex-col items-center gap-2 text-center">
                <span
                  aria-hidden
                  className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-brand-deep"
                />
                <span className="text-[9px] text-muted-foreground">
                  Chargement…
                </span>
              </div>
            </div>
          ) : null}

          {/* Fallback screen if iframe blocked */}
          {failed ? (
            <div
              aria-hidden
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center"
              style={{
                background:
                  "radial-gradient(ellipse at 20% 20%, oklch(0.65 0.08 235 / 0.3), transparent 60%), linear-gradient(135deg, oklch(0.29 0.09 270), oklch(0.48 0.09 245))",
              }}
            >
              <ExternalLink className="h-6 w-6 text-white/90" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
                Site live
              </span>
              <span className="text-sm font-semibold text-white">
                {site.title}
              </span>
              <span className="text-[10px] text-white/70">
                {displayHost(site.url)}
              </span>
            </div>
          ) : (
            <div
              className={cn(
                "absolute inset-0 overflow-hidden transition-opacity duration-500",
                loaded ? "opacity-100" : "opacity-0",
              )}
            >
              <div
                className={cn(
                  "relative h-full w-full transform-gpu will-change-transform",
                  "transition-transform duration-[9000ms] ease-linear",
                  // On hover, translate iframe up to reveal bottom of site
                  "group-hover:-translate-y-[60%]",
                )}
              >
                <iframe
                  ref={iframeRef}
                  src={site.url}
                  title={`Site ${site.title}`}
                  loading="lazy"
                  onLoad={() => setLoaded(true)}
                  onError={() => setFailed(true)}
                  referrerPolicy="no-referrer"
                  sandbox="allow-scripts allow-same-origin"
                  className="pointer-events-none block border-0"
                  style={{
                    // Rendu en viewport mobile 400px puis scale pour remplir
                    // la largeur utile de l'écran du mockup (~260px)
                    width: "400px",
                    height: "2400px",
                    transform: "scale(0.65)",
                    transformOrigin: "top left",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Caption */}
      <figcaption className="w-full text-center">
        <p className="font-display text-sm font-semibold tracking-tight text-foreground">
          {site.title}
        </p>
        {site.sector ? (
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {site.sector}
          </p>
        ) : null}
        <div className="mt-3 flex items-center justify-center gap-3 text-[11px]">
          <a
            href={site.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {displayHost(site.url)}
            <ExternalLink className="h-3 w-3" />
          </a>
          {site.caseSlug ? (
            <>
              <span className="h-3 w-px bg-border" aria-hidden />
              <Link
                href={`/etudes-de-cas/${site.caseSlug}`}
                className="inline-flex items-center gap-1 font-semibold text-brand-deep transition-colors hover:text-accent"
              >
                Étude
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </>
          ) : null}
        </div>
      </figcaption>
    </motion.figure>
  );
}

export function WebsitesShowcase({
  sites,
  autoAdvance = true,
  intervalMs = 5000,
}: {
  sites: ShowcaseSite[];
  autoAdvance?: boolean;
  intervalMs?: number;
}) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const pausedRef = useRef(false);
  const [active, setActive] = useState(0);

  const scrollToIndex = useCallback((i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLLIElement>("[data-showcase-item]");
    const target = cards[i];
    if (!target) return;
    const offsetLeft =
      target.offsetLeft - (el.clientWidth - target.clientWidth) / 2;
    el.scrollTo({ left: offsetLeft, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const cards = el.querySelectorAll<HTMLLIElement>("[data-showcase-item]");
      if (cards.length === 0) return;
      const itemWidth = el.scrollWidth / cards.length;
      const centerX = el.scrollLeft + el.clientWidth / 2;
      const index = Math.round(centerX / itemWidth - 0.5);
      setActive(Math.max(0, Math.min(cards.length - 1, index)));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!autoAdvance || sites.length <= 1) return;
    const el = scrollerRef.current;
    if (!el) return;

    const pause = () => {
      pausedRef.current = true;
    };
    const resume = () => {
      pausedRef.current = false;
    };

    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);

    const id = setInterval(() => {
      if (pausedRef.current) return;
      const cards = el.querySelectorAll<HTMLLIElement>("[data-showcase-item]");
      if (cards.length === 0) return;
      const itemWidth = el.scrollWidth / cards.length;
      const centerX = el.scrollLeft + el.clientWidth / 2;
      const current = Math.round(centerX / itemWidth - 0.5);
      const next = (current + 1) % cards.length;
      const target = cards[next];
      if (!target) return;
      const offsetLeft =
        target.offsetLeft - (el.clientWidth - target.clientWidth) / 2;
      el.scrollTo({ left: offsetLeft, behavior: "smooth" });
    }, intervalMs);

    return () => {
      clearInterval(id);
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
    };
  }, [autoAdvance, sites.length, intervalMs]);

  if (sites.length === 0) return null;

  return (
    <section
      id="sites"
      aria-labelledby="sites-showcase-title"
      className="relative overflow-hidden bg-background py-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[260px] opacity-30 mesh-grid [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.9),transparent_90%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 md:px-8">
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ duration: 0.55, ease }}
          className="flex flex-col gap-3"
        >
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-deep">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_0_3px_rgba(86,148,189,0.18)]"
            />
            Réalisations web
          </p>
          <h2
            id="sites-showcase-title"
            className="font-display text-[clamp(28px,3.4vw,44px)] font-semibold leading-[1.05] tracking-tight text-foreground text-balance"
          >
            Les sites que l&apos;on a livrés,{" "}
            <span className="text-muted-foreground/70">en conditions réelles.</span>
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Survolez un mockup pour voir la page défiler — chaque écran charge
            directement le site live du client.
          </p>
        </motion.header>

        <div className="relative mt-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background via-transparent to-transparent md:w-20"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background via-transparent to-transparent md:w-20"
          />

          <ul
            ref={scrollerRef}
            aria-label="Mockups des sites livrés"
            className={cn(
              "flex snap-x snap-mandatory items-start gap-6 overflow-x-auto scroll-smooth pb-6 pt-2 md:gap-10",
              "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            )}
            style={{ scrollPaddingInline: "10%" }}
          >
            {sites.map((site, i) => (
              <li
                key={`${site.url}-${i}`}
                data-showcase-item
                className="flex shrink-0 snap-center"
              >
                <PhoneMockup site={site} index={i} />
              </li>
            ))}
          </ul>
        </div>

        {sites.length > 1 ? (
          <div className="mt-6 flex items-center justify-center gap-1.5">
            {sites.map((s, i) => (
              <button
                key={`${s.url}-dot-${i}`}
                type="button"
                aria-label={`Voir le site ${s.title}`}
                aria-current={i === active}
                onClick={() => scrollToIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  i === active
                    ? "w-6 bg-brand-deep"
                    : "w-1.5 bg-border hover:bg-muted-foreground/40",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
