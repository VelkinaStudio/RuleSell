# Batch 1: Marketing Surfaces — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign all 8 marketing surface pages with the humane-design-engine brand thread (Space Grotesk typography, color evolution, motion language) and full conversion architecture on the homepage.

**Architecture:** Brand thread tokens/fonts/motion established first, then 8 new marketing components created, then homepage assembled from 9 sections, then remaining 7 pages redesigned individually. Each task produces a working commit.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, next-intl, Space Grotesk (Google Fonts)

---

### Task 1: Font Setup — Space Grotesk Display Font

**Files:**
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/styles/tokens.css`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add Space Grotesk via Google Fonts in layout.tsx**

In `src/app/[locale]/layout.tsx`, add the Google Fonts preload links and the `font-display` CSS variable definition to the `<head>`.

Replace:
```tsx
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // CRITICAL: must be called before any next-intl server function for the
  // current request, otherwise getMessages() falls back to the default locale.
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className="dark">
      <body className="min-h-screen bg-bg text-fg antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            {children}
            <CookieBanner />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

With:
```tsx
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // CRITICAL: must be called before any next-intl server function for the
  // current request, otherwise getMessages() falls back to the default locale.
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg text-fg antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            {children}
            <CookieBanner />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Add `--font-display` CSS variable to tokens.css**

In `src/styles/tokens.css`, add the font variable inside the `:root` block, after the existing spacing tokens (before the closing `}`):

Add the following line after `--space-16: 64px;`:

```css
  /* Display font */
  --font-display: "Space Grotesk", system-ui, sans-serif;
```

- [ ] **Step 3: Add `font-display` Tailwind utility in globals.css**

In `src/app/globals.css`, inside the `@theme inline { ... }` block, add the font-display mapping after the existing `--font-mono` line:

After:
```css
  --font-mono: "Geist Mono", "Geist Mono Fallback", ui-monospace, monospace;
```

Add:
```css
  --font-display: var(--font-display, "Space Grotesk", system-ui, sans-serif);
```

This creates the Tailwind utility class `font-display` that maps to Space Grotesk.

- [ ] **Step 4: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**
```bash
git add src/app/[locale]/layout.tsx src/styles/tokens.css src/app/globals.css
git commit -m "feat: add Space Grotesk display font with font-display Tailwind utility"
```

---

### Task 2: Color Token Updates

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add secondary steel blue tokens, update surface colors, add quality score tokens in tokens.css**

In `src/styles/tokens.css`, inside the `:root { ... }` block, make the following changes:

Replace the surface values:
```css
  --bg-surface: #18181b;
  --bg-raised: #27272a;
```
With:
```css
  --bg-surface: #141416;
  --bg-raised: #1e1e22;
```

After the `--brand-fg: #18181b;` line, add the new secondary color tokens:

```css

  /* Secondary accent — steel blue */
  --secondary-steel: #94a3b8;
  --secondary-steel-muted: #64748b;
  --secondary-steel-bright: #cbd5e1;

  /* Quality score color coding */
  --qs-a: #10b981;
  --qs-b: #f59e0b;
  --qs-c: #f43f5e;
```

- [ ] **Step 2: Map new tokens to Tailwind utilities in globals.css**

In `src/app/globals.css`, inside the `@theme inline { ... }` block, after the existing `--color-brand-fg` line, add:

```css
  --color-secondary-steel: var(--secondary-steel);
  --color-secondary-steel-muted: var(--secondary-steel-muted);
  --color-secondary-steel-bright: var(--secondary-steel-bright);
  --color-qs-a: var(--qs-a);
  --color-qs-b: var(--qs-b);
  --color-qs-c: var(--qs-c);
```

- [ ] **Step 3: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**
```bash
git add src/styles/tokens.css src/app/globals.css
git commit -m "feat: add steel blue secondary tokens, update surface hierarchy, add quality score colors"
```

---

### Task 3: Motion Variants — heroEntrance and sectionReveal

**Files:**
- Modify: `src/lib/motion/variants.ts`

- [ ] **Step 1: Add heroEntrance and sectionReveal variants**

In `src/lib/motion/variants.ts`, add the following two variant definitions after the existing `staggerContainer` export:

```ts
export const heroEntrance: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const heroChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export const sectionReveal: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const sectionChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};
```

- [ ] **Step 2: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**
```bash
git add src/lib/motion/variants.ts
git commit -m "feat: add heroEntrance and sectionReveal motion variants"
```

---

### Task 4: i18n Keys — All New Homepage Keys

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/tr.json`

- [ ] **Step 1: Add new homepage i18n keys to en.json**

In `messages/en.json`, find the `"landing"` key. Replace the entire `"landing"` block with the following expanded version:

```json
  "landing": {
    "hero": {
      "eyebrow": "The verified marketplace",
      "title": "Ship better AI, faster.",
      "subtitle": "Quality-scored rules, MCPs, and tools — verified, installable in one command.",
      "searchPlaceholder": "Search verified assets…",
      "searchSubmit": "Search"
    },
    "shelves": {
      "topForYou": "Top for you",
      "topForYouDesc": "Highest measured Quality Score",
      "editorsPicks": "Editor's picks",
      "editorsPicksDesc": "Hand-curated by the RuleSell team",
      "newThisWeek": "New this week",
      "newThisWeekDesc": "Fresh drops in the last 14 days",
      "collections": "Curated collections",
      "collectionsDesc": "Themed bundles for the way you build"
    },
    "socialProof": {
      "assets": "2,400+ assets",
      "assetsLabel": "verified assets",
      "installs": "180K+ installs",
      "installsLabel": "total installs",
      "creators": "850+ creators",
      "creatorsLabel": "verified creators",
      "quality": "82 avg score",
      "qualityLabel": "average quality score"
    },
    "howItWorks": {
      "title": "How it works",
      "step1Title": "Browse and search",
      "step1Desc": "Find rules, MCPs, skills, and more for your environment.",
      "step2Title": "Check quality scores",
      "step2Desc": "Every asset is measured on token efficiency, security, and reliability.",
      "step3Title": "Install with one command",
      "step3Desc": "Copy the install command. Works with Cursor, Windsurf, Claude, and more."
    },
    "qualityShowcase": {
      "title": "Quality is measured, not voted.",
      "subtitle": "Five automated signals replace star ratings and download counts.",
      "tokenEfficiency": "Token efficiency",
      "tokenEfficiencyDesc": "Measures actual token consumption, not self-reported estimates.",
      "installSuccess": "Install success rate",
      "installSuccessDesc": "Tracked across real CLI installations.",
      "schemaCleanliness": "Schema cleanliness",
      "schemaCleanlinessDesc": "JSON and YAML validation against published standards.",
      "freshness": "Freshness",
      "freshnessDesc": "Penalizes stale assets. Rewards active maintenance.",
      "securityScan": "Security scan",
      "securityScanDesc": "VirusTotal, Semgrep, and sandboxed execution.",
      "exampleTitle": "Example: Senior Cursor Rules",
      "exampleScore": "87",
      "exampleGrade": "A"
    },
    "creatorEconomics": {
      "title": "Creators keep 85%.",
      "body": "No other AI asset marketplace pays creators. We take 15% — that's it. No listing fees, no featured-placement taxes. Payouts via Stripe Connect, monthly.",
      "cta": "Start selling",
      "saleLabel": "On a $19 sale",
      "creatorShare": "$16.15",
      "creatorLabel": "to creator",
      "platformShare": "$2.85",
      "platformLabel": "to platform"
    },
    "trustStrip": {
      "title": "Built on verified trust",
      "virusTotalTitle": "VirusTotal scanning",
      "virusTotalDesc": "Every upload scanned against 70+ antivirus engines.",
      "semgrepTitle": "Semgrep analysis",
      "semgrepDesc": "Static analysis catches security anti-patterns before publishing.",
      "verifiedReviewsTitle": "Verified-install reviews",
      "verifiedReviewsDesc": "Only users who installed an asset via CLI can leave reviews.",
      "learnMore": "Learn more about our trust model"
    },
    "communityPreview": {
      "title": "Community activity",
      "cta": "Join the community",
      "emptyState": "No recent activity yet."
    },
    "finalCta": {
      "title": "Ready to upgrade your workflow?",
      "subtitle": "Browse quality-scored assets built by developers, for developers.",
      "cta": "Browse marketplace"
    },
    "errors": {
      "title": "We hit a snag loading the marketplace.",
      "retry": "Try again"
    }
  }
```

- [ ] **Step 2: Add new homepage i18n keys to tr.json**

In `messages/tr.json`, find the `"landing"` key. Replace the entire `"landing"` block with:

```json
  "landing": {
    "hero": {
      "eyebrow": "Doğrulanmış pazaryeri",
      "title": "Daha iyi yapay zeka, daha hızlı.",
      "subtitle": "Kalite puanlı kurallar, MCP'ler ve araçlar — doğrulanmış, tek komutla kurulur.",
      "searchPlaceholder": "Doğrulanmış varlıkları ara…",
      "searchSubmit": "Ara"
    },
    "shelves": {
      "topForYou": "Senin için en iyiler",
      "topForYouDesc": "En yüksek ölçülmüş Kalite Puanı",
      "editorsPicks": "Editör seçimleri",
      "editorsPicksDesc": "RuleSell ekibinin elle seçtikleri",
      "newThisWeek": "Bu hafta yeni",
      "newThisWeekDesc": "Son 14 gündeki yeni eklemeler",
      "collections": "Seçili koleksiyonlar",
      "collectionsDesc": "Çalışma şekline uygun temalı paketler"
    },
    "socialProof": {
      "assets": "2.400+ varlık",
      "assetsLabel": "doğrulanmış varlık",
      "installs": "180B+ kurulum",
      "installsLabel": "toplam kurulum",
      "creators": "850+ üretici",
      "creatorsLabel": "doğrulanmış üretici",
      "quality": "82 ort. puan",
      "qualityLabel": "ortalama kalite puanı"
    },
    "howItWorks": {
      "title": "Nasıl çalışır",
      "step1Title": "Keşfet ve ara",
      "step1Desc": "Ortamına uygun kurallar, MCP'ler, beceriler ve daha fazlasını bul.",
      "step2Title": "Kalite puanlarını kontrol et",
      "step2Desc": "Her varlık token verimliliği, güvenlik ve güvenilirlik üzerinden ölçülür.",
      "step3Title": "Tek komutla kur",
      "step3Desc": "Kurulum komutunu kopyala. Cursor, Windsurf, Claude ve daha fazlasıyla çalışır."
    },
    "qualityShowcase": {
      "title": "Kalite ölçülür, oylanmaz.",
      "subtitle": "Beş otomatik sinyal, yıldız puanları ve indirme sayılarının yerini alır.",
      "tokenEfficiency": "Token verimliliği",
      "tokenEfficiencyDesc": "Gerçek token tüketimini ölçer, beyan edilen tahminleri değil.",
      "installSuccess": "Kurulum başarı oranı",
      "installSuccessDesc": "Gerçek CLI kurulumları üzerinden takip edilir.",
      "schemaCleanliness": "Şema temizliği",
      "schemaCleanlinessDesc": "Yayınlanmış standartlara göre JSON ve YAML doğrulaması.",
      "freshness": "Güncellik",
      "freshnessDesc": "Eski varlıkları cezalandırır. Aktif bakımı ödüllendirir.",
      "securityScan": "Güvenlik taraması",
      "securityScanDesc": "VirusTotal, Semgrep ve korumalı alan çalıştırması.",
      "exampleTitle": "Örnek: Senior Cursor Rules",
      "exampleScore": "87",
      "exampleGrade": "A"
    },
    "creatorEconomics": {
      "title": "Üreticiler %85'ini alır.",
      "body": "Başka hiçbir yapay zeka varlık pazaryeri üreticilere ödeme yapmaz. Biz %15 alıyoruz — hepsi bu. Listeleme ücreti yok, öne çıkarma vergisi yok. Ödemeler Stripe Connect ile aylık.",
      "cta": "Satışa başla",
      "saleLabel": "$19'luk bir satışta",
      "creatorShare": "$16,15",
      "creatorLabel": "üreticiye",
      "platformShare": "$2,85",
      "platformLabel": "platforma"
    },
    "trustStrip": {
      "title": "Doğrulanmış güven üzerine inşa edildi",
      "virusTotalTitle": "VirusTotal taraması",
      "virusTotalDesc": "Her yükleme 70'ten fazla antivirüs motoruyla taranır.",
      "semgrepTitle": "Semgrep analizi",
      "semgrepDesc": "Statik analiz, yayınlanmadan önce güvenlik sorunlarını yakalar.",
      "verifiedReviewsTitle": "Doğrulanmış kurulum yorumları",
      "verifiedReviewsDesc": "Yalnızca CLI ile kurulum yapan kullanıcılar yorum bırakabilir.",
      "learnMore": "Güven modelimiz hakkında daha fazla bilgi"
    },
    "communityPreview": {
      "title": "Topluluk etkinliği",
      "cta": "Topluluğa katıl",
      "emptyState": "Henüz yeni bir etkinlik yok."
    },
    "finalCta": {
      "title": "İş akışını yükseltmeye hazır mısın?",
      "subtitle": "Geliştiriciler tarafından geliştiriciler için üretilmiş kalite puanlı varlıkları keşfet.",
      "cta": "Pazaryerini keşfet"
    },
    "errors": {
      "title": "Pazaryerini yüklerken bir sorun yaşadık.",
      "retry": "Tekrar dene"
    }
  }
```

- [ ] **Step 3: Verify JSON validity**
```bash
node -e "JSON.parse(require('fs').readFileSync('messages/en.json','utf8')); console.log('en.json valid')"
node -e "JSON.parse(require('fs').readFileSync('messages/tr.json','utf8')); console.log('tr.json valid')"
```

- [ ] **Step 4: Commit**
```bash
git add messages/en.json messages/tr.json
git commit -m "feat: add all homepage marketing section i18n keys (en + tr)"
```

---

### Task 5: SocialProofBar Component

**Files:**
- Create: `src/components/marketing/social-proof-bar.tsx`

- [ ] **Step 1: Create marketing directory and the component**

```bash
mkdir -p src/components/marketing
```

Write the full component to `src/components/marketing/social-proof-bar.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface SocialProofBarProps {
  className?: string;
}

export function SocialProofBar({ className }: SocialProofBarProps) {
  const t = useTranslations("landing.socialProof");

  const metrics = [
    { value: t("assets"), label: t("assetsLabel") },
    { value: t("installs"), label: t("installsLabel") },
    { value: t("creators"), label: t("creatorsLabel") },
    { value: t("quality"), label: t("qualityLabel") },
  ];

  return (
    <section
      className={cn(
        "border-y border-border-soft bg-bg-surface/50",
        className,
      )}
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8 px-4 py-6 sm:gap-12 sm:px-6 sm:py-8 lg:gap-16 lg:px-8">
        {metrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <p className="font-mono text-lg font-semibold tabular-nums text-fg sm:text-xl">
              {metric.value}
            </p>
            <p className="mt-0.5 text-xs text-fg-muted">{metric.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**
```bash
git add src/components/marketing/social-proof-bar.tsx
git commit -m "feat: add SocialProofBar marketing component"
```

---

### Task 6: HowItWorks Component

**Files:**
- Create: `src/components/marketing/how-it-works.tsx`

- [ ] **Step 1: Write the full component**

Write to `src/components/marketing/how-it-works.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Search, ShieldCheck, Terminal } from "lucide-react";
import { useTranslations } from "next-intl";

import { sectionReveal, sectionChild } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

interface HowItWorksProps {
  className?: string;
}

const STEPS = [
  { icon: Search, key: "step1" as const },
  { icon: ShieldCheck, key: "step2" as const },
  { icon: Terminal, key: "step3" as const },
] as const;

export function HowItWorks({ className }: HowItWorksProps) {
  const t = useTranslations("landing.howItWorks");
  const reduce = useReducedMotion();

  return (
    <section className={cn("py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          {t("title")}
        </h2>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6"
          variants={sectionReveal}
          initial={reduce ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isHighlighted = i === 1;
            return (
              <motion.div
                key={step.key}
                variants={sectionChild}
                className={cn(
                  "flex flex-col items-center text-center",
                  isHighlighted && "sm:scale-105",
                )}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    isHighlighted
                      ? "bg-brand/15 text-brand"
                      : "bg-bg-raised text-fg-muted",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div
                  className={cn(
                    "mt-1 font-mono text-xs tabular-nums",
                    isHighlighted ? "text-brand" : "text-fg-subtle",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3
                  className={cn(
                    "mt-3 font-display text-base font-semibold",
                    isHighlighted ? "text-brand" : "text-fg",
                  )}
                >
                  {t(`${step.key}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {t(`${step.key}Desc`)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**
```bash
git add src/components/marketing/how-it-works.tsx
git commit -m "feat: add HowItWorks marketing component"
```

---

### Task 7: QualityShowcase Component

**Files:**
- Create: `src/components/marketing/quality-showcase.tsx`

- [ ] **Step 1: Write the full component**

Write to `src/components/marketing/quality-showcase.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  CheckCircle,
  Clock,
  FileCheck,
  Shield,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { sectionReveal, sectionChild } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

interface QualityShowcaseProps {
  className?: string;
}

const METRICS = [
  { icon: Activity, key: "tokenEfficiency" as const },
  { icon: CheckCircle, key: "installSuccess" as const },
  { icon: FileCheck, key: "schemaCleanliness" as const },
  { icon: Clock, key: "freshness" as const },
  { icon: Shield, key: "securityScan" as const },
] as const;

const EXAMPLE_METRICS = [
  { label: "Token efficiency", score: 91 },
  { label: "Install success", score: 88 },
  { label: "Schema cleanliness", score: 95 },
  { label: "Freshness", score: 78 },
  { label: "Security", score: 82 },
];

function gradeColor(score: number): string {
  if (score >= 85) return "text-qs-a";
  if (score >= 70) return "text-qs-b";
  return "text-qs-c";
}

function barColor(score: number): string {
  if (score >= 85) return "bg-qs-a";
  if (score >= 70) return "bg-qs-b";
  return "bg-qs-c";
}

export function QualityShowcase({ className }: QualityShowcaseProps) {
  const t = useTranslations("landing.qualityShowcase");
  const reduce = useReducedMotion();

  return (
    <section className={cn("bg-bg-surface py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl lg:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm text-fg-muted sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        {/* Metrics grid */}
        <motion.div
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={sectionReveal}
          initial={reduce ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.key}
                variants={sectionChild}
                className="rounded-lg border border-border-soft bg-bg p-5"
              >
                <Icon className="h-5 w-5 text-brand" />
                <h3 className="mt-3 text-sm font-semibold text-fg">
                  {t(`${metric.key}`)}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">
                  {t(`${metric.key}Desc`)}
                </p>
              </motion.div>
            );
          })}

          {/* Example quality card */}
          <motion.div
            variants={sectionChild}
            className="rounded-lg border border-brand/20 bg-bg p-5 sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-fg">
                {t("exampleTitle")}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className={cn("font-mono text-2xl font-bold", gradeColor(87))}>
                  {t("exampleScore")}
                </span>
                <span className={cn("font-mono text-sm font-semibold", gradeColor(87))}>
                  /{t("exampleGrade")}
                </span>
              </div>
            </div>
            <div className="mt-4 space-y-2.5">
              {EXAMPLE_METRICS.map((m) => (
                <div key={m.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-fg-muted">{m.label}</span>
                    <span className={cn("font-mono tabular-nums", gradeColor(m.score))}>
                      {m.score}
                    </span>
                  </div>
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-bg-raised">
                    <motion.div
                      className={cn("h-full rounded-full", barColor(m.score))}
                      initial={reduce ? { width: `${m.score}%` } : { width: 0 }}
                      whileInView={{ width: `${m.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**
```bash
git add src/components/marketing/quality-showcase.tsx
git commit -m "feat: add QualityShowcase marketing component with animated score bars"
```

---

### Task 8: FeaturedRulesetCard Component

**Files:**
- Create: `src/components/marketing/featured-ruleset-card.tsx`

- [ ] **Step 1: Write the full component**

Write to `src/components/marketing/featured-ruleset-card.tsx`:

```tsx
"use client";

import { Download, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Ruleset } from "@/types";
import { CATEGORY_META } from "@/constants/categories";
import { IconByName } from "@/components/ui/icon-map";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { formatCount, formatPrice } from "@/lib/utils";

interface FeaturedRulesetCardProps {
  ruleset: Ruleset;
  className?: string;
}

function gradeFor(score: number): { letter: string; colorClass: string } {
  if (score >= 85) return { letter: "A", colorClass: "text-qs-a bg-qs-a/15 border-qs-a/30" };
  if (score >= 70) return { letter: "B", colorClass: "text-qs-b bg-qs-b/15 border-qs-b/30" };
  if (score >= 50) return { letter: "C", colorClass: "text-qs-c bg-qs-c/15 border-qs-c/30" };
  return { letter: "—", colorClass: "text-fg-muted bg-bg-raised border-border-soft" };
}

export function FeaturedRulesetCard({
  ruleset,
  className,
}: FeaturedRulesetCardProps) {
  const t = useTranslations("marketplace.card");
  const meta = CATEGORY_META[ruleset.category] ?? {
    label: ruleset.category ?? "Other",
    slug: ruleset.category ?? "other",
    color: "#6b7280",
    accent: "gray",
    icon: "Package",
    description: "",
  };

  const priceLabel =
    ruleset.price === 0 ? t("free") : formatPrice(ruleset.price, ruleset.currency);
  const installs = (ruleset.downloadCount ?? 0) + (ruleset.purchaseCount ?? 0);
  const qs = ruleset.qualityScore ?? 0;
  const grade = gradeFor(qs);

  return (
    <Link
      href={`/r/${ruleset.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border-soft bg-bg-surface transition-all",
        "hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "sm:col-span-2 sm:flex-row",
        className,
      )}
    >
      {/* Category accent stripe */}
      <div
        className="h-1 w-full sm:h-auto sm:w-1"
        style={{ backgroundColor: meta.color }}
        aria-hidden
      />

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        {/* Top row: category + quality badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconByName
              name={meta.icon}
              className="h-4 w-4"
              style={{ color: meta.color }}
            />
            <span className="text-xs font-medium text-fg-muted">
              {meta.label}
            </span>
          </div>
          {qs > 0 && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-xs font-semibold tabular-nums",
                grade.colorClass,
              )}
            >
              {grade.letter} {qs}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-semibold text-fg group-hover:text-brand sm:text-xl">
          {ruleset.title}
        </h3>

        {/* Description */}
        <p className="line-clamp-3 text-sm leading-relaxed text-fg-muted">
          {ruleset.description}
        </p>

        {/* Author */}
        <p className="text-xs text-fg-subtle">
          @{ruleset.author.username}
          {ruleset.team && (
            <span className="text-fg-subtle"> · {ruleset.team.name}</span>
          )}
        </p>

        {/* Stats + price */}
        <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-fg-subtle">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5" aria-hidden />
            <span className="font-mono tabular-nums">
              {(ruleset.avgRating ?? 0).toFixed(1)}
            </span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Download className="h-3.5 w-3.5" aria-hidden />
            <span className="font-mono tabular-nums">
              {formatCount(installs)}
            </span>
          </span>
          <span
            className={cn(
              "ml-auto font-mono text-sm font-semibold tabular-nums",
              ruleset.price === 0 ? "text-fg-muted" : "text-fg",
            )}
          >
            {priceLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**
```bash
git add src/components/marketing/featured-ruleset-card.tsx
git commit -m "feat: add FeaturedRulesetCard for homepage editor's picks hero card"
```

---

### Task 9: CreatorEconomics Component

**Files:**
- Create: `src/components/marketing/creator-economics.tsx`

- [ ] **Step 1: Write the full component**

Write to `src/components/marketing/creator-economics.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { sectionReveal, sectionChild } from "@/lib/motion/variants";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface CreatorEconomicsProps {
  className?: string;
}

export function CreatorEconomics({ className }: CreatorEconomicsProps) {
  const t = useTranslations("landing.creatorEconomics");
  const reduce = useReducedMotion();

  return (
    <section className={cn("py-16 sm:py-20", className)}>
      <motion.div
        className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-4 sm:px-6 lg:flex-row lg:gap-16 lg:px-8"
        variants={sectionReveal}
        initial={reduce ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Text side */}
        <motion.div variants={sectionChild} className="flex-1">
          <h2 className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl lg:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-fg-muted sm:text-base">
            {t("body")}
          </p>
          <Link
            href="/dashboard/settings/seller"
            className="mt-6 inline-flex items-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg transition hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {t("cta")}
          </Link>
        </motion.div>

        {/* Visual side — earnings breakdown */}
        <motion.div
          variants={sectionChild}
          className="w-full max-w-sm rounded-xl border border-border-soft bg-bg-surface p-6"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
            {t("saleLabel")}
          </p>

          {/* Stacked bar */}
          <div className="mt-4 flex h-4 w-full overflow-hidden rounded-full">
            <div
              className="bg-brand"
              style={{ width: "85%" }}
              title="Creator 85%"
            />
            <div
              className="bg-secondary-steel"
              style={{ width: "15%" }}
              title="Platform 15%"
            />
          </div>

          {/* Legend */}
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                <span className="text-sm text-fg-muted">{t("creatorLabel")}</span>
              </div>
              <span className="font-mono text-lg font-bold tabular-nums text-fg">
                {t("creatorShare")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-secondary-steel" />
                <span className="text-sm text-fg-muted">{t("platformLabel")}</span>
              </div>
              <span className="font-mono text-lg font-bold tabular-nums text-fg-muted">
                {t("platformShare")}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**
```bash
git add src/components/marketing/creator-economics.tsx
git commit -m "feat: add CreatorEconomics marketing component with earnings breakdown"
```

---

### Task 10: TrustStrip Component

**Files:**
- Create: `src/components/marketing/trust-strip.tsx`

- [ ] **Step 1: Write the full component**

Write to `src/components/marketing/trust-strip.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Code, Shield, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { sectionReveal, sectionChild } from "@/lib/motion/variants";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface TrustStripProps {
  className?: string;
}

const SIGNALS = [
  { icon: Shield, key: "virusTotal" as const },
  { icon: Code, key: "semgrep" as const },
  { icon: Star, key: "verifiedReviews" as const },
] as const;

export function TrustStrip({ className }: TrustStripProps) {
  const t = useTranslations("landing.trustStrip");
  const reduce = useReducedMotion();

  return (
    <section className={cn("bg-bg-surface py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          {t("title")}
        </h2>

        <motion.div
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3"
          variants={sectionReveal}
          initial={reduce ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {SIGNALS.map((signal) => {
            const Icon = signal.icon;
            return (
              <motion.div
                key={signal.key}
                variants={sectionChild}
                className="flex flex-col items-center rounded-lg border border-border-soft bg-bg p-6 text-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-raised text-fg-muted">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-fg">
                  {t(`${signal.key}Title`)}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-fg-muted">
                  {t(`${signal.key}Desc`)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <p className="mt-8 text-center text-sm text-fg-muted">
          <Link
            href="/trust"
            className="text-fg transition hover:text-brand focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
          >
            {t("learnMore")} &rarr;
          </Link>
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**
```bash
git add src/components/marketing/trust-strip.tsx
git commit -m "feat: add TrustStrip marketing component"
```

---

### Task 11: CommunityPreview Component

**Files:**
- Create: `src/components/marketing/community-preview.tsx`

- [ ] **Step 1: Write the full component**

Write to `src/components/marketing/community-preview.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageSquare, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { MOCK_DISCUSSIONS } from "@/constants/mock-discussions";
import { MOCK_SHOWCASES } from "@/constants/mock-showcases";
import { MOCK_RULESETS } from "@/constants/mock-data";
import { sectionReveal, sectionChild } from "@/lib/motion/variants";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/utils";

interface CommunityPreviewProps {
  className?: string;
}

export function CommunityPreview({ className }: CommunityPreviewProps) {
  const t = useTranslations("landing.communityPreview");
  const reduce = useReducedMotion();

  const items = useMemo(() => {
    const feed = [
      ...MOCK_DISCUSSIONS.slice(0, 3).map((d) => {
        const ruleset = MOCK_RULESETS.find((r) => r.id === d.rulesetId);
        return {
          id: `cp-disc-${d.id}`,
          kind: "discussion" as const,
          title: d.title,
          body: `New discussion on ${ruleset?.title ?? "an item"}`,
          createdAt: d.createdAt,
        };
      }),
      ...MOCK_SHOWCASES.slice(0, 2).map((s) => ({
        id: `cp-show-${s.id}`,
        kind: "showcase" as const,
        title: s.title,
        body: `New showcase by @${s.author.username}`,
        createdAt: s.createdAt,
      })),
    ];
    return feed
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, []);

  return (
    <section className={cn("py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          {t("title")}
        </h2>

        <motion.div
          className="mt-8 space-y-1 divide-y divide-border-soft rounded-lg border border-border-soft bg-bg-surface"
          variants={sectionReveal}
          initial={reduce ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {items.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-fg-muted">
              {t("emptyState")}
            </p>
          )}
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={sectionChild}
              className="flex items-start gap-3 px-4 py-3"
            >
              {item.kind === "discussion" ? (
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-fg-dim" />
              ) : (
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-fg-dim" />
              )}
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm text-fg">{item.title}</p>
                <p className="mt-0.5 text-xs text-fg-dim">{item.body}</p>
              </div>
              <span className="shrink-0 text-[10px] text-fg-dim">
                {formatRelative(item.createdAt)}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-6 text-center">
          <Link
            href="/explore"
            className="inline-flex items-center rounded-lg border border-border-soft bg-bg-surface px-5 py-2.5 text-sm font-medium text-fg transition hover:border-border-strong hover:bg-bg-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**
```bash
git add src/components/marketing/community-preview.tsx
git commit -m "feat: add CommunityPreview marketing component"
```

---

### Task 12: FinalCTA Component

**Files:**
- Create: `src/components/marketing/final-cta.tsx`

- [ ] **Step 1: Write the full component**

Write to `src/components/marketing/final-cta.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { heroEntrance, heroChild } from "@/lib/motion/variants";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface FinalCTAProps {
  className?: string;
}

export function FinalCTA({ className }: FinalCTAProps) {
  const t = useTranslations("landing.finalCta");
  const reduce = useReducedMotion();

  return (
    <section
      className={cn(
        "relative overflow-hidden py-20 sm:py-28",
        className,
      )}
    >
      {/* Subtle gold gradient background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 209, 102, 0.06) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="mx-auto flex max-w-2xl flex-col items-center px-4 text-center sm:px-6 lg:px-8"
        variants={heroEntrance}
        initial={reduce ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <motion.h2
          variants={heroChild}
          className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl lg:text-4xl"
        >
          {t("title")}
        </motion.h2>
        <motion.p
          variants={heroChild}
          className="mt-3 text-sm text-fg-muted sm:text-base"
        >
          {t("subtitle")}
        </motion.p>
        <motion.div variants={heroChild}>
          <Link
            href="/browse"
            className="mt-8 inline-flex items-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-fg transition hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {t("cta")}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**
```bash
git add src/components/marketing/final-cta.tsx
git commit -m "feat: add FinalCTA marketing component"
```

---

### Task 13: Rewrite Homepage — Compose All 9 Sections

**Files:**
- Modify: `src/app/[locale]/(public)/page.tsx`

- [ ] **Step 1: Rewrite the full homepage**

Replace the entire contents of `src/app/[locale]/(public)/page.tsx` with:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { CollectionCard } from "@/components/marketplace/collection-card";
import { HeroSearch } from "@/components/marketplace/hero-search";
import { Shelf } from "@/components/marketplace/shelf";
import { ToolPicker } from "@/components/marketplace/tool-picker";
import { FeaturedRulesetCard } from "@/components/marketing/featured-ruleset-card";
import { SocialProofBar } from "@/components/marketing/social-proof-bar";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { QualityShowcase } from "@/components/marketing/quality-showcase";
import { CreatorEconomics } from "@/components/marketing/creator-economics";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { CommunityPreview } from "@/components/marketing/community-preview";
import { FinalCTA } from "@/components/marketing/final-cta";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Stagger } from "@/components/motion/stagger";
import { ErrorState } from "@/components/ui/error-state";
import { RulesetCard } from "@/components/marketplace/ruleset-card";
import { heroEntrance, heroChild } from "@/lib/motion/variants";
import { useCollections } from "@/hooks/use-collections";
import { usePreferredEnvironments } from "@/hooks/use-preferred-environments";
import { useRulesets } from "@/hooks/use-rulesets";
import { ENVIRONMENT_META } from "@/constants/environments";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const t = useTranslations("landing");
  const tShelf = useTranslations("marketplace.shelf");
  const reduce = useReducedMotion();
  const { envs } = usePreferredEnvironments();
  const primaryEnv = envs[0] ?? "claude-code";
  const envLabel = ENVIRONMENT_META[primaryEnv]?.label ?? "Claude Code";

  const top = useRulesets({
    tab: "top",
    pageSize: 8,
    environment: primaryEnv,
  });
  const editors = useRulesets({ tab: "editors", pageSize: 8 });
  const fresh = useRulesets({ tab: "new", pageSize: 8 });
  const collections = useCollections();

  const isLoading =
    top.isLoading || editors.isLoading || fresh.isLoading || collections.isLoading;
  const hasError =
    !!top.error || !!editors.error || !!fresh.error || !!collections.error;

  return (
    <div>
      {/* ── Section 1: Hero ── */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        {/* Animated gradient background */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 animate-hero-gradient"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255, 209, 102, 0.08) 0%, rgba(148, 163, 184, 0.04) 40%, transparent 70%)",
          }}
        />

        <motion.div
          className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center"
          variants={heroEntrance}
          initial={reduce ? "visible" : "hidden"}
          animate="visible"
        >
          <motion.span
            variants={heroChild}
            className="text-xs font-medium uppercase tracking-widest text-fg-subtle"
          >
            {t("hero.eyebrow")}
          </motion.span>

          <motion.h1
            variants={heroChild}
            className="max-w-2xl text-balance font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl lg:text-5xl"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            variants={heroChild}
            className="max-w-xl text-balance text-sm text-fg-muted sm:text-base"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div variants={heroChild} className="mt-2 w-full max-w-xl">
            <HeroSearch />
          </motion.div>

          <motion.div variants={heroChild} className="mt-1">
            <ToolPicker withLabel={false} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Section 2: Social Proof Bar ── */}
      <SocialProofBar />

      {/* ── Section 3: How It Works ── */}
      <HowItWorks />

      {/* ── Section 4: Quality Showcase ── */}
      <QualityShowcase />

      {/* ── Section 5: Curated Shelves ── */}
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {hasError && (
          <ErrorState
            title={t("errors.title")}
            retry={() => {
              top.mutate();
              editors.mutate();
              fresh.mutate();
              collections.mutate();
            }}
          />
        )}

        {isLoading && !hasError && (
          <div className="space-y-10">
            {[0, 1, 2, 3].map((i) => (
              <ShelfSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && !hasError && (
          <>
            {/* Editor's Picks with featured first card */}
            {editors.data && editors.data.data.length > 0 && (
              <ScrollReveal>
                <section className="space-y-4">
                  <div className="flex items-end justify-between gap-4">
                    <h2 className="font-display text-lg font-semibold text-fg sm:text-xl">
                      {t("shelves.editorsPicks")}
                    </h2>
                    <Link
                      href="/browse?tab=editors"
                      className="shrink-0 text-sm text-fg-muted transition hover:text-fg"
                    >
                      {tShelf("seeAll")} &rarr;
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {editors.data.data.slice(0, 1).map((r) => (
                      <FeaturedRulesetCard key={r.id} ruleset={r} />
                    ))}
                    {editors.data.data.slice(1, 8).map((r) => (
                      <RulesetCard key={r.id} ruleset={r} compact />
                    ))}
                  </div>
                </section>
              </ScrollReveal>
            )}

            {top.data && top.data.data.length > 0 && (
              <ScrollReveal>
                <Shelf
                  title={`Top for ${envLabel}`}
                  rulesets={top.data.data}
                  href="/browse/top"
                />
              </ScrollReveal>
            )}

            {fresh.data && fresh.data.data.length > 0 && (
              <ScrollReveal>
                <Shelf
                  title={t("shelves.newThisWeek")}
                  rulesets={fresh.data.data}
                  href="/browse/new"
                />
              </ScrollReveal>
            )}

            {collections.data && collections.data.length > 0 && (
              <ScrollReveal>
                <section className="space-y-4">
                  <div className="flex items-end justify-between gap-4">
                    <h2 className="font-display text-lg font-semibold text-fg sm:text-xl">
                      {t("shelves.collections")}
                    </h2>
                    <Link
                      href="/collections"
                      className="text-sm text-fg-muted hover:text-fg"
                    >
                      {tShelf("seeAll")} &rarr;
                    </Link>
                  </div>
                  <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {collections.data.slice(0, 6).map((c) => (
                      <CollectionCard key={c.id} collection={c} />
                    ))}
                  </Stagger>
                </section>
              </ScrollReveal>
            )}
          </>
        )}
      </div>

      {/* ── Section 6: Creator Economics ── */}
      <CreatorEconomics />

      {/* ── Section 7: Trust Strip ── */}
      <TrustStrip />

      {/* ── Section 8: Community Preview ── */}
      <CommunityPreview />

      {/* ── Section 9: Final CTA ── */}
      <FinalCTA />
    </div>
  );
}

function ShelfSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-5 w-48 animate-pulse rounded bg-bg-surface/60" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-lg border border-border-soft bg-bg-surface/40"
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add the hero-gradient animation to globals.css**

In `src/app/globals.css`, after the `@layer base { ... }` block at the end of the file, add:

```css
@keyframes hero-gradient-move {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-4%) scale(1.04);
  }
}

.animate-hero-gradient {
  animation: hero-gradient-move 20s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-hero-gradient {
    animation: none;
  }
}
```

- [ ] **Step 3: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**
```bash
git add src/app/[locale]/(public)/page.tsx src/app/globals.css
git commit -m "feat: redesign homepage with 9-section conversion funnel architecture"
```

---

### Task 14: About Page Redesign

**Files:**
- Modify: `src/app/[locale]/(public)/about/page.tsx`
- Modify: `messages/en.json`
- Modify: `messages/tr.json`

- [ ] **Step 1: Add about page i18n keys to en.json**

In `messages/en.json`, add a new top-level `"about"` key (at the same level as `"landing"`, `"browse"`, etc.). Insert it after the `"landing"` block:

```json
  "about": {
    "hero": {
      "title": "The marketplace AI developers deserve.",
      "subtitle": "Quality measured. Creators paid. Trust verified."
    },
    "problem": {
      "title": "The problem",
      "point1": "AI tool directories list thousands of assets with no quality signals.",
      "point2": "Creators earn nothing on every major platform.",
      "point3": "Star ratings are gamed. Download counts are meaningless.",
      "point4": "Install instructions are copy-paste nightmares across different tools."
    },
    "solution": {
      "title": "Our approach",
      "point1": "Every asset measured on five automated quality signals.",
      "point2": "Creators keep 85% of every paid sale.",
      "point3": "Reviews restricted to verified installers only.",
      "point4": "One-command CLI install across Cursor, Windsurf, Claude, and more."
    },
    "features": {
      "qualityTitle": "Measured quality",
      "qualityDesc": "Token efficiency, install success, schema cleanliness, freshness, and security scan combined into a single score.",
      "creatorsTitle": "Creator-first economics",
      "creatorsDesc": "85/15 revenue split with monthly Stripe payouts. No listing fees. No featured-placement taxes.",
      "reviewsTitle": "Verified reviews",
      "reviewsDesc": "Only users who installed via CLI can rate. Written reviews require Certified Dev status.",
      "crossEnvTitle": "Cross-environment",
      "crossEnvDesc": "One listing works across Claude Code, Cursor, Windsurf, Cline, Zed, and more."
    },
    "business": {
      "title": "Business model",
      "freeTitle": "Free",
      "freePrice": "$0",
      "freeDesc": "Free forever. Publish and install free assets with no strings attached.",
      "commissionTitle": "Commission",
      "commissionPrice": "15%",
      "commissionDesc": "We take 15% on paid sales. Creators keep the rest. No hidden fees.",
      "proTitle": "Pro",
      "proPrice": "$8/mo",
      "proDesc": "Private collections, full install history, and advanced filters. Not required to buy or sell."
    },
    "team": {
      "title": "The team",
      "body": "Built by Velkina Studio. We use our own platform daily.",
      "github": "Contributions welcome on GitHub."
    }
  }
```

- [ ] **Step 2: Add about page i18n keys to tr.json**

In `messages/tr.json`, add the matching `"about"` key:

```json
  "about": {
    "hero": {
      "title": "Yapay zeka geliştiricilerinin hak ettiği pazaryeri.",
      "subtitle": "Kalite ölçülür. Üreticilere ödenir. Güven doğrulanır."
    },
    "problem": {
      "title": "Sorun",
      "point1": "Yapay zeka araç dizinleri, kalite sinyali olmadan binlerce varlık listeler.",
      "point2": "Üreticiler büyük platformlarda hiçbir şey kazanmaz.",
      "point3": "Yıldız puanları manipüle edilir. İndirme sayıları anlamsızdır.",
      "point4": "Kurulum talimatları farklı araçlar arasında kopyala-yapıştır kabusu."
    },
    "solution": {
      "title": "Yaklaşımımız",
      "point1": "Her varlık beş otomatik kalite sinyali ile ölçülür.",
      "point2": "Üreticiler her ücretli satışın %85'ini alır.",
      "point3": "Yorumlar yalnızca doğrulanmış kurulum yapan kullanıcılara açıktır.",
      "point4": "Cursor, Windsurf, Claude ve daha fazlası için tek komutla CLI kurulumu."
    },
    "features": {
      "qualityTitle": "Ölçülen kalite",
      "qualityDesc": "Token verimliliği, kurulum başarısı, şema temizliği, güncellik ve güvenlik taraması tek bir puanda birleşir.",
      "creatorsTitle": "Üretici öncelikli ekonomi",
      "creatorsDesc": "Aylık Stripe ödemeleriyle %85/%15 gelir paylaşımı. Listeleme ücreti yok. Öne çıkarma vergisi yok.",
      "reviewsTitle": "Doğrulanmış yorumlar",
      "reviewsDesc": "Yalnızca CLI ile kurulum yapanlar puan verebilir. Yazılı yorumlar Sertifikalı Geliştirici statüsü gerektirir.",
      "crossEnvTitle": "Çoklu ortam desteği",
      "crossEnvDesc": "Tek listeleme Claude Code, Cursor, Windsurf, Cline, Zed ve daha fazlasında çalışır."
    },
    "business": {
      "title": "İş modeli",
      "freeTitle": "Ücretsiz",
      "freePrice": "$0",
      "freeDesc": "Sonsuza kadar ücretsiz. Ücretsiz varlıkları koşulsuz yayınla ve kur.",
      "commissionTitle": "Komisyon",
      "commissionPrice": "%15",
      "commissionDesc": "Ücretli satışlardan %15 alırız. Geri kalanı üreticinin. Gizli ücret yok.",
      "proTitle": "Pro",
      "proPrice": "$8/ay",
      "proDesc": "Özel koleksiyonlar, tam kurulum geçmişi ve gelişmiş filtreler. Alım satım için gerekmez."
    },
    "team": {
      "title": "Ekip",
      "body": "Velkina Studio tarafından geliştirildi. Platformumuzu her gün kendimiz kullanıyoruz.",
      "github": "GitHub'da katkılara açığız."
    }
  }
```

- [ ] **Step 3: Rewrite the about page**

Replace the entire contents of `src/app/[locale]/(public)/about/page.tsx` with:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Globe,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { sectionReveal, sectionChild, heroEntrance, heroChild } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

export default function AboutPage() {
  const t = useTranslations("about");
  const reduce = useReducedMotion();

  return (
    <div>
      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={heroEntrance}
          initial={reduce ? "visible" : "hidden"}
          animate="visible"
        >
          <motion.h1
            variants={heroChild}
            className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl lg:text-5xl"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            variants={heroChild}
            className="mt-4 text-base text-fg-muted sm:text-lg"
          >
            {t("hero.subtitle")}
          </motion.p>
        </motion.div>
      </section>

      {/* Problem / Solution */}
      <ScrollReveal>
        <section className="bg-bg-surface py-16 sm:py-20">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
            {/* Problem */}
            <div>
              <h2 className="font-display text-xl font-semibold text-fg sm:text-2xl">
                {t("problem.title")}
              </h2>
              <ul className="mt-6 space-y-4">
                {(["point1", "point2", "point3", "point4"] as const).map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-qs-c" />
                    <span className="text-sm leading-relaxed text-fg-muted">
                      {t(`problem.${key}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Solution */}
            <div>
              <h2 className="font-display text-xl font-semibold text-fg sm:text-2xl">
                {t("solution.title")}
              </h2>
              <ul className="mt-6 space-y-4">
                {(["point1", "point2", "point3", "point4"] as const).map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-qs-a" />
                    <span className="text-sm leading-relaxed text-fg-muted">
                      {t(`solution.${key}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Features 2x2 grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            variants={sectionReveal}
            initial={reduce ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {([
              { icon: Shield, key: "quality" },
              { icon: Users, key: "creators" },
              { icon: Star, key: "reviews" },
              { icon: Globe, key: "crossEnv" },
            ] as const).map(({ icon: Icon, key }) => (
              <motion.div
                key={key}
                variants={sectionChild}
                className="rounded-lg border border-border-soft bg-bg-surface p-6"
              >
                <Icon className="h-5 w-5 text-brand" />
                <h3 className="mt-3 font-display text-base font-semibold text-fg">
                  {t(`features.${key}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {t(`features.${key}Desc`)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Business model */}
      <ScrollReveal>
        <section className="bg-bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("business.title")}
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {([
                { key: "free", accent: false },
                { key: "commission", accent: true },
                { key: "pro", accent: false },
              ] as const).map(({ key, accent }) => (
                <div
                  key={key}
                  className={cn(
                    "rounded-lg border p-6",
                    accent
                      ? "border-brand/30 bg-brand/5"
                      : "border-border-soft bg-bg",
                  )}
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
                    {t(`business.${key}Title`)}
                  </p>
                  <p className="mt-2 font-mono text-2xl font-bold text-fg">
                    {t(`business.${key}Price`)}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                    {t(`business.${key}Desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Team */}
      <ScrollReveal>
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("team.title")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              {t("team.body")}
            </p>
            <p className="mt-2 text-sm text-fg-muted">
              <a
                href="https://github.com/rulesell"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-fg transition hover:text-brand"
              >
                {t("team.github")}
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </p>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
```

- [ ] **Step 4: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**
```bash
git add src/app/[locale]/(public)/about/page.tsx messages/en.json messages/tr.json
git commit -m "feat: redesign About page with problem/solution layout, feature cards, and business model tiers"
```

---

### Task 15: Trust Page Redesign

**Files:**
- Modify: `src/app/[locale]/(public)/trust/page.tsx`
- Modify: `messages/en.json`
- Modify: `messages/tr.json`

- [ ] **Step 1: Add trust page i18n keys to en.json**

In `messages/en.json`, add a new top-level `"trust"` key:

```json
  "trust": {
    "hero": {
      "title": "Trust is engineered, not assumed.",
      "subtitle": "Every signal on the marketplace is earned through automated measurement, not self-reported or crowd-voted."
    },
    "qualityScore": {
      "title": "Quality Score",
      "desc": "A single number (0-100) summarizing five automated signals. It is the default sort on the marketplace — not stars, not downloads.",
      "disclaimer": "Quality scores are currently estimated from automated signals. We are working to improve accuracy."
    },
    "pipeline": {
      "title": "Security pipeline",
      "step1": "Upload",
      "step2": "VirusTotal scan",
      "step3": "Semgrep analysis",
      "step4": "Sandbox test",
      "step5": "Published",
      "paidNote": "Paid items go through an additional manual review before approval."
    },
    "badges": {
      "title": "Badges and marks",
      "itemBadges": "Item badges",
      "itemBadgesDesc": "Badges appear on cards and detail pages. They stack — an item can carry several at once.",
      "creatorMarks": "Creator marks",
      "creatorMarksDesc": "Marks appear on creator avatars and profile pages. They signal who someone is and how they earned their status."
    },
    "reputation": {
      "title": "Reputation levels",
      "desc": "Reputation is earned by contributing to the marketplace. Every verified install, review, and community action adds points.",
      "newcomer": "Newcomer",
      "member": "Member",
      "contributor": "Contributor",
      "trusted": "Trusted",
      "expert": "Expert",
      "authority": "Authority"
    },
    "reviews": {
      "title": "Review integrity",
      "step1": "Install via CLI",
      "step2": "Use the asset",
      "step3": "Write a review",
      "desc": "You cannot review something you have not used. Written reviews are further restricted to Certified Devs."
    }
  }
```

- [ ] **Step 2: Add trust page i18n keys to tr.json**

In `messages/tr.json`, add the matching `"trust"` key:

```json
  "trust": {
    "hero": {
      "title": "Guven muhendislikle insa edilir, varsayilmaz.",
      "subtitle": "Pazaryerindeki her sinyal, otomatik olcumle kazanilir — beyana veya oylara degil."
    },
    "qualityScore": {
      "title": "Kalite Puani",
      "desc": "Bes otomatik sinyali ozetleyen tek bir sayi (0-100). Pazaryerinin varsayilan siralamasi budur — yildizlar veya indirme sayilari degil.",
      "disclaimer": "Kalite puanlari su anda otomatik sinyallerden tahmin edilmektedir. Dogrulugu iyilestirmek icin calisiyoruz."
    },
    "pipeline": {
      "title": "Guvenlik hatti",
      "step1": "Yukleme",
      "step2": "VirusTotal taramasi",
      "step3": "Semgrep analizi",
      "step4": "Korunali alan testi",
      "step5": "Yayinlandi",
      "paidNote": "Ucretli ogeler onaylanmadan once ek bir manuel incelemeden gecer."
    },
    "badges": {
      "title": "Rozetler ve isaretler",
      "itemBadges": "Oge rozetleri",
      "itemBadgesDesc": "Rozetler kartlarda ve detay sayfalarinda gorunur. Birden fazla rozet ayni anda tasanabilir.",
      "creatorMarks": "Uretici isaretleri",
      "creatorMarksDesc": "Isaretler uretici avatarlarinda ve profil sayfalarinda gorunur. Kimin ne oldugunu ve statusunu nasil kazandigini gosterir."
    },
    "reputation": {
      "title": "Itibar seviyeleri",
      "desc": "Itibar, pazaryerine katkida bulunarak kazanilir. Her dogrulanmis kurulum, yorum ve topluluk eylemi puan ekler.",
      "newcomer": "Yeni Uye",
      "member": "Uye",
      "contributor": "Katilimci",
      "trusted": "Guvenilir",
      "expert": "Uzman",
      "authority": "Otorite"
    },
    "reviews": {
      "title": "Yorum butunlugu",
      "step1": "CLI ile kur",
      "step2": "Varligi kullan",
      "step3": "Yorum yaz",
      "desc": "Kullanmadiginiz bir seyi inceleyemezsiniz. Yazili incelemeler Sertifikali Gelistirici statusu gerektirir."
    }
  }
```

- [ ] **Step 3: Rewrite the trust page**

Replace the entire contents of `src/app/[locale]/(public)/trust/page.tsx` with:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Code,
  FileCheck,
  Shield,
  ShieldCheck,
  Star,
  Upload,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { heroEntrance, heroChild, sectionReveal, sectionChild } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

const REPUTATION_LEVELS = [
  { key: "newcomer" as const, points: 0 },
  { key: "member" as const, points: 10 },
  { key: "contributor" as const, points: 50 },
  { key: "trusted" as const, points: 100 },
  { key: "expert" as const, points: 300 },
  { key: "authority" as const, points: 500 },
];

export default function TrustPage() {
  const t = useTranslations("trust");
  const reduce = useReducedMotion();

  return (
    <div>
      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
          variants={heroEntrance}
          initial={reduce ? "visible" : "hidden"}
          animate="visible"
        >
          <motion.div variants={heroChild}>
            <ShieldCheck className="mx-auto h-10 w-10 text-brand" />
          </motion.div>
          <motion.h1
            variants={heroChild}
            className="mt-4 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl lg:text-5xl"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            variants={heroChild}
            className="mt-4 max-w-2xl text-base text-fg-muted"
          >
            {t("hero.subtitle")}
          </motion.p>
        </motion.div>
      </section>

      {/* Quality Score */}
      <ScrollReveal>
        <section className="bg-bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("qualityScore.title")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              {t("qualityScore.desc")}
            </p>

            {/* Visual quality bars */}
            <div className="mt-8 space-y-3">
              {[
                { label: "Token efficiency", score: 91, weight: "25%" },
                { label: "Install success", score: 88, weight: "25%" },
                { label: "Schema cleanliness", score: 95, weight: "20%" },
                { label: "Freshness", score: 78, weight: "15%" },
                { label: "Security scan", score: 82, weight: "15%" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-fg-muted">{m.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-fg-dim">{m.weight}</span>
                      <span className="font-mono font-medium tabular-nums text-fg">
                        {m.score}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-bg-raised">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        m.score >= 85
                          ? "bg-qs-a"
                          : m.score >= 70
                            ? "bg-qs-b"
                            : "bg-qs-c",
                      )}
                      initial={reduce ? { width: `${m.score}%` } : { width: 0 }}
                      whileInView={{ width: `${m.score}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.1,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-fg-dim">
              {t("qualityScore.disclaimer")}
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* Security pipeline */}
      <ScrollReveal>
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("pipeline.title")}
            </h2>

            <motion.div
              className="mt-10 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-0"
              variants={sectionReveal}
              initial={reduce ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {([
                { key: "step1", icon: Upload },
                { key: "step2", icon: Shield },
                { key: "step3", icon: Code },
                { key: "step4", icon: FileCheck },
                { key: "step5", icon: CheckCircle },
              ] as const).map((step, i, arr) => (
                <motion.div
                  key={step.key}
                  variants={sectionChild}
                  className="flex items-center gap-2 sm:flex-col"
                >
                  <div className="flex items-center gap-2 sm:flex-col sm:gap-0">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        i === arr.length - 1
                          ? "bg-qs-a/15 text-qs-a"
                          : "bg-bg-raised text-fg-muted",
                      )}
                    >
                      <step.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium text-fg-muted sm:mt-2">
                      {t(`pipeline.${step.key}`)}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight className="hidden h-4 w-4 text-fg-dim sm:mx-4 sm:block" />
                  )}
                </motion.div>
              ))}
            </motion.div>

            <p className="mt-8 text-center text-xs text-fg-dim">
              {t("pipeline.paidNote")}
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* Reputation levels */}
      <ScrollReveal>
        <section className="bg-bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("reputation.title")}
            </h2>
            <p className="mt-3 text-center text-sm text-fg-muted">
              {t("reputation.desc")}
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {REPUTATION_LEVELS.map((level, i) => (
                <div
                  key={level.key}
                  className={cn(
                    "flex flex-col items-center rounded-lg border p-4",
                    i === REPUTATION_LEVELS.length - 1
                      ? "border-brand/30 bg-brand/5"
                      : "border-border-soft bg-bg",
                  )}
                  style={{ minWidth: "100px" }}
                >
                  <span className="font-mono text-xs tabular-nums text-fg-dim">
                    {level.points}+
                  </span>
                  <span className="mt-1 text-sm font-medium text-fg">
                    {t(`reputation.${level.key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Review integrity */}
      <ScrollReveal>
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("reviews.title")}
            </h2>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
              {(["step1", "step2", "step3"] as const).map((key, i, arr) => (
                <div key={key} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-raised text-fg-muted">
                      <span className="font-mono text-sm font-bold">
                        {i + 1}
                      </span>
                    </div>
                    <span className="mt-2 text-xs font-medium text-fg-muted">
                      {t(`reviews.${key}`)}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight className="hidden h-4 w-4 text-fg-dim sm:block" />
                  )}
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm leading-relaxed text-fg-muted">
              {t("reviews.desc")}
            </p>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
```

- [ ] **Step 4: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**
```bash
git add src/app/[locale]/(public)/trust/page.tsx messages/en.json messages/tr.json
git commit -m "feat: redesign Trust page with quality visuals, security pipeline, and reputation ladder"
```

---

### Task 16: Affiliates Page Redesign

**Files:**
- Modify: `src/app/[locale]/(public)/affiliates/page.tsx`
- Modify: `messages/en.json`
- Modify: `messages/tr.json`

- [ ] **Step 1: Add affiliates page i18n keys to en.json**

In `messages/en.json`, add a new top-level `"affiliates"` key:

```json
  "affiliates": {
    "hero": {
      "title": "Earn by recommending what you actually use.",
      "subtitle": "Share your referral link. If someone buys through it within 30 days, you earn a commission."
    },
    "howItWorks": {
      "title": "How it works",
      "step1": "Sign up for the affiliate program",
      "step2": "Get your unique referral link",
      "step3": "Share with your audience",
      "step4": "Earn commission on every sale"
    },
    "example": {
      "title": "Earnings example",
      "itemPrice": "$19 item",
      "creatorLabel": "Creator",
      "creatorAmount": "$14.54",
      "creatorPercent": "76.5%",
      "platformLabel": "Platform",
      "platformAmount": "$2.85",
      "platformPercent": "15%",
      "affiliateLabel": "You (affiliate)",
      "affiliateAmount": "$1.62",
      "affiliatePercent": "8.5%"
    },
    "personas": {
      "title": "Who it's for",
      "contentTitle": "Content creators",
      "contentDesc": "YouTube reviewers, bloggers, and tutorial authors who recommend dev tools.",
      "newsletterTitle": "Newsletter authors",
      "newsletterDesc": "Tech newsletter writers with audiences who trust their tool recommendations.",
      "communityTitle": "Community leaders",
      "communityDesc": "Discord and Slack community managers who curate resources for members."
    },
    "cta": "Get your referral link",
    "selfReferral": "Self-referral is allowed — if you promote your own items, you earn both creator revenue and the affiliate bonus."
  }
```

- [ ] **Step 2: Add affiliates page i18n keys to tr.json**

In `messages/tr.json`, add the matching `"affiliates"` key:

```json
  "affiliates": {
    "hero": {
      "title": "Gercekten kullandiginiz seyleri onererek kazanin.",
      "subtitle": "Referans linkinizi paylasin. Birisi 30 gun icinde satin alirsa komisyon kazanirsiniz."
    },
    "howItWorks": {
      "title": "Nasil calisir",
      "step1": "Ortaklik programina kaydolun",
      "step2": "Benzersiz referans linkinizi alin",
      "step3": "Kitlenizle paylasin",
      "step4": "Her satista komisyon kazanin"
    },
    "example": {
      "title": "Kazanc ornegi",
      "itemPrice": "$19 oge",
      "creatorLabel": "Uretici",
      "creatorAmount": "$14,54",
      "creatorPercent": "%76,5",
      "platformLabel": "Platform",
      "platformAmount": "$2,85",
      "platformPercent": "%15",
      "affiliateLabel": "Siz (ortak)",
      "affiliateAmount": "$1,62",
      "affiliatePercent": "%8,5"
    },
    "personas": {
      "title": "Kimler icin",
      "contentTitle": "Icerik ureticileri",
      "contentDesc": "Gelistirici araclarini oneren YouTube incelemecileri, bloggerlar ve egitim yazarlari.",
      "newsletterTitle": "Bulten yazarlari",
      "newsletterDesc": "Arac onerilerine guvenilen kitlelere sahip teknoloji bulteni yazarlari.",
      "communityTitle": "Topluluk liderleri",
      "communityDesc": "Uyeler icin kaynaklari derleyen Discord ve Slack topluluk yoneticileri."
    },
    "cta": "Referans linkinizi alin",
    "selfReferral": "Kendi kendinize referans verebilirsiniz — kendi ogelerinizi tanitiyorsaniz hem uretici gelirini hem de ortaklik bonusunu kazanirsiniz."
  }
```

- [ ] **Step 3: Rewrite the affiliates page**

Replace the entire contents of `src/app/[locale]/(public)/affiliates/page.tsx` with:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Link2,
  Megaphone,
  Newspaper,
  Share2,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { heroEntrance, heroChild, sectionReveal, sectionChild } from "@/lib/motion/variants";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "step1" as const, icon: UserPlus },
  { key: "step2" as const, icon: Link2 },
  { key: "step3" as const, icon: Share2 },
  { key: "step4" as const, icon: Wallet },
] as const;

const PERSONAS = [
  { key: "content" as const, icon: Megaphone },
  { key: "newsletter" as const, icon: Newspaper },
  { key: "community" as const, icon: Users },
] as const;

const EARNINGS = [
  { key: "creator", color: "bg-brand", width: "76.5%" },
  { key: "platform", color: "bg-secondary-steel", width: "15%" },
  { key: "affiliate", color: "bg-qs-a", width: "8.5%" },
] as const;

export default function AffiliatesPage() {
  const t = useTranslations("affiliates");
  const reduce = useReducedMotion();

  return (
    <div>
      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={heroEntrance}
          initial={reduce ? "visible" : "hidden"}
          animate="visible"
        >
          <motion.h1
            variants={heroChild}
            className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl lg:text-5xl"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            variants={heroChild}
            className="mt-4 text-base text-fg-muted"
          >
            {t("hero.subtitle")}
          </motion.p>
        </motion.div>
      </section>

      {/* How it works — 4-step flow */}
      <ScrollReveal>
        <section className="bg-bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("howItWorks.title")}
            </h2>

            <motion.div
              className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
              variants={sectionReveal}
              initial={reduce ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.key}
                    variants={sectionChild}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg text-fg-muted">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-1 font-mono text-xs tabular-nums text-fg-subtle">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <p className="mt-2 text-sm font-medium text-fg">
                      {t(`howItWorks.${step.key}`)}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </ScrollReveal>

      {/* Earnings example */}
      <ScrollReveal>
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("example.title")}
            </h2>

            <div className="mt-8 rounded-xl border border-border-soft bg-bg-surface p-6">
              <p className="text-center text-xs font-medium uppercase tracking-wider text-fg-subtle">
                {t("example.itemPrice")}
              </p>

              {/* Stacked horizontal bar */}
              <div className="mt-4 flex h-5 w-full overflow-hidden rounded-full">
                {EARNINGS.map((e) => (
                  <div
                    key={e.key}
                    className={e.color}
                    style={{ width: e.width }}
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="mt-5 space-y-3">
                {EARNINGS.map((e) => (
                  <div
                    key={e.key}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn("h-2.5 w-2.5 rounded-full", e.color)}
                      />
                      <span className="text-sm text-fg-muted">
                        {t(`example.${e.key}Label`)}
                      </span>
                      <span className="text-xs text-fg-dim">
                        {t(`example.${e.key}Percent`)}
                      </span>
                    </div>
                    <span className="font-mono text-base font-bold tabular-nums text-fg">
                      {t(`example.${e.key}Amount`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Personas */}
      <ScrollReveal>
        <section className="bg-bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("personas.title")}
            </h2>

            <motion.div
              className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
              variants={sectionReveal}
              initial={reduce ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {PERSONAS.map((persona) => {
                const Icon = persona.icon;
                return (
                  <motion.div
                    key={persona.key}
                    variants={sectionChild}
                    className="rounded-lg border border-border-soft bg-bg p-6"
                  >
                    <Icon className="h-5 w-5 text-brand" />
                    <h3 className="mt-3 text-sm font-semibold text-fg">
                      {t(`personas.${persona.key}Title`)}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-fg-muted">
                      {t(`personas.${persona.key}Desc`)}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <Link
              href="/dashboard/affiliates"
              className="inline-flex items-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-fg transition hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {t("cta")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <p className="mt-4 text-xs text-fg-dim">
              {t("selfReferral")}
            </p>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
```

- [ ] **Step 4: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**
```bash
git add src/app/[locale]/(public)/affiliates/page.tsx messages/en.json messages/tr.json
git commit -m "feat: redesign Affiliates page with visual earnings breakdown, step flow, and persona cards"
```

---

### Task 17: CLI Page Redesign

**Files:**
- Modify: `src/app/[locale]/(public)/cli/page.tsx`
- Modify: `messages/en.json`
- Modify: `messages/tr.json`

- [ ] **Step 1: Add CLI page i18n keys to en.json**

In `messages/en.json`, add a new top-level `"cli"` key:

```json
  "cli": {
    "hero": {
      "title": "Install AI assets from your terminal.",
      "subtitle": "The CLI detects your environment and writes config to the right file. No copy-paste, no manual setup.",
      "installCommand": "npm install -g @rulesell/cli"
    },
    "gettingStarted": {
      "title": "Getting started",
      "step1Title": "Install the CLI",
      "step1Desc": "Requires Node.js 18+. Open source at github.com/rulesell/cli.",
      "step2Title": "Authenticate",
      "step2Desc": "Run rulesell auth to connect your account. Free assets work without auth.",
      "step3Title": "Install your first asset",
      "step3Desc": "Pick any asset from the marketplace and run the install command."
    },
    "features": {
      "freeTitle": "Free assets",
      "freeDesc": "Install any free asset without authentication. One command, done.",
      "paidTitle": "Paid assets",
      "paidDesc": "CLI opens your browser for OAuth and payment. Token downloads automatically.",
      "envTitle": "Auto-detection",
      "envDesc": "Detects Cursor, Windsurf, Claude Code, VS Code, and more. Override with --env.",
      "commandsTitle": "Full command set",
      "commandsDesc": "Search, list, update, and remove. Everything from your terminal."
    },
    "note": "The CLI package lives at packages/rulesell-cli/ in the monorepo. All commands work against mock data in development. Production release planned for v2."
  }
```

- [ ] **Step 2: Add CLI page i18n keys to tr.json**

In `messages/tr.json`, add the matching `"cli"` key:

```json
  "cli": {
    "hero": {
      "title": "Yapay zeka varliklarini terminalinizden kurun.",
      "subtitle": "CLI ortaminizi algilar ve yapilandirmayi dogru dosyaya yazar. Kopyala-yapistir yok, manuel kurulum yok.",
      "installCommand": "npm install -g @rulesell/cli"
    },
    "gettingStarted": {
      "title": "Baslarken",
      "step1Title": "CLI'yi kurun",
      "step1Desc": "Node.js 18+ gerektirir. github.com/rulesell/cli adresinde acik kaynak.",
      "step2Title": "Kimlik dogrulayin",
      "step2Desc": "Hesabinizi baglamak icin rulesell auth komutunu calistirin. Ucretsiz varliklar kimlik dogrulama gerektirmez.",
      "step3Title": "Ilk varliginizi kurun",
      "step3Desc": "Pazaryerinden herhangi bir varlik secin ve kurulum komutunu calistirin."
    },
    "features": {
      "freeTitle": "Ucretsiz varliklar",
      "freeDesc": "Herhangi bir ucretsiz varligi kimlik dogrulama olmadan kurun. Tek komut, bitti.",
      "paidTitle": "Ucretli varliklar",
      "paidDesc": "CLI, OAuth ve odeme icin tarayicinizi acar. Token otomatik olarak indirilir.",
      "envTitle": "Otomatik algilama",
      "envDesc": "Cursor, Windsurf, Claude Code, VS Code ve daha fazlasini algilar. --env ile gecersiz kilin.",
      "commandsTitle": "Tam komut seti",
      "commandsDesc": "Arama, listeleme, guncelleme ve kaldirma. Her sey terminalinizden."
    },
    "note": "CLI paketi monorepo'da packages/rulesell-cli/ altinda bulunur. Tum komutlar gelistirme ortaminda sahte verilerle calisir. Uretim surumu v2 icin planlanmistir."
  }
```

- [ ] **Step 3: Rewrite the CLI page**

Replace the entire contents of `src/app/[locale]/(public)/cli/page.tsx` with:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Download,
  Globe,
  Key,
  Search,
  Terminal,
  Wallet,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { CodePreview } from "@/components/ruleset/code-preview";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { heroEntrance, heroChild, sectionReveal, sectionChild } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

const TYPED_COMMAND = "npx rulesell add @PatrickJS/awesome-cursorrules";

function useTypingEffect(text: string, speed: number = 50) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setDisplayed(text);
      setDone(true);
      return;
    }
    let i = 0;
    setDisplayed("");
    setDone(false);
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, reduce]);

  return { displayed, done };
}

export default function CliPage() {
  const t = useTranslations("cli");
  const reduce = useReducedMotion();
  const { displayed, done } = useTypingEffect(TYPED_COMMAND, 50);

  return (
    <div>
      {/* Hero with terminal */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={heroEntrance}
          initial={reduce ? "visible" : "hidden"}
          animate="visible"
        >
          <motion.div variants={heroChild}>
            <Terminal className="mx-auto h-10 w-10 text-brand" />
          </motion.div>
          <motion.h1
            variants={heroChild}
            className="mt-4 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl lg:text-5xl"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            variants={heroChild}
            className="mt-4 text-base text-fg-muted"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* Animated terminal preview */}
          <motion.div variants={heroChild} className="mt-8">
            <div className="mx-auto max-w-xl overflow-hidden rounded-lg border border-border-soft bg-zinc-950/80">
              {/* Terminal chrome */}
              <div className="flex items-center gap-1.5 border-b border-border-soft px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                <span className="ml-2 text-[10px] text-fg-dim">terminal</span>
              </div>
              <div className="px-4 py-4">
                <pre className="font-mono text-sm text-zinc-200">
                  <span className="text-qs-a">$</span>{" "}
                  {displayed}
                  {!done && (
                    <span className="animate-pulse text-brand">|</span>
                  )}
                </pre>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Getting started — 3 steps */}
      <ScrollReveal>
        <section className="bg-bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("gettingStarted.title")}
            </h2>

            <motion.div
              className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3"
              variants={sectionReveal}
              initial={reduce ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {([
                { key: "step1", icon: Download },
                { key: "step2", icon: Key },
                { key: "step3", icon: Zap },
              ] as const).map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.key}
                    variants={sectionChild}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg text-fg-muted">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-1 font-mono text-xs tabular-nums text-fg-subtle">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-fg">
                      {t(`gettingStarted.${step.key}Title`)}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">
                      {t(`gettingStarted.${step.key}Desc`)}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </ScrollReveal>

      {/* Feature sections — alternating layout */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-16 px-4 sm:px-6 lg:px-8">
          {/* Free assets */}
          <ScrollReveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12">
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-fg">
                  {t("features.freeTitle")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {t("features.freeDesc")}
                </p>
              </div>
              <div className="flex-1">
                <CodePreview
                  content={`# Install a free item — no auth required
npx rulesell add @PatrickJS/awesome-cursorrules

# The CLI detects your editor:
#   Cursor  → writes to .cursorrules
#   Claude  → writes to ~/.config/claude/mcp_servers.json
#   Windsurf → writes to .windsurfrules`}
                  language="bash"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Paid assets */}
          <ScrollReveal>
            <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-center lg:gap-12">
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-fg">
                  {t("features.paidTitle")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {t("features.paidDesc")}
                </p>
              </div>
              <div className="flex-1">
                <CodePreview
                  content={`# Paid items open your browser for OAuth + payment
npx rulesell add @windsurf-collective/enterprise-cursor-rules

# Flow:
# 1. CLI opens browser → rulesell.com/auth/cli
# 2. Confirm purchase ($29)
# 3. CLI receives token, downloads, writes to target file
# 4. Done — no manual copy-paste`}
                  language="bash"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Environment detection */}
          <ScrollReveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12">
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-fg">
                  {t("features.envTitle")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {t("features.envDesc")}
                </p>
              </div>
              <div className="flex-1">
                <CodePreview
                  content={`# Auto-detect (default)
npx rulesell add @author/slug

# Explicit environment
npx rulesell add @author/slug --env cursor
npx rulesell add @author/slug --env claude-code
npx rulesell add @author/slug --env windsurf

# List available environments for an item
npx rulesell info @author/slug`}
                  language="bash"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Full command set */}
          <ScrollReveal>
            <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-center lg:gap-12">
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-fg">
                  {t("features.commandsTitle")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {t("features.commandsDesc")}
                </p>
              </div>
              <div className="flex-1">
                <CodePreview
                  content={`# Search the marketplace
npx rulesell search "mcp server postgres"

# List installed items
npx rulesell list

# Update all items to latest versions
npx rulesell update

# Remove an installed item
npx rulesell remove @author/slug`}
                  language="bash"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Note */}
      <ScrollReveal>
        <section className="pb-16 sm:pb-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg border border-border-soft bg-bg-surface p-4 text-xs text-fg-muted">
              <p className="font-medium text-fg">Note</p>
              <p className="mt-1">{t("note")}</p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
```

- [ ] **Step 4: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**
```bash
git add src/app/[locale]/(public)/cli/page.tsx messages/en.json messages/tr.json
git commit -m "feat: redesign CLI page with animated terminal hero, getting-started flow, and alternating feature layout"
```

---

### Task 18: Leaderboard Page Polish

**Files:**
- Modify: `src/app/[locale]/(public)/leaderboard/page.tsx`

- [ ] **Step 1: Rewrite the leaderboard page with top-3 podium and stagger animations**

Replace the entire contents of `src/app/[locale]/(public)/leaderboard/page.tsx` with:

```tsx
"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Download, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import type { Category, Ruleset } from "@/types";
import { CATEGORY_META, CATEGORY_ORDER } from "@/constants/categories";
import { LeaderboardRow } from "@/components/marketplace/leaderboard-row";
import { ErrorState } from "@/components/ui/error-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconByName } from "@/components/ui/icon-map";
import { heroEntrance, heroChild, sectionReveal, sectionChild } from "@/lib/motion/variants";
import { useRulesets } from "@/hooks/use-rulesets";
import { formatCount } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function gradeFor(score: number): { letter: string; colorClass: string } {
  if (score >= 85) return { letter: "A", colorClass: "text-qs-a" };
  if (score >= 70) return { letter: "B", colorClass: "text-qs-b" };
  if (score >= 50) return { letter: "C", colorClass: "text-qs-c" };
  return { letter: "—", colorClass: "text-fg-muted" };
}

const PODIUM_STYLES: Record<number, { ring: string; badge: string; size: string }> = {
  0: {
    ring: "ring-2 ring-amber-300/40",
    badge: "bg-amber-300/15 text-amber-300",
    size: "p-5 sm:p-6",
  },
  1: {
    ring: "ring-1 ring-zinc-300/30",
    badge: "bg-zinc-300/15 text-zinc-300",
    size: "p-4 sm:p-5",
  },
  2: {
    ring: "ring-1 ring-orange-400/30",
    badge: "bg-orange-400/15 text-orange-400",
    size: "p-4 sm:p-5",
  },
};

function PodiumCard({ rank, ruleset }: { rank: number; ruleset: Ruleset }) {
  const meta = CATEGORY_META[ruleset.category] ?? {
    label: ruleset.category ?? "Other",
    slug: ruleset.category ?? "other",
    color: "#6b7280",
    accent: "gray",
    icon: "Package",
    description: "",
  };
  const qs = ruleset.qualityScore ?? 0;
  const grade = gradeFor(qs);
  const style = PODIUM_STYLES[rank] ?? PODIUM_STYLES[2]!;
  const installs = (ruleset.downloadCount ?? 0) + (ruleset.purchaseCount ?? 0);

  return (
    <Link
      href={`/r/${ruleset.slug}`}
      className={cn(
        "group flex flex-col rounded-xl border border-border-soft bg-bg-surface transition-all",
        "hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        style.ring,
        style.size,
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-full font-mono text-sm font-bold",
            style.badge,
          )}
        >
          {rank + 1}
        </span>
        {qs > 0 && (
          <span className={cn("font-mono text-xl font-bold tabular-nums", grade.colorClass)}>
            {qs}
            <span className="ml-0.5 text-xs">{grade.letter}</span>
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: `${meta.color}1f`, color: meta.color }}
          aria-hidden
        >
          <IconByName name={meta.icon} className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="line-clamp-1 text-sm font-semibold text-fg group-hover:text-brand">
            {ruleset.title}
          </p>
          <p className="line-clamp-1 text-xs text-fg-muted">
            @{ruleset.author.username}
          </p>
        </div>
      </div>
      {ruleset.description && (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-fg-muted">
          {ruleset.description}
        </p>
      )}
      <div className="mt-auto flex items-center gap-3 pt-3 text-[11px] text-fg-subtle">
        <span className="inline-flex items-center gap-1">
          <Star className="h-3 w-3" />
          <span className="font-mono tabular-nums">
            {(ruleset.avgRating ?? 0).toFixed(1)}
          </span>
        </span>
        <span className="inline-flex items-center gap-1">
          <Download className="h-3 w-3" />
          <span className="font-mono tabular-nums">
            {formatCount(installs)}
          </span>
        </span>
      </div>
    </Link>
  );
}

export default function LeaderboardPage() {
  const t = useTranslations("leaderboard");
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Category | "ALL">("ALL");

  const { data, error, isLoading, mutate } = useRulesets({
    tab: "top",
    sort: "quality",
    pageSize: 50,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "ALL") return data.data;
    return data.data.filter((r) => r.category === filter);
  }, [data, filter]);

  const podium = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero header */}
      <motion.header
        className="space-y-4 text-center"
        variants={heroEntrance}
        initial={reduce ? "visible" : "hidden"}
        animate="visible"
      >
        <motion.h1
          variants={heroChild}
          className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl lg:text-5xl"
        >
          {t("title")}
        </motion.h1>
        <motion.p
          variants={heroChild}
          className="mx-auto max-w-2xl text-base text-fg-muted"
        >
          {t("subtitle")}{" "}
          <a
            href="/about#quality-score"
            className="font-medium text-brand hover:text-brand/80"
          >
            {t("learnMore")}
          </a>
        </motion.p>
      </motion.header>

      {/* Category filter chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <FilterChip
          active={filter === "ALL"}
          onClick={() => setFilter("ALL")}
        >
          {t("filters.all")}
        </FilterChip>
        {CATEGORY_ORDER.map((c) => {
          const meta = CATEGORY_META[c];
          return (
            <FilterChip
              key={c}
              active={filter === c}
              onClick={() => setFilter(c)}
              accent={meta.color}
            >
              {meta.label}
            </FilterChip>
          );
        })}
      </div>

      {error && (
        <ErrorState message={(error as Error)?.message} retry={() => mutate()} />
      )}

      {isLoading && !error && (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-lg border border-border-soft bg-bg-surface/60"
            />
          ))}
        </div>
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <>
          {/* Top 3 podium */}
          <motion.div
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            variants={sectionReveal}
            initial={reduce ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {podium.map((r, i) => (
              <motion.div key={r.id} variants={sectionChild}>
                <PodiumCard rank={i} ruleset={r} />
              </motion.div>
            ))}
          </motion.div>

          {/* Table header (desktop only) */}
          {rest.length > 0 && (
            <div className="hidden grid-cols-[60px_minmax(0,1fr)_180px_140px_100px] gap-4 px-4 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle md:grid">
              <span>{t("rank")}</span>
              <span>{t("asset")}</span>
              <span>{t("author")}</span>
              <span>{t("score")}</span>
              <span className="text-right">{t("downloads")}</span>
            </div>
          )}

          {/* Remaining rows with stagger */}
          <motion.div
            className="space-y-2"
            variants={sectionReveal}
            initial={reduce ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {rest.map((r, i) => (
              <motion.div key={r.id} variants={sectionChild}>
                <LeaderboardRow rank={i + 4} ruleset={r} />
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  accent,
  children,
}: {
  active: boolean;
  onClick: () => void;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        active
          ? "border-brand bg-brand/10 text-brand"
          : "border-border-soft bg-bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
      )}
      style={
        active && accent
          ? {
              borderColor: accent,
              color: accent,
              backgroundColor: `${accent}1a`,
            }
          : undefined
      }
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**
```bash
git add src/app/[locale]/(public)/leaderboard/page.tsx
git commit -m "feat: polish Leaderboard with top-3 podium cards, quality grade badges, and stagger animations"
```

---

### Task 19: Explore Page Enhancement

**Files:**
- Modify: `src/app/[locale]/(public)/explore/page.tsx`

- [ ] **Step 1: Rewrite the explore page with tab crossfade, richer feed, and enhanced showcases**

Replace the entire contents of `src/app/[locale]/(public)/explore/page.tsx` with:

```tsx
"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageSquare, Radio, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { DiscussionList } from "@/components/community/discussion-list";
import { MOCK_DISCUSSIONS } from "@/constants/mock-discussions";
import { MOCK_SHOWCASES } from "@/constants/mock-showcases";
import { MOCK_RULESETS } from "@/constants/mock-data";
import { heroEntrance, heroChild } from "@/lib/motion/variants";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/utils";

type Tab = "feed" | "discussions" | "showcases";

/** Map mock rulesetIds to real production slugs so explore links resolve. */
const MOCK_TO_REAL_SLUG: Record<string, string> = {
  "rs-1": "senior-engineer-cursor-rules",
  "rs-2": "refactoring-patterns-cursor",
  "rs-3": "react-component-architecture",
  "rs-4": "typescript-strict-mode-prompt",
  "rs-5": "api-design-best-practices",
  "rs-6": "security-audit-agent",
  "rs-7": "database-optimization-checklist",
  "rs-8": "api-design-best-practices",
  "rs-9": "react-component-architecture",
  "rs-10": "n8n-lead-scoring-workflow",
  "rs-11": "typescript-strict-mode-prompt",
  "rs-13": "python-code-review-prompt",
  "rs-15": "python-code-review-prompt",
  "rs-20": "security-audit-agent",
  "rs-25": "senior-engineer-cursor-rules",
};

function gradeFor(score: number): { letter: string; colorClass: string } {
  if (score >= 85) return { letter: "A", colorClass: "text-qs-a" };
  if (score >= 70) return { letter: "B", colorClass: "text-qs-b" };
  if (score >= 50) return { letter: "C", colorClass: "text-qs-c" };
  return { letter: "—", colorClass: "text-fg-muted" };
}

export default function ExplorePage() {
  const [tab, setTab] = useState<Tab>("feed");
  const reduce = useReducedMotion();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.header
        className="space-y-2"
        variants={heroEntrance}
        initial={reduce ? "visible" : "hidden"}
        animate="visible"
      >
        <motion.h1
          variants={heroChild}
          className="font-display text-2xl font-bold text-fg sm:text-3xl"
        >
          Explore
        </motion.h1>
        <motion.p variants={heroChild} className="text-sm text-fg-muted">
          Community activity, discussions, and showcases.
        </motion.p>
      </motion.header>

      {/* Tab bar */}
      <div className="mt-6 flex gap-1 border-b border-border-soft">
        <TabButton
          active={tab === "feed"}
          onClick={() => setTab("feed")}
          icon={Radio}
        >
          Feed
        </TabButton>
        <TabButton
          active={tab === "discussions"}
          onClick={() => setTab("discussions")}
          icon={MessageSquare}
        >
          Discussions
        </TabButton>
        <TabButton
          active={tab === "showcases"}
          onClick={() => setTab("showcases")}
          icon={Sparkles}
        >
          Showcases
        </TabButton>
      </div>

      {/* Tab content with crossfade */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {tab === "feed" && (
            <motion.div
              key="feed"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <FeedTab />
            </motion.div>
          )}
          {tab === "discussions" && (
            <motion.div
              key="discussions"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <DiscussionsTab />
            </motion.div>
          )}
          {tab === "showcases" && (
            <motion.div
              key="showcases"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <ShowcasesTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Radio;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative -mb-px inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fg/20",
        active ? "text-fg" : "text-fg-subtle hover:text-fg-muted",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
      {active && (
        <span
          aria-hidden
          className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand"
        />
      )}
    </button>
  );
}

function FeedTab() {
  const items = useMemo(() => {
    const feed = [
      ...MOCK_DISCUSSIONS.slice(0, 8).map((d) => {
        const realSlug = MOCK_TO_REAL_SLUG[d.rulesetId];
        const ruleset = MOCK_RULESETS.find((r) => r.id === d.rulesetId);
        return {
          id: `feed-disc-${d.id}`,
          kind: "discussion" as const,
          title: d.title,
          body: `New discussion on ${ruleset?.title ?? "an item"}`,
          href: realSlug ? `/r/${realSlug}` : null,
          createdAt: d.createdAt,
        };
      }),
      ...MOCK_SHOWCASES.map((s) => {
        const firstId = s.rulesetIds[0];
        const realSlug = firstId ? MOCK_TO_REAL_SLUG[firstId] : null;
        return {
          id: `feed-show-${s.id}`,
          kind: "showcase" as const,
          title: s.title,
          body: `New showcase by @${s.author.username}`,
          href: realSlug ? `/r/${realSlug}` : null,
          createdAt: s.createdAt,
        };
      }),
    ];
    return feed.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, []);

  // Trending sidebar items — use real production slugs
  const trending = useMemo(
    () =>
      [...MOCK_RULESETS]
        .filter((r) => MOCK_TO_REAL_SLUG[r.id])
        .sort((a, b) => b.downloadCount - a.downloadCount)
        .slice(0, 10)
        .map((r) => ({ ...r, slug: MOCK_TO_REAL_SLUG[r.id] ?? r.slug })),
    [],
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-1 divide-y divide-border-soft">
        {items.map((item) => {
          const inner = (
            <>
              <div className="flex items-center gap-2">
                {item.kind === "discussion" ? (
                  <MessageSquare className="h-4 w-4 shrink-0 text-fg-dim" />
                ) : (
                  <Sparkles className="h-4 w-4 shrink-0 text-fg-dim" />
                )}
                <span
                  className={cn(
                    "rounded-full border px-1.5 py-0.5 text-[10px] font-medium",
                    item.kind === "discussion"
                      ? "border-info/30 text-info"
                      : "border-brand/30 text-brand",
                  )}
                >
                  {item.kind === "discussion" ? "discussion" : "showcase"}
                </span>
              </div>
              <div className="mt-1.5 min-w-0 flex-1">
                <p className="line-clamp-1 text-sm text-fg group-hover:text-fg">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-fg-dim">{item.body}</p>
              </div>
              <span className="mt-1.5 shrink-0 text-[10px] text-fg-dim">
                {formatRelative(item.createdAt)}
              </span>
            </>
          );
          return item.href ? (
            <Link
              key={item.id}
              href={item.href}
              className="group flex flex-col py-3 transition hover:bg-bg-surface/50 sm:flex-row sm:items-start sm:gap-3"
            >
              {inner}
            </Link>
          ) : (
            <div
              key={item.id}
              className="flex flex-col py-3 sm:flex-row sm:items-start sm:gap-3"
            >
              {inner}
            </div>
          );
        })}
      </div>

      {/* Trending sidebar */}
      <aside className="hidden lg:block">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Trending this week
        </h3>
        <ul className="mt-3 space-y-2.5">
          {trending.map((r, i) => {
            const qs = r.qualityScore ?? 0;
            const grade = gradeFor(qs);
            return (
              <li key={r.id}>
                <Link
                  href={`/r/${r.slug}`}
                  className="group flex items-baseline gap-2 text-sm"
                >
                  <span className="font-mono text-xs text-fg-dim">
                    {i + 1}
                  </span>
                  <span className="line-clamp-1 flex-1 text-fg-muted group-hover:text-fg">
                    {r.title}
                  </span>
                  {qs > 0 && (
                    <span
                      className={cn(
                        "font-mono text-[10px] tabular-nums",
                        grade.colorClass,
                      )}
                    >
                      {qs}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}

function DiscussionsTab() {
  return <DiscussionList discussions={MOCK_DISCUSSIONS} />;
}

function ShowcasesTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {MOCK_SHOWCASES.map((s) => (
          <div
            key={s.id}
            className="rounded-lg border border-border-soft bg-bg-surface p-5 transition hover:border-border-strong"
          >
            <h3 className="text-sm font-semibold text-fg">{s.title}</h3>
            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-fg-muted">
              {s.description}
            </p>
            <div className="mt-3 flex items-center gap-3 text-[11px] text-fg-dim">
              <span className="font-medium">@{s.author.username}</span>
              <span>{s.reactionCount} reactions</span>
              <span>{formatRelative(s.createdAt)}</span>
            </div>
            {s.rulesetIds.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {s.rulesetIds.map((id) => {
                  const ruleset = MOCK_RULESETS.find((r) => r.id === id);
                  return ruleset ? (
                    <span
                      key={id}
                      className="rounded border border-border-soft bg-bg-raised px-1.5 py-0.5 text-[10px] text-fg-subtle"
                    >
                      {ruleset.title}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-dashed border-border-soft bg-bg-surface/50 p-6 text-center">
        <Sparkles className="mx-auto h-5 w-5 text-brand" />
        <p className="mt-2 text-sm text-fg-muted">
          Built something with a RuleSell asset?
        </p>
        <button
          type="button"
          className="mt-3 rounded-lg border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-medium text-brand transition hover:bg-brand/20"
        >
          Submit a Showcase
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**
```bash
git add src/app/[locale]/(public)/explore/page.tsx
git commit -m "feat: enhance Explore page with tab crossfade, activity badges, quality scores in trending, and enabled showcase CTA"
```

---

### Task 20: Login Page Enhancement

**Files:**
- Modify: `src/app/[locale]/(public)/login/page.tsx`

- [ ] **Step 1: Rewrite the login page with branded styling**

Replace the entire contents of `src/app/[locale]/(public)/login/page.tsx` with:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { heroEntrance, heroChild } from "@/lib/motion/variants";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const t = useTranslations("auth");
  const reduce = useReducedMotion();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
    } else if (res?.url) {
      window.location.href = res.url;
    }
  }

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-4 py-16">
      {/* Subtle background treatment */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 30%, rgba(255, 209, 102, 0.04) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="w-full max-w-sm space-y-6"
        variants={heroEntrance}
        initial={reduce ? "visible" : "hidden"}
        animate="visible"
      >
        {/* Logo */}
        <motion.div variants={heroChild} className="text-center">
          <div className="inline-flex items-center gap-1 text-xl font-bold tracking-tight">
            <span className="font-display text-brand">R</span>
            <span className="font-display text-fg">uleSell</span>
          </div>
          <h1 className="mt-3 text-lg font-semibold text-fg">
            Sign in to RuleSell
          </h1>
        </motion.div>

        {/* OAuth buttons */}
        <motion.div variants={heroChild} className="space-y-2">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => signIn("github", { callbackUrl })}
          >
            <Github className="h-4 w-4" />
            Sign in with GitHub
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => signIn("google", { callbackUrl })}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>
        </motion.div>

        {/* Divider */}
        <motion.div variants={heroChild} className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border-soft" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-bg px-2 text-fg-muted">or</span>
          </div>
        </motion.div>

        {/* Credentials form */}
        <motion.form
          variants={heroChild}
          onSubmit={handleCredentials}
          className="space-y-3"
        >
          {error && (
            <p className="text-center text-sm text-danger">{error}</p>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-border-soft bg-bg-surface px-3 py-2.5 text-sm text-fg placeholder:text-fg-dim transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/50"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-border-soft bg-bg-surface px-3 py-2.5 text-sm text-fg placeholder:text-fg-dim transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/50"
          />
          <Button
            type="submit"
            className="w-full bg-brand text-brand-fg hover:bg-brand/90"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </motion.form>

        <motion.p
          variants={heroChild}
          className="text-center text-xs text-fg-muted"
        >
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand hover:text-brand/80">
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**
```bash
git add src/app/[locale]/(public)/login/page.tsx
git commit -m "feat: enhance Login page with branded wordmark, provider icons, gold focus states, and entrance animation"
```

---

### Task 21: i18n Parity Check + Typecheck + Lint

**Files:**
- Verify: `messages/en.json`
- Verify: `messages/tr.json`
- Verify: all modified source files

- [ ] **Step 1: Run JSON validation on both locale files**
```bash
node -e "
const en = JSON.parse(require('fs').readFileSync('messages/en.json','utf8'));
const tr = JSON.parse(require('fs').readFileSync('messages/tr.json','utf8'));

function getKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? prefix + '.' + k : k;
    if (typeof v === 'object' && v !== null) return getKeys(v, key);
    return [key];
  });
}

const enKeys = new Set(getKeys(en));
const trKeys = new Set(getKeys(tr));

const missingInTr = [...enKeys].filter(k => !trKeys.has(k));
const missingInEn = [...trKeys].filter(k => !enKeys.has(k));

if (missingInTr.length) {
  console.log('MISSING in tr.json:', missingInTr.join(', '));
}
if (missingInEn.length) {
  console.log('MISSING in en.json:', missingInEn.join(', '));
}
if (!missingInTr.length && !missingInEn.length) {
  console.log('PARITY CHECK PASSED: en.json and tr.json have identical key sets');
}
"
```

If the parity check finds mismatches, add the missing keys to the appropriate locale file before proceeding.

- [ ] **Step 2: Run TypeScript check**
```bash
npx tsc --noEmit
```

Fix any type errors found before proceeding.

- [ ] **Step 3: Run lint**
```bash
npm run lint
```

Fix any lint errors found before proceeding.

- [ ] **Step 4: Verify the dev server starts without errors**
```bash
npm run dev &
sleep 5
curl -s -o /dev/null -w '%{http_code}' http://localhost:3000 | grep 200
kill %1
```

- [ ] **Step 5: Commit any fixes**
```bash
git add -A
git commit -m "fix: resolve i18n parity gaps, type errors, and lint issues from Batch 1"
```

---

## Appendix: File Inventory

### New Files Created
| File | Task |
|---|---|
| `src/components/marketing/social-proof-bar.tsx` | 5 |
| `src/components/marketing/how-it-works.tsx` | 6 |
| `src/components/marketing/quality-showcase.tsx` | 7 |
| `src/components/marketing/featured-ruleset-card.tsx` | 8 |
| `src/components/marketing/creator-economics.tsx` | 9 |
| `src/components/marketing/trust-strip.tsx` | 10 |
| `src/components/marketing/community-preview.tsx` | 11 |
| `src/components/marketing/final-cta.tsx` | 12 |

### Modified Files
| File | Tasks |
|---|---|
| `src/styles/tokens.css` | 1, 2 |
| `src/app/globals.css` | 1, 2, 13 |
| `src/app/[locale]/layout.tsx` | 1 |
| `src/lib/motion/variants.ts` | 3 |
| `messages/en.json` | 4, 14, 15, 16, 17 |
| `messages/tr.json` | 4, 14, 15, 16, 17 |
| `src/app/[locale]/(public)/page.tsx` | 13 |
| `src/app/[locale]/(public)/about/page.tsx` | 14 |
| `src/app/[locale]/(public)/trust/page.tsx` | 15 |
| `src/app/[locale]/(public)/affiliates/page.tsx` | 16 |
| `src/app/[locale]/(public)/cli/page.tsx` | 17 |
| `src/app/[locale]/(public)/leaderboard/page.tsx` | 18 |
| `src/app/[locale]/(public)/explore/page.tsx` | 19 |
| `src/app/[locale]/(public)/login/page.tsx` | 20 |

### Untouched (per spec constraints)
- `src/app/api/*`
- `prisma/*`
- `src/lib/auth.ts`
- `src/lib/rate-limit.ts`
- `src/lib/api-client.ts`
- `src/hooks/*` (return shapes unchanged)
- `src/stores/cart-store.ts`
- `src/generated/*`
