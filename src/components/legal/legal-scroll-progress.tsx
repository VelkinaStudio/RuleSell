"use client";

import { useEffect, useState } from "react";

/**
 * Thin progress bar fixed at the top of the viewport that tracks scroll
 * position through the page. Uses a JS scroll listener that updates a CSS
 * custom property so the bar animates purely via CSS width.
 *
 * On reduced-motion systems the bar still shows position but transitions
 * are disabled via the prefers-reduced-motion media query.
 */
export function LegalScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      setProgress(pct);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="legal-scroll-progress pointer-events-none fixed left-0 right-0 top-0 z-50 h-0.5"
    >
      <div
        className="h-full origin-left bg-brand transition-[width] duration-100 ease-linear motion-reduce:transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
