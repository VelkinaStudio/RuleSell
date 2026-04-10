"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface LegalTocProps {
  items: { id: string; title: string }[];
}

/**
 * Sticky sidebar table of contents for long legal pages (3+ sections).
 * Uses IntersectionObserver to highlight the section currently in view.
 * Only rendered at xl breakpoint and above (hidden on smaller screens —
 * the scroll progress bar handles orientation there).
 */
export function LegalToc({ items }: LegalTocProps) {
  const t = useTranslations("legal");
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const headingEls: Element[] = [];

    // Observe all section headings by their id
    items.forEach(({ id }) => {
      const el = document.getElementById(`${id}-heading`) ?? document.getElementById(id);
      if (el) headingEls.push(el);
    });

    if (headingEls.length === 0) return;

    // Track which sections are currently visible and pick the topmost one
    const visible = new Set<string>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id.replace(/-heading$/, "");
          if (entry.isIntersecting) {
            visible.add(sectionId);
          } else {
            visible.delete(sectionId);
          }
        });

        // Pick the topmost visible section (matches document order)
        if (visible.size > 0) {
          const ordered = items.map((i) => i.id).filter((id) => visible.has(id));
          if (ordered.length > 0) setActiveId(ordered[0]);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      },
    );

    headingEls.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [items]);

  return (
    <nav aria-label={t("tableOfContents")}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
        {t("tableOfContents")}
      </p>
      <ol className="space-y-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "block border-l-2 py-0.5 pl-3 text-xs leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                  isActive
                    ? "border-brand font-medium text-brand"
                    : "border-transparent text-fg-subtle hover:border-border-soft hover:text-fg-muted",
                )}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
