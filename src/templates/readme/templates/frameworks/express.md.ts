import type { ProjectConfig } from '../../../../types.js'
import { capitalizeFirstLetter } from "../../readme.generator.js";
import { mainOrm } from '../orms/main-orm.js'
import { mainSession } from './main.session.js';

export const expressMd = (options: ProjectConfig)=>{
    const nameServer = capitalizeFirstLetter(options.selectedServer)
    const orm = mainOrm(options)
    const auth = mainSession(options)
    return `
# Api \`${options.projectName}\` (${nameServer} ${orm.part1} REST API)

A scalable, production-ready RESTful API starter kit generated with CreateBackend CLI. Built with Express 5, TypeScript, ${orm.part2}${auth.part1}

## Summary

A scalable and modern REST API boilerplate built with ${nameServer}, TypeScript and ${orm.part2}. Designed to kickstart backend services with clean project structure, environment configuration, and standard error handling out of the box.

### Architecture Overview

This project follows a Feature-First / Modular Architecture combined with layered separation of concerns. This ensures high maintainability, testability, and scalability as your API grows.

### Key Architectural Concepts

#### Feature Modules (src/features/)

Each domain feature (${auth.part2}user, system-logs) is self-contained with its routes, controllers, services, and integration tests.
Keeps business logic organized by domain rather than scattering files across single global folders.

#### Shared Layer (src/shared/)

#### Repositories 

Encapsulate database queries and data abstraction layers.${auth.part3}

#### Interfaces & Utilities

Common helper functions and TypeScript types shared across features.

### Centralized Configurations (src/configs/)

#### Environment Management (envConfig.ts)

Strongly-typed environment configuration supporting .env.development, .env.test, and .env.production.${orm.part4}


#### Logger (logger.ts)

Structured logging powered by Pino and HTTP request logging with Morgan.

#### Error Handling (errors.ts)

Centralized Express middleware for standardizing error responses across all endpoints. All errors follow a predictable JSON contract:

\`\`\`json
{
  "error": {
    "ok": false,
    "code": "UNAUTHORIZED",
    "message": "Invalid credentials provided",
  }
}
\`\`\`

${orm.part3}

## Project Directory Structure

\`\`\`text
${options.projectName}/
├── src/
│   ├── index.ts                # Application entrypoint & server bootstrap
│   ├── app.ts                  # Express application configuration & middleware pipeline
│   ├── routes.ts               # Main API routing table (/api/v1/...)
│   ├── configs/                # DB, Logger, Error handlers & Environment configs
│   ├── features/               # Modular features (Domain-driven)
│   │   ├── auth/               # Authentication routes, controllers & tests
│   │   ├── user/               # User management feature module
│   │   └── system-logs/        # Audit & system log endpoints${orm.part5}
├── .env.example                # Template for environment variables
├── .env.development            # Development environment variables
├── .env.test                   # Test environment configuration
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript compiler configuration
└── vitest.config.ts            # Vitest testing setup

\`\`\`


### How to Proceed (Getting Started)

Follow these steps to set up and run your project locally.

1. **Prerequisites**

Ensure you have installed:

Node.js: v20 or higher
Package Manager: npm, pnpm, or yarn
PostgreSQL Database: Running locally or via Docker

2. **Install Dependencies**
npm install

### 3. Environment Setup
Create your local environment configuration file from the template:
\`\`\`bash
cp .env.example .env.development
\`\`\`
#### Environment Variables Reference
| Variable | Description | Default / Example | Required |
| :--- | :--- | :--- | :--- |
| \`PORT\` | Server listening port | \`3000\` | No |
| \`DATABASE_URL\` | PostgreSQL connection string | \`postgres://user:pass@localhost:5432/db\` | Yes |
| \`SESSION_SECRET\` | Secret key used for session cookie encryption | \`super_secret_key\` | Yes |

#### Configure your database connection parameters inside .env.development:

\`\`\`bash

PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/dbName
SESSION_SECRET=super_secret_session_key

\`\`\`

4. **Database Setup**

Ensure PostgreSQL is running and the database specified in DATABASE_URL exists.

${orm.part6}


## Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **Development** | \`npm run dev\` | Starts server in dev mode with live reload (\`tsx watch\`) |
| **Testing** | \`npm run test\` | Runs unit & integration tests via Vitest |
| **Build** | \`npm run build\` | Compiles TypeScript into \`/dist\` directory |
| **Production** | \`npm run start\` | Runs compiled JavaScript from \`/dist\` |
| **Linting** | \`npm run lint\` | Lints TypeScript files using ESLint |

---

## Main API Endpoints

All endpoints are prefixed with \`/api/v1\`.${auth.part4}
### User Management (\`/api/v1/user\`)

| Method | Endpoint | Description | Authentication | Required Payload / Query |
| :--- | :--- | :--- | :--- | :--- |
| \`GET\` | \`/\` | Retrieve user profiles | Required (not implemented yet)| \`?page=1&limit=10\` |
| \`POST\` | \`/\` | Create a new user | Admin (not implemented yet)| \`{ name, email, role }\` |
| \`GET\` | \`/:id\` | Fetch user details | Required (not implemented yet)| Path parameter \`:id\` |

### System Logs (\`/api/v1/logs\`)

| Method | Endpoint | Description | Authentication | Required Payload / Query |
| :--- | :--- | :--- | :--- | :--- |
| \`GET\` | \`/\` | Fetch audit & system logs | Admin (not implemented yet)| \`?level=error&limit=50\` |
`
}