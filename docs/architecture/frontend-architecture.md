# Frontend Architecture

## Current Structure
- `src/app/[locale]/` for all locale-routed pages
- `src/components/` split across landing, layout, marketplace, shared, and ui
- `src/constants/mock-data.ts` as the current data source
- `src/stores/cart-store.ts` for persisted cart UI state
- `messages/en.json` and `messages/tr.json` for translations

## Architectural Guidance
- Keep route-level pages thin and push reusable UI into components.
- Keep marketing-specific sections isolated from core application flows.
- Introduce feature-level folders as real backend-driven functionality expands.
- Avoid coupling future API models directly to mock-data shapes without review.

## High-Risk Areas
- buyer dashboard and seller dashboard once real data flows arrive
- moderation/admin flows because they imply permissions and operational complexity
- search because mock-data filtering will not match production search behavior
