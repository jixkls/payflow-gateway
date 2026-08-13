# PayFlow Gateway

O PayFlow Gateway é uma API pequena para praticar desenvolvimento backend no domínio de pagamentos. Nesta fase, o repositório oferece uma base funcional de treinamento; ele não processa pagamentos reais.

## Stack

- Node.js 20+
- TypeScript e Express
- PostgreSQL 17 via Docker Compose
- Vitest, ESLint e Prettier

## Requisitos

- Node.js 20 ou superior e npm
- Docker com Docker Compose para os exercícios de banco de dados
- configuração local baseada em `.env.example`

## Scripts

| Comando         | Finalidade                              |
| --------------- | --------------------------------------- |
| `npm run dev`   | inicia a API em modo de desenvolvimento |
| `npm run build` | compila o TypeScript                    |
| `npm start`     | executa a versão compilada              |
| `npm run lint`  | verifica o padrão do código             |
| `npm test`      | executa os testes                       |

Consulte [docs/SETUP.md](docs/SETUP.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/GIT_FLOW.md](docs/GIT_FLOW.md), [docs/INTERNSHIP.md](docs/INTERNSHIP.md) e o material da [Fase 2](training/phase-2/README.md).
