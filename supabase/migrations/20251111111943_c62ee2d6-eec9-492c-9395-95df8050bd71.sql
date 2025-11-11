-- Add logo_url column to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Add comment explaining the column
COMMENT ON COLUMN jobs.logo_url IS 'URL to company logo image. Can be auto-generated from company domain or manually set.';