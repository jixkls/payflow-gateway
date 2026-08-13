# Task 09 — Gestão de Merchants

## Contexto

O PayFlow precisa cadastrar estabelecimentos que utilizarão o gateway.

## Endpoints

POST /merchants
GET /merchants/:id

## Dados mínimos

Um merchant deve possuir:

- id;
- name;
- email;
- active;
- datas de criação/atualização caso o projeto utilize esse padrão.

## Regras

- name é obrigatório;
- email é obrigatório;
- email deve ser único;
- merchant recém-criado inicia ativo;
- merchant inexistente deve gerar resposta HTTP adequada;
- email duplicado deve gerar resposta HTTP adequada;
- payload inválido deve ser rejeitado antes da persistência.

## Critérios técnicos

- persistência PostgreSQL;
- migration;
- validação;
- tratamento de erro consistente;
- regra de negócio fora da rota/controller;
- tipagem adequada;
- testes;
- documentação mínima da API;
- lint e testes existentes continuam passando.

## Testes mínimos esperados

- criação válida;
- payload inválido;
- email duplicado;
- busca de merchant existente;
- merchant inexistente.

## Pull Request

Explique:

1. como modelou os dados;
2. onde colocou validação;
3. como garantiu email único;
4. como tratou erros;
5. como testar.
