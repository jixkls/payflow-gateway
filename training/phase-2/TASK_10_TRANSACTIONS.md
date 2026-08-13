# Task 10 — Criação de Transações

## Contexto

Merchants cadastrados precisam originar transações.

## Endpoints

POST /transactions
GET /transactions/:id

## Dados mínimos

Uma transação deve possuir:

- id;
- merchant relacionado;
- amount;
- status;
- customerEmail, que pode ser null;
- datas de criação/atualização conforme padrão do projeto.

## Regras

- merchant precisa existir;
- amount deve ser maior que zero;
- status inicial deve ser PENDING;
- customerEmail pode ser null;
- relacionamento deve existir no banco;
- transação inexistente deve gerar resposta HTTP adequada;
- payload inválido deve ser rejeitado.

## Casos mínimos de teste

- merchant válido + valor válido;
- merchant inexistente;
- amount = 0;
- amount negativo;
- customerEmail = null;
- consulta de transação existente;
- consulta de transação inexistente.

## Pull Request

Explique:

- relacionamento entre Merchant e Transaction;
- regra do status inicial;
- tratamento de merchant inexistente;
- casos de borda considerados.
