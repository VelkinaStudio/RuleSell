import { defineRouting } from "next-intl/routing";

// Launch locales: EN (default) + TR full translation.
// Structured-but-empty: DE / ES / JA. The empty messages files are
// shaped identically to en.json so future translators can fill them in
// without breaking the type schema. next-intl falls back to English on
// any missing key (see i18n/request.ts).
export const routing = defineRouting({
  locales: ["en", "tr", "de", "es", "ja"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
});
