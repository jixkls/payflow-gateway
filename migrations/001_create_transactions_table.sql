-- Migration: 001_create_transactions_table.sql
-- Descrição: Criação da tabela de transações

CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(255) PRIMARY KEY,
    merchant_id VARCHAR(255) NOT NULL REFERENCES merchants(id),
    amount INTEGER NOT NULL CHECK (amount > 0),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_merchant_id ON transactions (merchant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions (status);