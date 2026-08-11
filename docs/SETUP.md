# Ambiente

O projeto requer Node.js 20 ou superior, npm e Docker com suporte a Docker Compose. O PostgreSQL utilizado no desenvolvimento é definido em `docker-compose.yml`.

Use `.env.example` como referência para configurar seu ambiente local. O arquivo `.env` não deve ser commitado. A aplicação valida as variáveis obrigatórias ao iniciar e informa configurações ausentes.

Os comandos disponíveis estão resumidos no `README.md`. Parte do exercício inicial é investigar a preparação e a execução corretas do ambiente.
