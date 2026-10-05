import type { ProjectConfig } from '../../../../types.js'
import { capitalizeFirstLetter } from "../../readme.generator.js";

export const fastifyStandAloneMd = (options: ProjectConfig)=>{
    const nameServer = capitalizeFirstLetter(options.selectedServer)
   
    return `
# Api \`${options.projectName}\` (${nameServer} REST API)

## Summary

A minimal, scalable REST API starter built with **${nameServer}** and **TypeScript** (strict, ESM). It ships with environment configuration, structured logging, centralized error handling, request validation, and testing out of the box — **without any database dependency**. The \`user\` feature is included only as a working example of the feature-module pattern.


### Architecture Overview

> This project is a **purely experimental / learning template**. Use it as a base for spinning up Express servers.

## Tech Stack

- **Fastify 5** — HTTP server & routing
- **TypeScript** — strict mode, ESM (\`module: NodeNext\`)
- **Pino + Morgan** — structured & HTTP request logging
- **AJV** — request validation
- **Vitest + Supertest** — testing
- **ESLint (flat config)** — linting

### Key Architectural Concepts

## Project Directory Structure

\`\`\`text
${options.projectName}/
├── src/
│   ├── index.ts               # Server bootstrap (app.listen)
│   ├── app.ts                 # Fastify prehandlers an errorhandlers
│   ├── configs/               # envConfig, logger, errors/
│   │   └── errors/            # errorCodes, errorStatusMap, errorHandlers
│   ├── features/
│   │   └── user/              # EXAMPLE feature: routes, controller, service, schemas
│   └── shared/utils/          # responder, Hasher, UuidHandler
├── .env.example               # Template for environment variables
├── .env.development / .env.test / .env.production
├── eslint.config.js
├── tsconfig.json
├── vitest.config.ts
└── package.json
\`\`\`


Feature-first / modular layout with layered concerns:

\`\`\`
routes → controller → service → (in-memory model | your DB layer)
\`\`\`

- **\`features/<name>/\`** — self-contained module per domain (routes, controller, service, interfaces, schemas).
- **\`shared/utils/\`** — helpers used across features (\`responder\`, \`UuidHandler\`, \`Hasher\`).
- **\`configs/\`** — environment, logger, and centralized error handling.

> The \`user\` feature uses an in-memory array (\`users.ts\`) purely to demonstrate the pattern. Swap it for your own data layer (Sequelize, Prisma, Drizzle, etc.) when building real features. \`src/configs/database.ts\` is an intentionally empty stub.

## Getting Started

### Prerequisites

- Node.js v20+
- pnpm (or npm/yarn)

### Install

\`\`\`bash
pnpm install
\`\`\`

### Environment Setup

\`\`\`bash
cp .env.example .env.development
\`\`\`

| Variable | Description | Example | Required |
| :--- | :--- | :--- | :--- |
| \`PORT\` | Server listening port | \`3000\` | Yes |
| \`USER_IMG\` | Example variable (demo) | \`vgametest\` | Yes |

\`NODE_ENV\` selects the env file: \`development\` → \`.env.development\`, \`test\` → \`.env.test\`, \`production\` → \`.env.production\`.

### Run

\`\`\`bash
pnpm dev        # dev server with live reload (tsx watch)
pnpm build      # compile to dist/
pnpm start      # run compiled output
\`\`\`

## Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| Development | \`pnpm dev\` | Dev server with live reload |
| Testing | \`pnpm test\` | Unit & integration tests (Vitest) |
| Build | \`pnpm build\` | Compile TypeScript → \`dist/\` |
| Production | \`pnpm start\` | Run compiled JS |
| Lint | \`pnpm lint\` | ESLint |

## Error Handling

All errors follow a predictable JSON contract handled by centralized middleware (\`src/configs/errors/\`):

\`\`\`json
{
  "ok": false,
  "code": "RESOURCE_NOT_FOUND",
  "message": "User not found"
}
\`\`\`

Services throw via \`throwError('ERROR_CODE', 'message')\`; the error middleware normalizes and responds.

## Example API (user feature)

Mounted at \`/api/v1/user\`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| \`POST\` | \`/\` | Create a user |
| \`GET\` | \`/\` | List users |
| \`GET\` | \`/:id\` | Get user by id |
| \`PUT\` | \`/:id\` | Update a user |
| \`DELETE\` | \`/:id\` | Delete a user |

This feature exists only as a **reference implementation** of the feature-module pattern. Replace or delete it when building your own API.

## Adding a New Feature

1. Create \`src/features/<name>/\` with \`<name>.routes.ts\`, \`<Name>Controller.ts\`, \`<Name>Service.ts\`, \`<name>.interface.ts\`, \`schemas.ts\`, and a data source.
2. Validate input.
3. Throw errors with \`throwError\` from \`configs/errors.js\`.
4. Mount the router in \`src/app.ts\`.
5. Add tests (\`*.test.ts\`) and run \`pnpm test\` + \`pnpm lint\`.
`
}