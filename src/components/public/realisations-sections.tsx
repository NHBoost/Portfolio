"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ExternalLink,
  Headphones,
  Share2,
  Megaphone,
  Play,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RealisationPublic } from "@/lib/public-data";

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

type SectionConfig = {
  eyebrow: string;
  title: string;
  subtitle: string;
  surface: "muted" | "transparent";
  icon: React.ComponentType<{ className?: string }>;
  aspect: string;
  cardWidth: string;
};

const TYPE_CONFIG: Record<RealisationPublic["type"], SectionConfig> = {
  ads: {
    eyebrow: "Captures Ads",
    title: "Les creatives qui convertissent.",
    subtitle:
      "Échantillon d'ads qui performent chez nos clients — chiffres à l'appui.",
    surface: "transparent",
    icon: Megaphone,
    aspect: "aspect-[9/16]",
    cardWidth: "w-[min(80vw,240px)]",
  },
  video: {
    eyebrow: "Vidéos clients",
    title: "Les vidéos qui racontent le ROI.",
    subtitle:
      "Témoignages, UGC, mises en scène produit — tout ce qui a tourné pour nos clients.",
    surface: "muted",
    icon: Video,
    aspect: "aspect-[9/16]",
    cardWidth: "w-[min(75vw,220px)]",
  },
  social: {
    eyebrow: "Réseaux sociaux",
    title: "Du contenu qui fait du bruit.",
    subtitle:
      "Posts, reels, carousels Share2 / TikTok / LinkedIn gérés pour la marque.",
    surface: "transparent",
    icon: Share2,
    aspect: "aspect-[4/5]",
    cardWidth: "w-[min(75vw,260px)]",
  },
  podcast: {
    eyebrow: "Podcasts",
    title: "Quand nos clients passent au micro.",
    subtitle:
      "Épisodes sponsorisés ou produits chez nos clients — le parcours devient audio.",
    surface: "muted",
    icon: Headphones,
    aspect: "aspect-square",
    cardWidth: "w-[min(82vw,320px)]",
  },
};

function hostname(url: string | null) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function isVideoUrl(url: string | null) {
  if (!url) return false;
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(url);
}

function RealisationMedia({
  item,
  aspect,
}: {
  item: RealisationPublic;
  aspect: string;
}) {
  const preview = item.thumbnail_url ?? item.media_url;
  const isVideo =
    item.type === "video" && item.media_url && isVideoUrl(item.media_url);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-border bg-muted",
        aspect,
      )}
    >
      {isVideo ? (
        <video
          src={item.media_url as string}
          poster={item.thumbnail_url ?? undefined}
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLVideoElement).play().catch(() => {});
          }}
          onMouseLeave={(e) => {
            const v = e.currentTarget as HTMLVideoElement;
            v.pause();
            v.currentTime = 0;
          }}
        />
      ) : preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt={item.title ?? ""}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            background:
              "radial-gradient(ellipse at top left, oklch(0.65 0.08 235 / 0.28), transparent 60%), linear-gradient(135deg, oklch(0.29 0.09 270), oklch(0.48 0.09 245))",
          }}
        >
          {item.type === "video" ? (
            <Video className="h-8 w-8 text-white/80" aria-hidden />
          ) : item.type === "podcast" ? (
            <Headphones className="h-8 w-8 text-white/80" aria-hidden />
          ) : item.type === "social" ? (
            <Share2 className="h-8 w-8 text-white/80" aria-hidden />
          ) : (
            <Megaphone className="h-8 w-8 text-white/80" aria-hidden />
          )}
        </div>
      )}

      {(item.type === "video" || item.type === "podcast") && !isVideo ? (
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-accent shadow-lg ring-1 ring-black/5 backdrop-blur transition-transform duration-300 group-hover:scale-110">
            {item.type === "podcast" ? (
              <Headphones className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 translate-x-0.5" />
            )}
          </span>
        </span>
      ) : null}

      {item.external_url ? (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/40 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white backdrop-blur">
          <ExternalLink className="h-2.5 w-2.5" />
          {hostname(item.external_url)}
        </span>
      ) : null}
    </div>
  );
}

function RealisationCard({
  item,
  aspect,
  index,
}: {
  item: RealisationPublic;
  aspect: string;
  index: number;
}) {
  const linkHref =
    item.external_url ??
    (item.caseSlug ? `/etudes-de-cas/${item.caseSlug}` : null);

  const content = (
    <>
      <RealisationMedia item={item} aspect={aspect} />
      <figcaption className="mt-3 space-y-1">
        {item.title ? (
          <p className="truncate font-display text-sm font-semibold tracking-tight text-foreground">
            {item.title}
          </p>
        ) : null}
        {item.client_name ? (
          <p className="truncate text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {item.client_name}
          </p>
        ) : null}
        {item.caseSlug && !item.external_url ? (
          <Link
            href={`/etudes-de-cas/${item.caseSlug}`}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-deep transition-colors hover:text-accent"
          >
            Lire l&apos;étude
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        ) : null}
      </figcaption>
    </>
  );

  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px 0px" }}
      transition={{ duration: 0.45, ease, delay: Math.min(index * 0.05, 0.3) }}
      className="group flex w-full shrink-0 snap-center flex-col"
    >
      {linkHref ? (
        <a
          href={linkHref}
          target={linkHref.startsWith("http") ? "_blank" : undefined}
          rel={linkHref.startsWith("http") ? "noreferrer" : undefined}
          aria-label={
            item.title ??
            `Voir la réalisation ${item.client_name ?? item.type}`
          }
          className="block"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </motion.figure>
  );
}

function useAutoAdvanceCarousel(
  scrollerRef: React.RefObject<HTMLUListElement | null>,
  count: number,
  enabled: boolean,
  intervalMs = 5000,
) {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);

  const scrollToIndex = useCallback(
    (i: number) => {
      const el = scrollerRef.current;
      if (!el) return;
      const cards = el.querySelectorAll<HTMLLIElement>(
        "[data-carousel-item]",
      );
      const target = cards[i];
      if (!target) return;
      const offsetLeft =
        target.offsetLeft - (el.clientWidth - target.clientWidth) / 2;
      el.scrollTo({ left: offsetLeft, behavior: "smooth" });
    },
    [scrollerRef],
  );

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const cards = el.querySelectorAll<HTMLLIElement>(
        "[data-carousel-item]",
      );
      if (cards.length === 0) return;
      const itemWidth = el.scrollWidth / cards.length;
      const centerX = el.scrollLeft + el.clientWidth / 2;
      const index = Math.round(centerX / itemWidth - 0.5);
      setActive(Math.max(0, Math.min(cards.length - 1, index)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollerRef]);

  useEffect(() => {
    if (!enabled || count <= 1) return;
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
  }, [enabled, count, intervalMs, scrollerRef]);

  return { active, scrollToIndex };
}

function RealisationsSection({
  type,
  items,
}: {
  type: RealisationPublic["type"];
  items: RealisationPublic[];
}) {
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;
  const scrollerRef = useRef<HTMLUListElement>(null);
  const { active, scrollToIndex } = useAutoAdvanceCarousel(
    scrollerRef,
    items.length,
    items.length > 1,
  );

  if (items.length === 0) return null;

  return (
    <section
      id={`realisations-${type}`}
      aria-labelledby={`realisations-${type}-title`}
      className={cn(
        "relative py-10",
        config.surface === "muted" ? "bg-surface-muted/60" : "bg-background",
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
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
              className="flex h-5 w-5 items-center justify-center rounded-md bg-brand/10 text-brand-deep"
            >
              <Icon className="h-3 w-3" />
            </span>
            {config.eyebrow}
          </p>
          <h2
            id={`realisations-${type}-title`}
            className="max-w-2xl font-display text-[clamp(24px,3vw,36px)] font-semibold leading-[1.05] tracking-tight text-foreground text-balance"
          >
            {config.title}
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            {config.subtitle}
          </p>
        </motion.header>

        <div className="relative mt-10">
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r via-transparent to-transparent md:w-16",
              config.surface === "muted"
                ? "from-surface-muted"
                : "from-background",
            )}
          />
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l via-transparent to-transparent md:w-16",
              config.surface === "muted"
                ? "from-surface-muted"
                : "from-background",
            )}
          />

          <ul
            ref={scrollerRef}
            aria-label={`${config.eyebrow} · carrousel`}
            className={cn(
              "flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-smooth pb-4 pt-1 md:gap-5",
              "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            )}
            style={{ scrollPaddingInline: "10%" }}
          >
            {items.map((item, i) => (
              <li
                key={item.id}
                data-carousel-item
                className={cn(
                  "flex snap-center",
                  config.cardWidth,
                )}
              >
                <div className="flex w-full">
                  <RealisationCard
                    item={item}
                    aspect={config.aspect}
                    index={i}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {items.length > 1 ? (
          <div className="mt-5 flex items-center justify-center gap-1.5">
            {items.map((it, i) => (
              <button
                key={`${it.id}-dot`}
                type="button"
                aria-label={`Aller à l'élément ${i + 1}`}
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

export function RealisationsByType({
  groups,
}: {
  groups: Record<RealisationPublic["type"], RealisationPublic[]>;
}) {
  return (
    <>
      <RealisationsSection type="ads" items={groups.ads} />
      <RealisationsSection type="video" items={groups.video} />
      <RealisationsSection type="social" items={groups.social} />
      <RealisationsSection type="podcast" items={groups.podcast} />
    </>
  );
}
