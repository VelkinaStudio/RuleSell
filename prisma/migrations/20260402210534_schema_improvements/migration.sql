-- AlterTable
ALTER TABLE "Report" DROP COLUMN "resolvedBy",
ADD COLUMN     "resolvedById" TEXT;

-- CreateIndex
CREATE INDEX "Collection_userId_isPublic_idx" ON "Collection"("userId", "isPublic");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_userId_slug_key" ON "Collection"("userId", "slug");

-- CreateIndex
CREATE INDEX "Discussion_rulesetId_idx" ON "Discussion"("rulesetId");

-- CreateIndex
CREATE UNIQUE INDEX "Discussion_category_slug_key" ON "Discussion"("category", "slug");

-- CreateIndex
CREATE INDEX "Purchase_status_idx" ON "Purchase"("status");

-- CreateIndex
CREATE INDEX "Ruleset_status_trendingScore_idx" ON "Ruleset"("status", "trendingScore" DESC);

-- CreateIndex
CREATE INDEX "Ruleset_status_createdAt_idx" ON "Ruleset"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Ruleset_authorId_status_idx" ON "Ruleset"("authorId", "status");

-- CreateIndex
CREATE INDEX "RulesetEvent_type_createdAt_idx" ON "RulesetEvent"("type", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RulesetVersion_rulesetId_version_key" ON "RulesetVersion"("rulesetId", "version");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
