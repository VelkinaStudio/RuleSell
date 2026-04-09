# System Overview

## Current State
- Frontend-only Next.js App Router implementation with mock data
- Route coverage is broad, but many workflows are not backed by real services
- Internationalization is already integrated via `next-intl`

## Planned System Areas
- Web frontend
- Auth and identity
- Marketplace catalog and search
- Checkout and payments
- Seller operations
- Admin moderation
- Email and notifications
- Storage for uploaded assets and previews

## Architectural Reality
The current repo is a presentation layer with implied domain models. Production readiness requires real service boundaries, persistence, validation, and permissions.
