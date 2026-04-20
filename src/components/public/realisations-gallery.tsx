"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import type { RealisationMedia } from "@/lib/public-data";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

function isVideo(m: RealisationMedia) {
  return m.media_type === "video" || m.media_type === "ugc";
}

function LazyVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            v.play().catch(() => {
              /* ignore */
            });
          } else {
            v.pause();
          }
        }
      },
      { rootMargin: "120px", threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
    />
  );
}

export function RealisationsGallery({ items }: { items: RealisationMedia[] }) {
  if (items.length === 0) return null;

  return (
    <section
      id="realisations"
      aria-labelledby="realisations-title"
      className="relative overflow-hidden bg-background py-10"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ duration: 0.55, ease }}
          className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-deep">
              Réalisations
            </p>
            <h2
              id="realisations-title"
              className="font-display text-[clamp(28px,3.4vw,44px)] font-semibold leading-[1.05] tracking-tight text-foreground text-balance"
            >
              Un échantillon de ce qui a été produit.
            </h2>
            <p className="text-muted-foreground">
              Creatives, captures, UGC — issus des études publiées.
            </p>
          </div>
        </motion.header>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
          {items.map((m, i) => {
            const tall = i % 7 === 3 || i % 7 === 5;
            return (
              <motion.figure
                key={m.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px 0px" }}
                transition={{
                  duration: 0.45,
                  ease,
                  delay: Math.min(i * 0.03, 0.3),
                }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-border bg-card",
                  tall ? "row-span-2 aspect-[3/4]" : "aspect-square",
                )}
              >
                <Link
                  href={`/etudes-de-cas/${m.case_slug}`}
                  aria-label={`Voir l'étude ${m.case_name}`}
                  className="block h-full w-full"
                >
                  {isVideo(m) ? (
                    <LazyVideo src={m.file_url} />
                  ) : (
                    <Image
                      src={m.file_url}
                      alt={`Réalisation ${m.case_name}`}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  )}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="truncate text-xs font-medium">
                      {m.case_name}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                  </div>
                </Link>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
