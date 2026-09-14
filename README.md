# createbackend 🚀

> An interactive, native Node.js CLI tool to scaffold modern TypeScript backend projects, web servers, microservices, and database setups in seconds.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0%2B-blue.svg)](https://www.typescriptlang.org/)

---

## Features

- **Zero Heavy Dependencies**: Built with native Node.js interactive CLI capabilities for minimal setup overhead and instant startup.
- **Framework Options**: Choose between **Express.js** and **Fastify** with full TypeScript configuration out of the box.
- **ORM & Database Support**:
  - **Prisma** (PostgreSQL)
  - **Sequelize** (PostgreSQL)
  - **Mongoose** (MongoDB)
  - **Standalone** (No DB / Single Server setup)
- **Authentication Scaffolding**: Ready-to-use Session & Cookie authentication templates.
- **Multi-Target Generators**:
  - **Web Server** (Express / Fastify + ORM + Auth)
  - **Next.js Backend API**
  - **Electron Node Backend**
- **Production-Ready Architecture**: Pre-configured logger utilities, central error handling, environment schemas, and clean directory structures.

---

## Installation & Usage

You don't need to install anything globally! Simply run the CLI command using your preferred package manager:

```bash
npx createbackend
```

Or with `pnpm` / `yarn`:

```bash
pnpm dlx createbackend
# or
yarn create backend
```

---

## Interactive Wizard Flow

When you execute `createbackend`, the CLI will guide you through a step-by-step interactive prompt:

1. **Project Type**: Select the backend architecture you want to generate (*Web Server*, *Next.js Server*, or *Electron Node Backend*).
2. **Project Name**: Enter your desired folder / package name (e.g., `my-server`).
3. **Source Directory Name**: Choose your primary code directory (`src`, `api`, etc.).
4. **Framework & Database**: Pick your framework and ORM combination:
   - Express + Sequelize (PostgreSQL)
   - Express + Prisma (PostgreSQL)
   - Express + Mongoose (MongoDB)
   - Express (Standalone / No DB)
   - Fastify + Sequelize (PostgreSQL)
   - Fastify + Prisma (PostgreSQL)
   - Fastify + Mongoose (MongoDB)
   - Fastify (Standalone / No DB)
5. **Authentication**: Choose your authentication setup (Session & Cookies, or None).

---

## Generated Directory Structure (Example: Express + Prisma + Auth)

```text
my-server/
├── src/
│   ├── app.ts                 # Express / Fastify app setup
│   ├── server.ts              # HTTP server entry point & listener
│   ├── config/                # Environment variables & database connection
│   ├── controllers/           # Route request handlers
│   ├── routes/                # Endpoint definitions
│   ├── middlewares/           # Auth & validation middlewares
│   ├── utils/                 # Logger & helper modules
│   └── errors/                # Centralized error handling
├── prisma/                    # Prisma schema & migrations (if selected)
├── .env.example               # Pre-populated environment variable placeholders
├── package.json               # Configured scripts & dependencies
├── tsconfig.json              # Optimized TypeScript setup
└── README.md
```

---

## Development & Local Setup

If you want to contribute to `createbackend` or test changes locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/antorrg-software/create-backend.git
   cd create-backend
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Test the CLI locally**:
   ```bash
   npm start
   ```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Made by [antorrg-software](https://github.com/antorrg).