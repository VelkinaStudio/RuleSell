import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/**
 * Deep-merge two message bundles. Values in `override` win when present and
 * non-empty; otherwise we fall back to `base`. This is what makes the
 * structured-but-empty DE/ES/JA scaffolds usable: any key the translator
 * hasn't filled in yet falls through to the English string.
 */
function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(override)) {
    const baseValue = base[k];
    if (
      v !== null &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      baseValue !== null &&
      typeof baseValue === "object" &&
      !Array.isArray(baseValue)
    ) {
      out[k] = deepMerge(
        baseValue as Record<string, unknown>,
        v as Record<string, unknown>,
      );
    } else if (typeof v === "string" && v.length === 0) {
      // Empty string in scaffold → fall back to English
      out[k] = baseValue ?? v;
    } else {
      out[k] = v;
    }
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Always load the English bundle so we can deep-merge it as the fallback.
  // For the default locale this is just `messages = en`. For TR/DE/ES/JA
  // we merge the locale on top of EN so any missing key cascades.
  const enMessages = (await import("../../messages/en.json")).default;
  if (locale === "en") {
    return { locale, messages: enMessages };
  }

  const localeMessages = (await import(`../../messages/${locale}.json`)).default;
  const merged = deepMerge(
    enMessages as Record<string, unknown>,
    localeMessages as Record<string, unknown>,
  );

  return { locale, messages: merged };
});
