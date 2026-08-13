INSERT INTO merchants (id, name, email)
VALUES
    ('merchant_001', 'Loja Exemplo', 'contato@lojaexemplo.com')
ON CONFLICT (id) DO NOTHING;