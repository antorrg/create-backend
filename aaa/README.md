
# Api `aaa` (Fastify + Drizzle REST API)

A scalable, production-ready RESTful API starter kit generated with CreateBackend CLI. Built with Fastify 5, TypeScript, **Drizzle v0 (PostgreSQL)** .

## Summary

A scalable and modern REST API boilerplate built with Fastify, TypeScript and **Drizzle v0 (PostgreSQL)**. Designed to kickstart backend services with clean project structure, environment configuration, and standard error handling out of the box.

### Architecture Overview

This project follows a Feature-First / Modular Architecture combined with layered separation of concerns. This ensures high maintainability, testability, and scalability as your API grows.

### Key Architectural Concepts

#### Feature Modules (src/features/)

Each domain feature ( user, system-logs) is self-contained with its routes, controllers, services, and integration tests.
Keeps business logic organized by domain rather than scattering files across single global folders.

#### Shared Layer (src/shared/)

#### Repositories 

Encapsulate database queries and data abstraction layers.

#### Interfaces & Utilities

Common helper functions and TypeScript types shared across features.

### Centralized Configurations (src/configs/)

#### Environment Management (envConfig.ts)

Strongly-typed environment configuration supporting .env.development, .env.test, and .env.production.
        
#### Database Connection (database.ts)

Manages Prisma initialization, and startup synchronization.

#### Error Handling (errors.ts)

Centralized Fastify errorHandlers for standardizing error responses (404 Not Found, JSON parsing errors, internal server errors).

```json
{
  "error": {
    "ok": false,
    "code": "UNAUTHORIZED",
    "message": "Invalid credentials provided",
  }
}
```


#### Logger (logger.ts)

Structured logging powered by Pino.

Database Models (./schema/schema.prisma):

Explicit drizzle-orm V0.45.3 models mapped cleanly to PostgreSQL tables.

## Project Directory Structure

```text
aaa/
├── src/
│   ├── index.ts                # Application entrypoint & server bootstrap
│   ├── app.ts                  # Fastify application configuration & handlers register
│   ├── configs/                # DB, Logger, Error handlers & Environment configs
│   ├── features/               # Modular features (Domain-driven)
│   │   ├── auth/               # Authentication routes, controllers & tests
│   │   ├── user/               # User management feature module
│   │   └── system-logs/        # Audit & system log endpoints
│   └── schemas/                # Schemas from drizzle
│   └── shared/                 # Shared functions, repositories, utilities & dependencies
├── drizzle.config.ts            # drizzle setup
├── .env                        # Development environment for drizzle database url
├── .env.example                # Template for environment variables
├── .env.development            # Development environment variables
├── .env.test                   # Test environment configuration
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript compiler configuration
└── vitest.config.ts            # Vitest testing setup

```


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
```bash
cp .env.example .env.development
```
#### Environment Variables Reference
| Variable | Description | Default / Example | Required |
| :--- | :--- | :--- | :--- |
| `PORT` | Server listening port | `3000` | No |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@localhost:5432/db` | Yes |
| `SESSION_SECRET` | Secret key used for session cookie encryption | `super_secret_key` | Yes |

#### Configure your database connection parameters inside .env.development:

```bash

PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/dbName
SESSION_SECRET=super_secret_session_key

```

4. **Database Setup**

Ensure PostgreSQL is running and the database specified in DATABASE_URL exists.


### Initialize drizzle

The models come pre-configured, though you can modify or add tables, columns, and rows.
You must initialize the database using the commands **`prisma migrate dev`** (migration name) and then **`prisma generate`**, as shown in the examples below. Pay special attention to ensure that the database being initialized is the one specified in the `.env` file.
When running migrations and generation, Prisma relies solely on the `.env` environment variable; other variables will be read from their respective files once the project is initialized. Therefore, upon starting, you must run a migration and a generation for each database by manually loading its URL into the `.env` file. This approach ensures that Prisma's default behavior remains unaltered.
Examples 

```bash
- npx drizzle-kit generate

- npx drizzle-kit migrate
```



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

All endpoints are prefixed with `/api/v1`.

### User Management (`/api/v1/user`)

| Method | Endpoint | Description | Authentication | Required Payload / Query |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Retrieve user profiles | Required (not implemented yet)| `?page=1&limit=10` |
| `POST` | `/` | Create a new user | Admin (not implemented yet)| `{ name, email, role }` |
| `GET` | `/:id` | Fetch user details | Required (not implemented yet)| Path parameter `:id` |

### System Logs (`/api/v1/logs`)

| Method | Endpoint | Description | Authentication | Required Payload / Query |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Fetch audit & system logs | Admin (not implemented yet)| `?level=error&limit=50` |