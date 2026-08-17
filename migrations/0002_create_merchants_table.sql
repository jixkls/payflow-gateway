ALTER TABLE merchants
  ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'merchants_email_key'
  ) THEN
    ALTER TABLE merchants ADD CONSTRAINT merchants_email_key UNIQUE (email);
  END IF;
END $$;