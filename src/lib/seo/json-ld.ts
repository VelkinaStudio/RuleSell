const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://rulesell.vercel.app";

const ORG_NAME = "RuleSell";
const ORG_LOGO = `${SITE_URL}/logos/rulesell-mark.svg`;

export interface RulesetSchemaInput {
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  avgRating: number;
  ratingCount: number;
  downloadCount: number;
  author: { username: string; displayName?: string | null };
  createdAt: Date | string;
  updatedAt: Date | string;
}

export function makeOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: ORG_NAME,
    url: SITE_URL,
    logo: ORG_LOGO,
    description:
      "The verified marketplace for AI development assets — rules, MCP servers, skills, agents, and workflows.",
    sameAs: [
      "https://github.com/VelkinaStudio/RuleSell",
    ],
  };
}

export function makeWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: ORG_NAME,
    description:
      "Quality-scored, security-scanned AI configs for Claude Code, Cursor, Windsurf, and more.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function makeBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function makeRulesetProductSchema(r: RulesetSchemaInput) {
  const url = `${SITE_URL}/r/${r.slug}`;
  const authorName = r.author.displayName || r.author.username;
  const isFree = r.price <= 0;

  const base = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "@id": `${url}#software`,
    name: r.title,
    description: r.description,
    url,
    codeRepository: url,
    programmingLanguage: "Markdown",
    author: {
      "@type": "Person",
      name: authorName,
      url: `${SITE_URL}/u/${r.author.username}`,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    dateCreated: new Date(r.createdAt).toISOString(),
    dateModified: new Date(r.updatedAt).toISOString(),
    keywords: r.category,
  };

  const aggregateRating =
    r.ratingCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: r.avgRating.toFixed(1),
            ratingCount: r.ratingCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {};

  const offers = {
    offers: {
      "@type": "Offer",
      price: isFree ? "0" : r.price.toFixed(2),
      priceCurrency: r.currency || "USD",
      availability: "https://schema.org/InStock",
      url,
    },
  };

  return { ...base, ...aggregateRating, ...offers };
}

/**
 * Render a JSON-LD script tag as a React element in a Server Component.
 *
 * Usage:
 *   <JsonLd data={makeOrganizationSchema()} />
 *
 * Next.js recommends this pattern — inline <script type="application/ld+json">
 * in the component tree rather than via Metadata API, because the Metadata API
 * does not support arbitrary script injection.
 */
export function jsonLdScript(data: unknown) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
