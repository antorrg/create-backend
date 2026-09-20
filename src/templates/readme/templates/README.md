# Api `api-example` (Express + Sequelize REST API)

A scalable, production-ready RESTful API starter kit generated with **CreateBackend CLI**. Built with **Express 5**, **TypeScript**, **Sequelize v7 (PostgreSQL)**, and **Session-based Authentication**.

---

## Architecture Overview

This project follows a **Feature-First / Modular Architecture** combined with layered separation of concerns. This ensures high maintainability, testability, and scalability as your API grows.

### Key Architectural Concepts

1. **Feature Modules (`src/features/`)**:
   - Each domain feature (`auth`, `user`, `system-logs`) is self-contained with its routes, controllers, services, and integration tests.
   - Keeps business logic organized by domain rather than scattering files across single global folders.

2. **Shared Layer (`src/shared/`)**:
   - **Repositories**: Encapsulate database queries and data abstraction layers.
   - **Auth Middlewares**: Handle session validation, cookie parsing, and **CSRF protection** (`csrfProtection`, `setCsrfToken`, `verifyCsrfToken`).
   - **Interfaces & Utilities**: Common helper functions and TypeScript types shared across features.

3. **Centralized Configurations (`src/configs/`)**:
   - **Environment Management (`envConfig.ts`)**: Strongly-typed environment configuration supporting `.env.development`, `.env.test`, and `.env.production`.
   - **Database Connection (`database.ts`)**: Manages Sequelize initialization, ORM models, and startup synchronization.
   - **Error Handling (`errors.ts`)**: Centralized Express middleware for standardizing error responses (404 Not Found, JSON parsing errors, internal server errors).
   - **Logger (`logger.ts`)**: Structured logging powered by Pino and HTTP request logging with Morgan.

4. **Database Models (`src/models/`)**:
   - Explicit Sequelize v7 models (`user.model.ts`, `session.model.ts`, `log.model.ts`) mapped cleanly to PostgreSQL tables.

---

## Project Directory Structure

```text
api-example/
├── src/
│   ├── index.ts                # Application entrypoint & server bootstrap
│   ├── app.ts                  # Express application configuration & middleware pipeline
│   ├── routes.ts               # Main API routing table (/api/v1/...)
│   ├── configs/                # DB, Logger, Error handlers & Environment configs
│   ├── features/               # Modular features (Domain-driven)
│   │   ├── auth/               # Authentication routes, controllers & tests
│   │   ├── user/               # User management feature module
│   │   └── system-logs/        # Audit & system log endpoints
│   ├── models/                 # Sequelize database models
│   └── shared/                 # Shared middlewares, repositories, utilities & dependencies
├── .env.example                # Template for environment variables
├── .env.development            # Development environment variables
├── .env.test                   # Test environment configuration
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript compiler configuration
└── vitest.config.ts            # Vitest testing setup
```

---

## How to Proceed (Getting Started)

Follow these steps to set up and run your project locally.

### 1. Prerequisites
Ensure you have installed:
- **Node.js**: v20 or higher
- **Package Manager**: npm, pnpm, or yarn
- **PostgreSQL Database**: Running locally or via Docker

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create your local environment configuration file from the template:

```bash
cp .env.example .env.development
```

Configure your PostgreSQL database connection parameters inside `.env.development`:
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=api_example_db
DB_USER=postgres
DB_PASSWORD=your_password
SESSION_SECRET=super_secret_session_key
```

### 4. Database Setup
Ensure PostgreSQL is running and the database specified in `DB_NAME` exists. On startup, Sequelize will initialize models automatically.

---

## Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Starts server in dev mode with live reload (`tsx watch`) |
| **Testing** | `npm run test` | Runs unit & integration tests via Vitest |
| **Build** | `npm run build` | Compiles TypeScript into `/dist` directory |
| **Production** | `npm run start` | Runs compiled JavaScript from `/dist` |
| **Linting** | `npm run lint` | Lints TypeScript files using ESLint |

---

## Main API Endpoints

All API endpoints are prefixed with `/api/v1`:

- **Authentication (`/api/v1/auth`)**
  - `POST /login` - User login & session creation
  - `POST /logout` - User logout & session destruction
  - `GET /me` - Get current session status & CSRF token

- **User Management (`/api/v1/user`)**
  - `GET /` - Retrieve user profiles
  - `POST /` - Create new user

- **System Logs (`/api/v1/logs`)**
  - `GET /` - Fetch application & system logs