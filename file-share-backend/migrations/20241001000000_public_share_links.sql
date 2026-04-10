-- Allow recipient_user_id to be NULL so files can be shared anonymously via a public link token.
ALTER TABLE shared_links
    ALTER COLUMN recipient_user_id DROP NOT NULL;

-- Add a public share token column. When set, anyone with this token can download (no account needed).
ALTER TABLE shared_links
    ADD COLUMN IF NOT EXISTS public_share_token UUID DEFAULT NULL;

-- Fast lookup by token.
CREATE INDEX IF NOT EXISTS idx_shared_links_public_share_token
    ON shared_links (public_share_token)
    WHERE public_share_token IS NOT NULL;
