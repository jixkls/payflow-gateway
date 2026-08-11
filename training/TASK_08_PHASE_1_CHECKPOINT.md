# Task 08 — Checkpoint Fase 1

Implemente:

```ts
async function loadPaidTransactions(): Promise<string[]>;
```

A função deve consultar:

```text
GET /transactions
```

## Regras

1. buscar as transações;
2. tratar erro HTTP;
3. manter apenas transações `PAID`;
4. ignorar transações sem `customerEmail`;
5. retornar strings no formato:

```text
tx_001 | R$ 100.00 | ana@email.com
```

## Critérios de aceite

- sem `any` desnecessário;
- retorno corretamente tipado;
- erros HTTP tratados;
- valores `null` tratados;
- uso consciente de métodos de array;
- função pequena e legível;
- lint e testes existentes continuam passando.

## Pull Request

Na descrição, explique:

- como a função funciona;
- por que escolheu os métodos de array utilizados;
- como tratou `customerEmail = null`;
- como tratou respostas HTTP com erro.
