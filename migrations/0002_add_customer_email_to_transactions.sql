-- Adiciona a coluna de e-mail do cliente (opcional) na tabela existente
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255) NULL;