# Deferred Features

Features that require schema changes or significant backend work before they can be fully implemented.

## Teams

- **Requires**: Team, TeamMember models in prisma/schema.prisma
- **Hooks affected**: use-my-team.ts, use-team.ts
- **SWR keys**: `["my-team"]`, `["team", slug]`
- **Frontend mock**: src/constants/mock-teams.ts
- **Fetcher fallback**: src/lib/api/fetcher.ts (team key uses mock-server)
- **Priority**: Phase 3
