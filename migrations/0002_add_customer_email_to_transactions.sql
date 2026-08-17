ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
