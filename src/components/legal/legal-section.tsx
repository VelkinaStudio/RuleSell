"use client";

import { useTranslations } from "next-intl";

interface LegalSectionListProps {
  /** Translation namespace, e.g. "legal.terms.sections". */
  namespace: string;
  /** Section keys, in order. Each key must have `{key}.title` and `{key}.body`. */
  sectionKeys: readonly string[];
}

/**
 * Renders a series of `<section>` blocks from translation keys.
 * Used by every legal page so that body copy lives in messages/<locale>.json
 * rather than being hardcoded in TSX.
 */
export function LegalSectionList({
  namespace,
  sectionKeys,
}: LegalSectionListProps) {
  const t = useTranslations(namespace);
  return (
    <>
      {sectionKeys.map((key) => {
        const slug = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
        return (
          <section key={key} id={slug} aria-labelledby={`${slug}-heading`}>
            <h2 id={`${slug}-heading`}>{t(`${key}.title`)}</h2>
            <p>{t(`${key}.body`)}</p>
          </section>
        );
      })}
    </>
  );
}
