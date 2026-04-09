# Foundation Traps

> Self-review of the Phase 0-4 foundation by builder-core.
> Read this **before** importing from `src/lib/api`, `src/components/providers`,
> or `src/hooks/use-*`. Each trap is something the foundation does that is
> *not obviously wrong* but will bite a downstream phase if used naively.
>
> Listed in rough order of "how likely you are to hit it". Bug-tier traps
> first, ergonomics traps second.

---

## 🔴 Bug-tier traps (will produce wrong behavior)

### 1. `useSession()` has no real `loading` state

**File:** `src/components/providers/auth-provider.tsx` (lines 55-78)
**Trap:** The provider computes `status` as `data.user ? "authenticated" : "unauthenticated"`. There is no `"loading"` branch even though the type union and the default context value both include it.

**Why it bites:**
- On the server: `getServerSnapshot()` returns `"visitor"` → user=null → status=`unauthenticated`
- On the first client render: same value, no flash
- After mount: `readPersona()` reads localStorage → if a persona is saved, user becomes a real user → status=`authenticated`

A builder who writes the textbook pattern:

```tsx
const { data, status } = useSession();
if (status === "loading") return <Skeleton />;
if (status === "unauthenticated") return <SignInCTA />;
return <Dashboard user={data.user} />;
```

…will render `<SignInCTA />` for one frame on every page load for authenticated users, then snap to the dashboard. **Avoid the loading branch entirely** or use `useSyncExternalStore` directly with your own pending state.

**How to apply:** treat `status` as binary (authenticated / unauthenticated). If you need a real loading state for protected routes, gate the render on whether the persona has been hydrated (you can check via the `persona` field on `useAuthContext()` and a separate `useEffect` to detect hydration — or just live with the one-frame flash, which is what the cookie banner does).

---

### 2. `readPersona()` blindly casts localStorage to `Persona`

**File:** `src/lib/auth/mock-session.ts` (line 59)
**Trap:** `return raw as Persona;` — no validation. If localStorage contains `"foo"` (manual edit, leftover from older schema, browser extension), `getMockSession("foo")` falls into the final branch which does `PERSONA_USERNAME["foo"]` → `undefined` → `MOCK_USERS[0]` (a buyer with no privileges).

**Why it bites:** A user reports "I switched to maintainer but I'm seeing buyer permissions" and you spend 20 minutes debugging the persona switcher when the actual problem is a stale localStorage key from a previous session.

**How to apply:** When implementing the dev persona switcher (Phase 11), add a validation step:

```ts
const VALID: readonly Persona[] = ["visitor","user","pro","builder","seller","certified","maintainer","admin"];
function readPersona(): Persona {
  if (typeof window === "undefined") return "visitor";
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return VALID.includes(raw as Persona) ? (raw as Persona) : "visitor";
}
```

I would have done this on day one if I'd been thinking about it. Fix it when you build the persona switcher.

---

### 3. `IconByName` silently falls back to `<Tag>` for unknown icons

**File:** `src/components/ui/icon-map.tsx` (lines 47-89, 101-104)
**Trap:** ICONS is a closed map of 38 lucide icons. If you add a new badge (`ITEM_BADGE_META`), category (`CATEGORY_META`), or environment (`ENVIRONMENT_META`) with an icon name that is **not** in this map, `IconByName` and `lookupLucideIcon` both fall back to `<Tag>` with no warning.

**Why it bites:** You add a new category like `WEBHOOK` with `icon: "Webhook"`. You publish. Card looks weird. You eventually find a tag icon where the webhook icon should be.

**How to apply:** Whenever you add to `CATEGORY_META`, `ITEM_BADGE_META`, `CREATOR_MARK_META`, or `ENVIRONMENT_META` with a new icon name, **also** add the import + map entry to `src/components/ui/icon-map.tsx`. The lint rule `react-hooks/static-components` is the reason this is a closed set; you can't just `dynamic()` import by string.

If the parallel builders are adding lots of icons, consider expanding the map preemptively from the full lucide tree. Or convert `XxxMeta.icon` from a string to a `LucideIcon` reference and avoid the lookup entirely. Either is fine.

---

### 4. `useRulesets()` re-runs on every render unless you memoize the query

**File:** `src/hooks/use-rulesets.ts` (line 9)
**Trap:** `query: RulesetQuery = {}` creates a fresh `{}` object every call. SWR's default `compare` keys on `JSON.stringify(key)` so `useRulesets()` and `useRulesets({})` dedupe correctly across mounts of the same component, BUT inside a single component re-render, the SWR key array `["rulesets", query] as const` is also fresh on every render.

In practice SWR handles this fine because the *serialized* key is identical. But if a builder constructs the query inline:

```tsx
function MyShelf({ envFilter }: { envFilter: Environment | undefined }) {
  // Fresh object every render — fine for SWR cache key but wasteful
  const { data } = useRulesets({ environment: envFilter, tab: "top" });
}
```

…and then a parent re-renders for an unrelated reason, the key string is recomputed every render. Not a correctness bug. The trap is the **other way around**: if you build the query inline with a `useState`-derived value that *changes*, the new key is correct and SWR refetches. If you derive it from a function call that returns a fresh equivalent object on each render, SWR will still correctly dedupe — but **only because of stringification**. Don't rely on referential equality.

**How to apply:** For complex queries that include arrays or nested objects, wrap in `useMemo`:

```tsx
const query = useMemo(
  () => ({ environment: envFilter, tab: "top" as const }),
  [envFilter],
);
const { data } = useRulesets(query);
```

For simple flat queries, inline is fine. The bug only bites if you start passing arrays as query values (like a future `tags: string[]` filter) — those serialize differently if order changes.

---

### 5. `compareForSort` returns `null` for unknown sorts → silent fall-through

**File:** `src/lib/api/mock-server.ts` (lines 58-73, 137-147)
**Trap:** If a builder passes `sort: "foo" as RulesetSort` (or after a refactor adds a new sort to `RulesetSort` but forgets to update `compareForSort`), the function returns `null` and the items get sorted by `id` only.

**Why it bites:** "Why is my new `sort=newest_with_quality_tiebreaker` returning items in random ID order?"

**How to apply:** When you add a new value to `RulesetSort` in `src/lib/api/types.ts`, also add a case to `compareForSort` in `mock-server.ts`. Or — better — make `RulesetSort` a `satisfies` type so adding a value forces a tsc error in the switch.

---

## 🟡 Ergonomics traps (won't break things, will waste your time)

### 6. Cookie banner flashes for one frame on every page load

**File:** `src/hooks/use-cookie-consent.ts` + `src/components/compliance/cookie-banner.tsx`
**Trap:** `getServerSnapshot()` returns `null`, so SSR HTML always includes the banner. On hydration, `readConsent()` reads localStorage and the banner unmounts. Returning users see the banner for ~1 frame on every navigation.

**Why it bites:** Visual reviewer says "the cookie banner flickers". You think it's a CSS issue. It's not — it's the SSR-vs-client snapshot mismatch baked into `useSyncExternalStore`.

**How to apply:** When polishing for the visual gate (Phase 12), either:
1. Render the banner with `opacity: 0` initially and add a `useEffect` to fade it in only after we know consent is null. CSS-only solution.
2. Add a server-side cookie read in the layout and pass `initialConsent` as a prop. Real fix but means changing the layout.

Don't try to "fix" it by removing `getServerSnapshot` — you'll get a hydration mismatch warning instead.

---

### 7. Mutable arrays for "constants"

**File:** `src/constants/categories.ts` (line 89), `src/constants/environments.ts` (line 130), `src/constants/mock-data.ts` (line 1100ish — `MOCK_RULESETS`)
**Trap:** `CATEGORY_ORDER`, `ENVIRONMENT_ORDER`, `MOCK_RULESETS` are typed as `Category[]`, `Environment[]`, `Ruleset[]`. They're not `as const` and not `readonly`. A consumer can `.push()`, `.sort()`, or `.splice()` them and corrupt shared state for everything else in the bundle.

**Why it bites:** Builder writes `const sorted = MOCK_RULESETS.sort(...)` (in-place sort) thinking it's immutable. Now every other file that imports MOCK_RULESETS gets the sorted version.

**How to apply:** Always copy before mutating:
```ts
const sorted = [...MOCK_RULESETS].sort(...)
```
The mock-server already does this on line 82. Follow that pattern. Phase 12 cleanup could mark these `readonly` to enforce it.

---

### 8. Mock API does not respect `currentUserAccess`

**File:** `src/lib/api/mock-server.ts` (no relevant code — that's the problem)
**Trap:** `listRulesets({ price: "free" })` filters by `r.price === 0` — strict price comparison. A subscription item the user already has access to (price > 0 but `currentUserAccess === "SUBSCRIPTION_ACTIVE"`) is excluded from the "free" tab. Vice versa for `currentUserAccess === "FREE_DOWNLOAD"` on items that are technically priced.

**Why it bites:** User has a Pro subscription. Goes to /browse/free. Doesn't see the items they can install for free. Confusing.

**How to apply:** This is a v2 question. For v1, the spec says "free filter = price 0" and "paid filter = price > 0" so the current behavior matches the spec. If you encounter a story like "show me everything I can install for free" treat it as a separate filter (`accessLevel=installable`) rather than overloading `price`.

---

### 9. `getAnalyticsOverview` makes up the "last 30 days" number

**File:** `src/lib/api/mock-server.ts` (lines 240-241)
**Trap:** `last30dInstalls = Math.round(totalInstalls * 0.06)` — completely fabricated. There's no time-series data in the mock. Builders building dashboard charts will hit a wall when they want to show install velocity over time.

**How to apply:** If the dashboard task wants real-looking trend data, you'll need to either:
- Add a `recentInstalls: { date: string; count: number }[]` field to the User or Ruleset mock (additive to schema, not a problem)
- Generate it on the fly with a deterministic seed based on userId so charts don't jitter on every render

Don't try to back-calculate from the existing scalar fields — there's nothing to back-calculate from.

---

### 10. SWR `dedupingInterval: 5000` means stale data after toggling personas

**File:** `src/components/providers/swr-provider.tsx` (line 16)
**Trap:** Persona switcher writes to localStorage and dispatches an event → AuthProvider's `useSyncExternalStore` re-renders → child components re-render with the new `data.user`. BUT the SWR cache is keyed by query, NOT by user, so any cached `useRulesets` or `useUser` result from before the switch is still in the cache for the next 5 seconds.

**Why it bites:** Switch persona, immediately navigate to /dashboard, see the OLD persona's data for 5 seconds.

**How to apply:** In the persona switcher (Phase 11), call `mutate(() => true, undefined, { revalidate: true })` from SWR after writing the new persona. That clears the entire cache. Or — cleaner — include `persona` as a key prefix in every SWR hook. The first option is one line; the second requires touching every hook.

---

## 🟢 Minor / informational

### 11. The 3 dormant legacy lib files have `// @ts-nocheck`

Team-lead added `@ts-nocheck` to `src/lib/auth.ts`, `src/lib/email.ts`, `src/lib/supabase.ts` (commit `e771bf4`). They're kept per spec §14 but reference deleted modules. **Do not remove the @ts-nocheck**. If you need real auth/email/storage, build new modules in `src/lib/auth/`, `src/lib/email/`, `src/lib/storage/` (note the directory shape) — leave the legacy single files alone.

### 12. `src/proxy.ts` is the new middleware

Team-lead renamed `middleware.ts` → `src/proxy.ts` (commit `c3ce3e4`). This is the Next 16 convention (the old `middleware` filename is deprecated). The matcher is `["/((?!api|_next|_vercel|.*\\..*).*)"]`. **Do not add a new middleware.ts.** Add to `src/proxy.ts` if you need pre-cache request interception (GPC header reading, geo-block redirect, etc).

### 13. Token contrast ratios documented

`src/styles/tokens.css` has hand-verified contrast targets in comments:
- `--fg` (#fafafa) on `--bg-surface` (#18181b): very high
- `--fg-muted` (#a1a1aa) on `--bg-surface`: 8.0:1 (passes AA + AAA)
- `--fg-subtle` (#8b8b94) on `--bg-surface`: 4.7:1 (passes AA, fails AAA)

If you introduce a new background color, recheck contrast for `--fg-subtle` against it. The original `#71717a` failed and Lighthouse caught it.

### 14. Reduced motion is honored at the CSS variable level

Motion durations (`--duration-fast/base/slow`) collapse to `0.01ms` under `prefers-reduced-motion: reduce`. framer-motion components ALSO check `useReducedMotion()` and bypass animation entirely. Both are correct — the CSS layer covers things framer-motion doesn't touch (CSS transitions, animations).

If you write a new motion component, do BOTH: use the `--duration-*` variables AND check `useReducedMotion()` at the React layer.

### 15. Tests live next to the code

`*.test.ts` files sit next to their target (`src/lib/quality/score.test.ts`, `src/lib/api/mock-server.test.ts`). Vitest config picks them up via `src/**/*.test.ts`. Don't put tests in a separate `__tests__` or `tests/` directory or they will silently not run.

---

## When in doubt

Read `gotchas.md` in `C:/Users/nalba/.claude/projects/D--RulesetMarketplace-master/memory/` for tooling gotchas (Write tool hangs on big files, vercel plugin skill noise, etc).

The plan file (`docs/superpowers/plans/2026-04-08-rulesell-rebuild-plan.md`) is the source of truth for file paths. The spec file (`docs/superpowers/specs/2026-04-08-rulesell-rebuild-design.md`) is the source of truth for the data model and IA.

If something in this list looks wrong now, it's possible the foundation has moved on since I wrote this. Ping team-lead and route to builder-core for repair — that's the standing arrangement.
