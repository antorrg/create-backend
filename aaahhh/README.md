
# Api `aaahhh` (Express REST API)

A scalable, production-ready RESTful API starter kit generated with CreateBackend CLI. Built with Express 5 and TypeScript.

## Summary

A scalable and modern REST API boilerplate built with Express and TypeScript. Designed to kickstart backend services with clean project structure, environment configuration, and standard error handling out of the box.

### Architecture Overview

This project follows a Feature-First / Modular Architecture combined with layered separation of concerns. This ensures high maintainability, testability, and scalability as your API grows.

### Key Architectural Concepts

#### Feature Modules (src/features/)

Each domain feature (user, system-logs) is self-contained with its routes, controllers, services, and integration tests.
Keeps business logic organized by domain rather than scattering files across single global folders.

#### Shared Layer (src/shared/)

#### Interfaces & Utilities

Common helper functions and TypeScript types shared across features.

### Centralized Configurations (src/configs/)

#### Environment Management (envConfig.ts)

Strongly-typed environment configuration supporting .env.development, .env.test, and .env.production.


#### Logger (logger.ts)

Structured logging powered by Pino and HTTP request logging with Morgan.

#### Error Handling (errors.ts)

Centralized Express middleware for standardizing error responses across all endpoints. All errors follow a predictable JSON contract:

```json
{
  "error": {
    "ok": false,
    "code": "UNAUTHORIZED",
    "message": "Invalid credentials provided",
  }
}
```



## Project Directory Structure

```text
aaahhh/
├── src/
│   ├── index.ts                # Application entrypoint & server bootstrap
│   ├── app.ts                  # Express application configuration & middleware pipeline
│   ├── routes.ts               # Main API routing table (/api/v1/...)
│   ├── configs/                # Logger, Error handlers & Environment configs
│   ├── features/               # Modular features
│   │   └── user/               # User management feature module
│   └── shared/                 # Shared middlewares, repositories, utilities & dependencies
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
| `PORT` | Server listening port | `3000` | Yes |
| `USER_IMG` | User image url| image.png | Yes


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

