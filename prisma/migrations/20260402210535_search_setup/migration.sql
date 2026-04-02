-- Enable pg_trgm extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add tsvector column to Ruleset (not managed by Prisma)
ALTER TABLE "Ruleset" ADD COLUMN IF NOT EXISTS "searchVector" tsvector;

-- Create GIN index for full-text search
CREATE INDEX IF NOT EXISTS ruleset_search_idx ON "Ruleset" USING GIN("searchVector");

-- Create trigram indexes for fuzzy matching
CREATE INDEX IF NOT EXISTS ruleset_title_trgm_idx ON "Ruleset" USING GIN("title" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS ruleset_description_trgm_idx ON "Ruleset" USING GIN("description" gin_trgm_ops);

-- Trigger function to update searchVector on insert/update
CREATE OR REPLACE FUNCTION update_ruleset_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW."searchVector" := to_tsvector('english',
    coalesce(NEW."title", '') || ' ' ||
    coalesce(NEW."description", '') || ' ' ||
    coalesce(NEW."previewContent", '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on Ruleset table
DROP TRIGGER IF EXISTS ruleset_search_vector_trigger ON "Ruleset";
CREATE TRIGGER ruleset_search_vector_trigger
  BEFORE INSERT OR UPDATE OF "title", "description", "previewContent"
  ON "Ruleset"
  FOR EACH ROW
  EXECUTE FUNCTION update_ruleset_search_vector();

-- Backfill existing rows
UPDATE "Ruleset" SET "title" = "title" WHERE "searchVector" IS NULL;
