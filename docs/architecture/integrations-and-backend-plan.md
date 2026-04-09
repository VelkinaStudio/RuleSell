# Integrations and Backend Plan

## Likely Core Integrations
- Auth provider
- Primary database
- File storage
- Payments and payouts
- Search engine
- Transactional email
- Analytics and error tracking

## Current Suggested Direction
- Auth and database: Supabase or comparable managed stack
- Payments: Stripe with Connect if multi-seller payouts remain part of the plan
- Search: Meilisearch or another marketplace-appropriate search layer
- Email: Resend or equivalent transactional provider

## Open Questions
- How strict should seller verification be before first listing?
- What digital delivery and refund policy should be supported technically?
- What audit trail is required for moderation and disputes?
