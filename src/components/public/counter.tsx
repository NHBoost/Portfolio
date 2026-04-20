"use client";

import { animate, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
  thousandsSeparator?: string;
};

export function Counter({
  value,
  suffix,
  prefix,
  decimals = 0,
  duration = 1.4,
  className,
  thousandsSeparator = "\u202F",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    const n = Number(latest);
    const fixed = n.toFixed(decimals);
    const [whole, decimal] = fixed.split(".");
    const withSep = whole.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    const formatted = decimal ? `${withSep},${decimal}` : withSep;
    return `${prefix ?? ""}${formatted}${suffix ?? ""}`;
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, {
      duration,
      ease: [0.2, 0.8, 0.2, 1],
    });
    return controls.stop;
  }, [inView, value, duration, count]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const unsubscribe = rounded.on("change", (v) => {
      node.textContent = v;
    });
    node.textContent = rounded.get();
    return unsubscribe;
  }, [rounded]);

  return <span ref={ref} className={className} />;
}
