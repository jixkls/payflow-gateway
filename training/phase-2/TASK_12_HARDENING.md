# Task 12 — Hardening do Fluxo de Transações

## Objetivo

Revisar o fluxo de merchants e transações criado nas tasks anteriores e melhorar confiabilidade e manutenção.

## 1. Testes de regressão

Cobrir regras importantes, incluindo:

- merchant duplicado;
- merchant inexistente;
- valor inválido;
- transação válida;
- repetição da mesma operação;
- consulta de recurso inexistente.

## 2. Erros

Revisar o fluxo para evitar:

- stack trace enviado ao cliente;
- mensagens inconsistentes;
- HTTP 500 em erros previsíveis;
- perda de contexto útil no servidor.

## 3. Logs

Adicionar logs úteis ao fluxo de transação.

Os logs devem ajudar a identificar:

- operação;
- etapa;
- recurso envolvido;
- categoria do erro.

Não registrar segredos.

## 4. Refactor

Escolha ao menos um ponto com:

- duplicação;
- acoplamento;
- responsabilidade excessiva;
- legibilidade ruim.

Faça um refactor pequeno sem alterar o comportamento externo.

## Pull Request

Adicionar seção:

### Antes / Depois

Explicando:

1. fragilidade encontrada;
2. risco real;
3. mudança realizada;
4. testes que protegem o comportamento.
