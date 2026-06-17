ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token TEXT DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token_expires_at TIMESTAMPTZ DEFAULT NULL;

-- Existing users are considered verified (they registered before this feature)
UPDATE users SET email_verified = TRUE WHERE email_verified = FALSE AND google_id IS NULL;
