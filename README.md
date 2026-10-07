# servers-creator

An interactive, zero-dependency native Node.js CLI tool to scaffold production-ready TypeScript backend projects, web servers, and database setups in seconds.

[![npm beta](https://img.shields.io/npm/v/servers-creator/beta.svg)](https://www.npmjs.com/package/servers-creator)
[![npm downloads](https://img.shields.io/npm/dm/servers-creator.svg)](https://www.npmjs.com/package/servers-creator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0%2B-blue.svg)](https://www.typescriptlang.org/)

---

## Key Features

- **Zero Heavy CLI Dependencies**: Built with native Node.js interactive prompts for minimal setup overhead and instant startup.
- **Framework Options**: Modern **Express 5** and **Fastify 5** with full TypeScript setup out of the box.
- **ORM & Database Support**:
  - ✅ **Prisma v7** (PostgreSQL)
  - ✅ **Sequelize v7** (PostgreSQL)
  - ✅ **Standalone / No DB**
  - 🔄 **Mongoose & Drizzle** *(Roadmap)*
- **Authentication Scaffolding**: Session & Cookie authentication ready to use.
- **Feature-First Architecture**: Clean, domain-driven directory structure separating features, configurations, and shared layers.
- **Production Readiness**: Pre-configured Pino logger, HTTP morgan logging, central error handling, and typed environment configuration.

---

## Supported Stack Matrix

| Framework | ORM / Persistence | Auth | Status |
| :--- | :--- | :--- | :---: |
| **Express 5** | **Prisma (PostgreSQL)** | Session / Cookie | ✅ **Ready** |
| **Express 5** | **Sequelize (PostgreSQL)** | Session / Cookie | ✅ **Ready** |
| **Fastify 5** | **Prisma (PostgreSQL)** | Session / Cookie | ✅ **Ready** |
| **Fastify 5** | **Sequelize (PostgreSQL)** | Session / Cookie | ✅ |
| **Express / Fastify** | **Standalone (No DB)** | None / Session | ✅ **Ready** |
| **Next.js API Server** | Various | Various | 🔄 *Roadmap* |
| **Electron Node Backend** | Various | Various | 🔄 *Roadmap* |

---

## Quick Start

You don't need to install anything globally! Run the CLI using your preferred package manager:

```bash
npx servers-creator
```

Or with `pnpm` / `yarn`:

```bash
pnpm dlx servers-creator
# or
yarn servers-creator
```

---

## Interactive Wizard Flow

When you execute `servers-creator`, the CLI guides you through an interactive prompt:

1. **Project Type**: Select target architecture (*Web Server*).
2. **Project Name**: Enter your project folder name (e.g., `my-api`).
3. **Source Directory**: Choose primary code directory (`src`, `api`, etc.).
4. **Framework & Database**: Pick your framework and ORM combination:
   - Express + Prisma (PostgreSQL)
   - Express + Sequelize (PostgreSQL)
   - Fastify + Prisma (PostgreSQL)
   - Fastify + Sequelize (PostgreSQL)
   - Express / Fastify (Standalone)
5. **Authentication**: Choose authentication setup (Session & Cookies, or None).

---

## Generated Directory Structure (Feature-First Architecture, prisma example)

```text
my-api/
├── src/
│   ├── index.ts                # Application entrypoint & server bootstrap
│   ├── app.ts                  # Express / Fastify setup & middleware pipeline
│   ├── routes.ts               # Main API routing table (/api/v1/...)
│   ├── configs/                # DB connection, Pino logger & Error handlers
│   ├── features/               # Domain-driven feature modules
│   │   ├── auth/               # Authentication routes, controllers & tests
│   │   ├── user/               # User management feature module
│   │   └── system-logs/        # Audit & system log endpoints
│   └── shared/                 # Repositories, shared middlewares & utilities
├── prisma/                     # Database models & migrations (if Prisma selected)
├── .env.example                # Environment variable placeholders
├── .env.development            # Local development environment configuration
├── .env.test                   # Test environment configuration
├── package.json                # Pre-configured scripts & dependencies
├── tsconfig.json               # Optimized TypeScript setup
└── README.md                   # Complete generated project documentation
```

---

## Local Development & Contributing

To contribute to `servers-creator` or test changes locally:

1. **Clone the repository**:

   ```bash

   git clone https://github.com/antorrg/servers-creator.git
   cd create-backend
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Build the CLI**:

   ```bash
   npm run build
   ```

4. **Run the CLI locally**:

   ```bash
   npm start
   ```

---

## License

This project is licensed under the [MIT License](LICENSE).  
MIT © 2026 - [antorrg-software](https://github.com/antorrg)
