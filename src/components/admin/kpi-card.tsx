"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  caption,
  accent,
  index = 0,
  className,
}: {
  label: string;
  value: React.ReactNode;
  caption?: React.ReactNode;
  accent?: "default" | "brand" | "ink";
  index?: number;
  className?: string;
}) {
  const accentClass =
    accent === "brand"
      ? "text-brand-deep"
      : accent === "ink"
        ? "text-accent"
        : "text-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1], delay: index * 0.04 }}
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-sm",
        className,
      )}
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-3 font-display text-3xl font-semibold leading-none tabular-nums tracking-tight",
          accentClass,
        )}
      >
        {value}
      </p>
      {caption ? (
        <p className="mt-2 text-xs text-muted-foreground">{caption}</p>
      ) : null}
    </motion.div>
  );
}
