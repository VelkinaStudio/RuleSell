# Backend Handoff: Community Hub

> Frontend uses mock data from `src/constants/mock-polls.ts`, `mock-qa.ts`, `mock-requests.ts`.
> All types defined in `src/types/index.ts` (Poll, QAQuestion, QAAnswer, FeatureRequest).

---

## API Endpoints

### Polls

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/polls` | List polls. Query: `?active=true\|false`, `?category=`, `?page=&pageSize=` |
| POST | `/api/polls` | Create poll. Body: `{ title, description, options: string[], endsAt?, category? }` |
| POST | `/api/polls/[id]/vote` | Vote on a poll option. Body: `{ optionId }`. Toggle: re-voting same option removes vote, different option switches. |

**Response shape (GET /api/polls):**
```json
{
  "data": [Poll],
  "pagination": { "total", "page", "pageSize", "hasNext", "hasPrev" }
}
```

**Vote response:**
```json
{
  "data": { "pollId", "optionId", "voted": true }
}
```

### Q&A

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/qa` | List questions. Query: `?filter=all\|answered\|unanswered`, `?tags=`, `?page=&pageSize=` |
| POST | `/api/qa` | Create question. Body: `{ title, body, tags: string[] }` |
| GET | `/api/qa/[id]` | Get question with answers. |
| POST | `/api/qa/[id]/answers` | Post answer. Body: `{ body }` |
| PUT | `/api/qa/answers/[id]/accept` | Mark answer as accepted. Only question author. Body: `{}` |
| POST | `/api/qa/[id]/vote` | Vote on question. Body: `{ direction: "up" \| "down" }` |
| POST | `/api/qa/answers/[id]/vote` | Vote on answer. Body: `{ direction: "up" \| "down" }` |

**Question response includes:**
```json
{
  "data": {
    "id", "title", "body",
    "author": { "username", "avatarUrl", "reputation" },
    "tags": [], "voteCount", "answerCount", "viewCount",
    "acceptedAnswerId", "createdAt",
    "answers": [QAAnswer]
  }
}
```

### Feature Requests

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/requests` | List requests. Query: `?status=open\|claimed\|completed\|declined`, `?sort=hot\|new\|top`, `?page=&pageSize=` |
| POST | `/api/requests` | Create request. Body: `{ title, description, tags: string[] }` |
| POST | `/api/requests/[id]/vote` | Toggle upvote. No body needed. |
| POST | `/api/requests/[id]/claim` | Claim request to build. Sets `claimedBy` to current user, status to `claimed`. |

**Claim response:**
```json
{
  "data": { "requestId", "status": "claimed", "claimedBy": "username" }
}
```

### Discussion Extensions

The existing Discussion model needs these additions:

| Field | Type | Description |
|-------|------|-------------|
| `voteCount` | `Int` | Replaces `reactionCount` as the primary metric |
| `sortScore` | `Float` | Precomputed hot-sort score, updated on vote/reply |

New sort options for `GET /api/discussions`: `?sort=hot|new|top`

---

## Prisma Models Needed

```prisma
model Poll {
  id          String       @id @default(cuid())
  title       String
  description String
  category    String?
  authorId    String
  author      User         @relation(fields: [authorId], references: [id])
  options     PollOption[]
  votes       PollVote[]
  totalVotes  Int          @default(0)
  isActive    Boolean      @default(true)
  endsAt      DateTime?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model PollOption {
  id        String     @id @default(cuid())
  pollId    String
  poll      Poll       @relation(fields: [pollId], references: [id], onDelete: Cascade)
  text      String
  voteCount Int        @default(0)
  votes     PollVote[]
}

model PollVote {
  id        String     @id @default(cuid())
  pollId    String
  poll      Poll       @relation(fields: [pollId], references: [id], onDelete: Cascade)
  optionId  String
  option    PollOption @relation(fields: [optionId], references: [id], onDelete: Cascade)
  userId    String
  user      User       @relation(fields: [userId], references: [id])
  createdAt DateTime   @default(now())

  @@unique([pollId, userId])
}

model QAQuestion {
  id               String     @id @default(cuid())
  title            String
  body             String     @db.Text
  authorId         String
  author           User       @relation("QAQuestionsAuthored", fields: [authorId], references: [id])
  tags             String[]
  voteCount        Int        @default(0)
  viewCount        Int        @default(0)
  acceptedAnswerId String?
  answers          QAAnswer[]
  votes            QAVote[]   @relation("QuestionVotes")
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt
}

model QAAnswer {
  id         String     @id @default(cuid())
  questionId String
  question   QAQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)
  body       String     @db.Text
  authorId   String
  author     User       @relation("QAAnswersAuthored", fields: [authorId], references: [id])
  voteCount  Int        @default(0)
  isAccepted Boolean    @default(false)
  votes      QAVote[]   @relation("AnswerVotes")
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
}

model QAVote {
  id         String      @id @default(cuid())
  userId     String
  user       User        @relation(fields: [userId], references: [id])
  questionId String?
  question   QAQuestion? @relation("QuestionVotes", fields: [questionId], references: [id], onDelete: Cascade)
  answerId   String?
  answer     QAAnswer?   @relation("AnswerVotes", fields: [answerId], references: [id], onDelete: Cascade)
  direction  Int         // 1 or -1
  createdAt  DateTime    @default(now())

  @@unique([userId, questionId])
  @@unique([userId, answerId])
}

model FeatureRequest {
  id               String   @id @default(cuid())
  title            String
  description      String   @db.Text
  authorId         String
  author           User     @relation(fields: [authorId], references: [id])
  voteCount        Int      @default(0)
  status           String   @default("open") // open, claimed, completed, declined
  claimedById      String?
  claimedBy        User?    @relation("ClaimedRequests", fields: [claimedById], references: [id])
  linkedRulesetId  String?
  linkedRuleset    Ruleset? @relation(fields: [linkedRulesetId], references: [id])
  tags             String[]
  commentCount     Int      @default(0)
  votes            FeatureRequestVote[]
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model FeatureRequestVote {
  id        String         @id @default(cuid())
  requestId String
  request   FeatureRequest @relation(fields: [requestId], references: [id], onDelete: Cascade)
  userId    String
  user      User           @relation(fields: [userId], references: [id])
  createdAt DateTime       @default(now())

  @@unique([requestId, userId])
}
```

---

## Auth Requirements

- **Polls**: Anyone can view. Authenticated users can vote and create.
- **Q&A**: Anyone can view. Authenticated users can post questions/answers. Only question author can accept answers.
- **Feature Requests**: Anyone can view. Authenticated users can vote and create. Only the claiming user or admins can mark as completed.
- **Votes**: One vote per user per item. Toggle behavior (vote again = remove vote).

## Hot Sort Algorithm

Used for discussions and feature requests:

```
hotScore = (voteCount + replyCount * 2) / (ageInDays + 2) ^ 1.5
```

Precompute `sortScore` on each vote/reply event and store in the row for efficient ORDER BY.
