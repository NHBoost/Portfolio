"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  CaseStudyCard,
  type CaseStudyCardData,
} from "./case-study-card";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

type CarouselProps = {
  items: CaseStudyCardData[];
  autoAdvance?: boolean;
  intervalMs?: number;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  allHref?: string | null;
  surface?: "muted" | "transparent";
};

export function CaseStudiesCarousel({
  items,
  autoAdvance = true,
  intervalMs = 5000,
  title = "Les meilleurs ROI générés pour nos clients.",
  subtitle = "Stratégie, exécution, chiffres mesurés. Fais défiler pour parcourir.",
  eyebrow = "Études de cas",
  allHref = "/etudes-de-cas",
  surface = "muted",
}: CarouselProps) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);

  const onScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    setProgress(Math.max(0, Math.min(1, p)));

    const cards = el.querySelectorAll<HTMLLIElement>("[data-carousel-item]");
    if (cards.length === 0) return;
    const itemWidth = el.scrollWidth / cards.length;
    const centerX = el.scrollLeft + el.clientWidth / 2;
    const index = Math.round(centerX / itemWidth - 0.5);
    setActive(Math.max(0, Math.min(cards.length - 1, index)));
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onScroll]);

  const scrollToIndex = useCallback((i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLLIElement>("[data-carousel-item]");
    const target = cards[i];
    if (!target) return;
    const offsetLeft =
      target.offsetLeft - (el.clientWidth - target.clientWidth) / 2;
    el.scrollTo({ left: offsetLeft, behavior: "smooth" });
  }, []);

  // Auto-advance
  useEffect(() => {
    if (!autoAdvance || items.length <= 1) return;
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
      const cards = el.querySelectorAll<HTMLLIElement>(
        "[data-carousel-item]",
      );
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
  }, [autoAdvance, items.length, intervalMs]);

  if (items.length === 0) return null;

  const fadeColor =
    surface === "muted" ? "from-surface-muted" : "from-background";

  return (
    <section
      id="etudes"
      aria-labelledby="etudes-section-title"
      className={cn(
        "relative py-10",
        surface === "muted" ? "bg-surface-muted/60" : "bg-background",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 md:px-8">
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ duration: 0.55, ease }}
          className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl space-y-3">
            {eyebrow ? (
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-deep">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_0_3px_rgba(86,148,189,0.18)]"
                />
                {eyebrow}
              </p>
            ) : null}
            <h2
              id="etudes-section-title"
              className="font-display text-[clamp(30px,4vw,48px)] font-semibold leading-[1.04] tracking-tight text-foreground text-balance"
            >
              {title}
            </h2>
            {subtitle ? (
              <p className="text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {allHref ? (
            <Link
              href={allHref}
              className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-deep transition-colors hover:text-accent"
            >
              Voir toutes les études
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ) : null}
        </motion.header>

        <div
          className="relative"
          aria-roledescription="carousel"
          aria-label="Études de cas"
        >
          {/* Gradient edges */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r via-transparent to-transparent md:w-20",
              fadeColor,
            )}
          />
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l via-transparent to-transparent md:w-20",
              fadeColor,
            )}
          />

          <ul
            ref={scrollerRef}
            aria-label="Études de cas — carrousel"
            className={cn(
              "flex items-stretch snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-6 pt-2",
              "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            )}
            style={{ scrollPaddingInline: "10%" }}
          >
            {items.map((item, i) => (
              <li
                key={item.slug}
                data-carousel-item
                className="flex w-[min(85vw,400px)] shrink-0 snap-center"
                aria-roledescription="slide"
                aria-label={`${i + 1} sur ${items.length}`}
              >
                <div className="flex w-full">
                  <CaseStudyCard data={item} variant="default" index={i} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {items.length > 1 ? (
          <div className="flex items-center justify-between gap-6">
            <div
              className="relative h-1 w-full max-w-md overflow-hidden rounded-full bg-border/80"
              role="presentation"
              aria-hidden
            >
              <motion.span
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-deep via-brand to-brand/80"
                style={{ width: `${Math.max(10, progress * 100)}%` }}
                transition={{ duration: 0.3, ease }}
              />
            </div>
            <div className="flex items-center gap-1.5">
              {items.map((c, i) => (
                <button
                  key={c.slug}
                  type="button"
                  aria-label={`Aller à l'étude ${i + 1}`}
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
          </div>
        ) : null}
      </div>
    </section>
  );
}
