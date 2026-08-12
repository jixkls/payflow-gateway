-- Seed: transações de exemplo
-- Rodar apenas em ambiente de desenvolvimento/teste

INSERT INTO transactions (id, merchant_id, amount, status)
VALUES
    ('tx_001', 'merchant_001', 1500, 'PAID'),
    ('tx_002', 'merchant_001', 3000, 'PENDING')
ON CONFLICT (id) DO NOTHING;