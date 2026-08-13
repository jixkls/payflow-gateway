CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(255) PRIMARY KEY,
  merchant_id VARCHAR(255) NOT NULL REFERENCES merchants(id),
  amount INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255)
);