"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type ProgressSection = {
  id: string;
  label: string;
};

export function SectionsProgress({ sections }: { sections: ProgressSection[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  const [visible, setVisible] = useState(false);
  const ignoreNextScrollRef = useRef<number | null>(null);

  useEffect(() => {
    // Only show after user has scrolled a bit
    const onScroll = () => {
      setVisible(window.scrollY > 280);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick entry with highest intersection ratio among those crossing threshold
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visibleEntries[0];
        if (top?.target?.id) setActive(top.target.id);
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    ignoreNextScrollRef.current = Date.now();
    const y = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y, behavior: "smooth" });
    setActive(id);
  }

  return (
    <nav
      aria-label="Sections de la page"
      className={cn(
        "fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-2 transition-opacity duration-300 lg:flex",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToSection(s.id)}
            aria-label={s.label}
            aria-current={isActive}
            className="group flex items-center gap-3 outline-none"
          >
            <span
              className={cn(
                "whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] transition-all duration-200",
                isActive
                  ? "border-border bg-card text-foreground shadow-sm opacity-100"
                  : "border-transparent bg-transparent text-muted-foreground opacity-0 group-hover:border-border group-hover:bg-card/80 group-hover:text-foreground group-hover:opacity-100 group-focus-visible:border-border group-focus-visible:bg-card/80 group-focus-visible:opacity-100",
              )}
            >
              {s.label}
            </span>
            <span
              aria-hidden
              className={cn(
                "rounded-full transition-all duration-200",
                isActive
                  ? "h-2 w-2 bg-brand-deep shadow-[0_0_0_3px_rgba(86,148,189,0.18)]"
                  : "h-1.5 w-1.5 bg-border group-hover:bg-muted-foreground/60",
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}
