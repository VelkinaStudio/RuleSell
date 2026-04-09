# Release Checklist

## Before Shipping
- `npm run ci` passes locally
- `npm run qa:browser` passes against localhost or the intended preview URL
- `npm run qa:a11y` passes against localhost or the intended preview URL
- `npm run qa:visual` passes, or baselines are intentionally refreshed with `npm run qa:visual:update`
- GitHub Actions CI is green for the branch or PR
- translations updated in both locales
- loading, empty, error, and validation states reviewed
- responsive behavior checked
- keyboard and focus behavior checked
- reduced-motion behavior checked
- visual regressions reviewed
- performance impact reviewed for heavy media or motion
- Vercel preview or production deployment path reviewed
- docs and breadcrumb updated

## Before Major Architecture Changes
- update relevant docs in `docs/`
- log the rationale in `docs/research/decision-log.md`
- note risks and follow-up work in `BREADCRUMB.md`
