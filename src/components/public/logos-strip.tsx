"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { TrustEntry } from "@/lib/public-data";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export function LogosStrip({ items }: { items: TrustEntry[] }) {
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="trust-title"
      className="relative border-y border-border/70 bg-background py-10"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <motion.p
          id="trust-title"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px 0px" }}
          transition={{ duration: 0.45, ease }}
          className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground md:text-left"
        >
          Études publiées · clients qui nous ont fait confiance
        </motion.p>
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px 0px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:justify-between md:gap-x-6"
        >
          {items.map((entry, i) => (
            <motion.li
              key={entry.slug + i}
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
              }}
              className="shrink-0"
            >
              <Link
                href={`/etudes-de-cas/${entry.slug}`}
                aria-label={`Étude de cas ${entry.client_name}`}
                className={cn(
                  "group inline-flex items-center gap-2 transition-colors",
                  entry.logo_url ? "" : "",
                )}
              >
                {entry.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={entry.logo_url}
                    alt={entry.client_name}
                    className="h-7 max-w-[140px] object-contain opacity-50 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 md:h-9"
                  />
                ) : (
                  <span className="font-display text-[15px] font-semibold tracking-tight text-muted-foreground/80 transition-colors duration-300 group-hover:text-foreground md:text-base">
                    {entry.client_name}
                  </span>
                )}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
