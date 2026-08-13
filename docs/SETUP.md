# Ambiente

O projeto requer Node.js 20 ou superior, npm e Docker com suporte a Docker Compose. O PostgreSQL utilizado no desenvolvimento é definido em `docker-compose.yml`.

Use `.env.example` como referência para configurar seu ambiente local. O arquivo `.env` não deve ser commitado. A aplicação valida as variáveis obrigatórias ao iniciar e informa configurações ausentes.

Os comandos disponíveis estão resumidos no `README.md`. Parte do exercício inicial é investigar a preparação e a execução corretas do ambiente.

## Banco de desenvolvimento

```bash
docker compose up -d postgres
npm run db:migrate
```

`npm run db:reset` limpa somente um banco local cujo nome começa com `payflow`. Depois do reset, execute as migrations novamente.

## Banco de testes de integração

O serviço de teste usa uma instância isolada, temporária e exposta na porta `5433`:

```bash
docker compose --profile test up -d postgres-test
npm run db:migrate:test
npm run test:integration
docker compose --profile test down
```

Defina `TEST_DATABASE_URL` conforme o `.env.example`. Para limpar esse banco entre execuções, use `npm run db:reset:test` e reaplique as migrations.
