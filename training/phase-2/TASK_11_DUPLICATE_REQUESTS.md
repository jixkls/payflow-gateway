# Task 11 — Requisições Duplicadas

## Incidente

Em determinadas situações, o cliente envia novamente uma requisição de criação de transação porque não recebeu a primeira resposta a tempo.

O PayFlow acaba criando duas transações diferentes para a mesma operação.

## Etapa 1 — Investigação

Antes de implementar, escreva uma proposta curta explicando:

1. por que duas requisições iguais podem criar dois registros;
2. quando um cliente pode repetir uma requisição;
3. como o servidor poderia reconhecer uma operação já processada;
4. riscos de simplesmente consultar antes de inserir;
5. solução proposta.

## Etapa 2 — Implementação

Depois da revisão da proposta, altere o fluxo de criação para impedir duplicação indevida da mesma operação lógica.

## Comportamento esperado

- primeira requisição cria/processa normalmente;
- repetição equivalente recebe resultado consistente;
- não é criada segunda transação indevida;
- operações realmente diferentes continuam funcionando.

## Critérios

- persistência real;
- solução não depende de variável global em memória;
- concorrência deve ser considerada;
- banco deve participar da garantia quando necessário;
- testes devem demonstrar repetição da mesma requisição;
- testes devem demonstrar operações diferentes;
- contrato HTTP deve ser documentado.

## Pull Request

Explique:

- problema;
- estratégia escolhida;
- papel do banco;
- comportamento com duas requisições quase simultâneas;
- alternativas consideradas.
