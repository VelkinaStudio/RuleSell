# RuleSell Copy Audit — 2026-04-09

Every piece of text on the current site that violates "truthful, honest, no BS, no fake data."

## RED — Must fix before showing anyone

1. **"Search 2,847 verified assets"** (hero search placeholder)
   - We have 60 mock items. 2,847 is fabricated.
   - Fix: "Search verified assets..." (no count) or "Search 60 items..." (real count)

2. **All download/install counts** (86.5K, 40.6K, 31.4K, etc.)
   - These are fabricated fixture values. No real install data exists.
   - Fix: Either remove counts until real data exists, or label "Demo" prominently

3. **All star ratings** (4.9, 4.8, 4.7, etc.)
   - Fabricated. No real reviews exist. Perfect ratings are the classic fake-marketplace signal.
   - Fix: Remove ratings until real reviews are written, or show "No ratings yet"

4. **All quality scores** (QS 98, QS 97, etc.)
   - Pre-computed fixtures, not measured. Looks like real measurement but isn't.
   - Fix: Label as "Estimated" or remove until real measurement exists

5. **Mock users** (@claire-dubois, @helena-costa, @noa-bar-lev, etc.)
   - Fabricated people. "Curated by @claire-dubois" implies a real person curated this.
   - Fix: Use real GitHub usernames from the actual repos, or label as "Demo account"

6. **Discussion counts** ("8 replies · 2d ago")
   - Mock discussion activity pretending to be real community engagement.
   - Fix: Remove discussions section until real discussions exist, or label "Seeded"

7. **Showcase reactions** ("142 reactions")
   - Fabricated engagement.
   - Fix: Same as discussions

## YELLOW — Needs clarity / explanation pages

8. **No badge/trust explanation page**
   - Users see "Verified", "Maintainer Verified", "Quality A/B/C" but there's nowhere that explains what these mean or how to earn them.
   - Fix: Create /trust or /badges page with honest explanations

9. **No affiliate program page**
   - Nalba wants this. It doesn't exist yet.
   - Fix: Create /affiliates page

10. **No "About" or "How it works" page**
    - Users don't know what RuleSell is, who built it, or how it works.
    - Fix: Create /about with honest explanation of the business model

11. **"paid out 85/15"** in the hero subtitle
    - This is accurate per our spec but most visitors won't know what it means.
    - Fix: Either remove from subtitle or link to an explanation

## GREEN — Already honest

- Footer links (Browse, Terms, Privacy, GitHub) — accurate
- Cookie banner text — accurate and compliant
- CLI documentation page — honest about capabilities and flow
- Legal pages — marked as placeholder text pending counsel review
- Product descriptions — well-written, specific, not exaggerated
- Tool picker pills — accurate tool names
