# Jinner HR System

[![Deploy Backend To Cloudflare](https://github.com/thihakyaw-leo/jinner-hr-system/actions/workflows/deploy-cloudflare.yml/badge.svg)](https://github.com/thihakyaw-leo/jinner-hr-system/actions/workflows/deploy-cloudflare.yml)

Jinner HR System is a Turborepo monorepo for an HR platform with:

- `admin-desktop`: Tauri + React + Vite desktop app for HR administrators
- `employee-pwa`: React + Vite mobile-first PWA for employees
- `backend-api`: Cloudflare Workers + Hono API with Cloudflare D1
- `ui-components`: shared React UI primitives
- `shared-types`: shared TypeScript types and constants

Repository: [thihakyaw-leo/jinner-hr-system](https://github.com/thihakyaw-leo/jinner-hr-system)

## Tech Stack

- Monorepo: Turborepo
- Package manager: `pnpm`
- Frontend: React, Vite, TypeScript
- Desktop: Tauri
- Backend: Cloudflare Workers, Hono
- Database: Cloudflare D1 (SQLite)

## Workspace Structure

```text
jinner-hr-system/
|-- apps/
|   |-- admin-desktop/
|   |-- backend-api/
|   `-- employee-pwa/
|-- packages/
|   |-- shared-types/
|   `-- ui-components/
|-- .github/
|   `-- workflows/
|-- package.json
|-- pnpm-workspace.yaml
|-- turbo.json
`-- tsconfig.base.json
```

## Prerequisites

- Node.js `20.11+`
- `pnpm` via Corepack
- Rust toolchain for Tauri builds
- Cloudflare account and D1 database for remote deployment

Optional but useful:

- Git
- GitHub CLI

## Getting Started

Enable `pnpm` with Corepack:

```bash
corepack enable
corepack prepare pnpm@10.15.1 --activate
```

Install dependencies:

```bash
pnpm install
```

Seed a local D1 database with sample branches and demo users:

```bash
pnpm --filter @thihakyaw-leo/backend-api db:apply:local
pnpm --filter @thihakyaw-leo/backend-api db:seed:local
```

## Root Scripts

From the repository root:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
```

What they do:

- `pnpm dev`: runs all workspace `dev` scripts through Turbo
- `pnpm build`: builds all apps and packages
- `pnpm lint`: runs workspace validation tasks
- `pnpm typecheck`: runs TypeScript checks across the monorepo

## Apps

### `apps/admin-desktop`

Desktop admin shell built with Tauri + React + Vite.

Useful commands:

```bash
pnpm --filter @thihakyaw-leo/admin-desktop dev
pnpm --filter @thihakyaw-leo/admin-desktop build
pnpm --filter @thihakyaw-leo/admin-desktop build:desktop
```

Notes:

- Vite dev server runs on `http://127.0.0.1:1420`
- Tauri requires Rust to be installed
- Includes login, dashboard, employee management, and shared component usage

### `apps/employee-pwa`

Mobile-first employee app built with React + Vite + PWA support.

Useful commands:

```bash
pnpm --filter @thihakyaw-leo/employee-pwa dev
pnpm --filter @thihakyaw-leo/employee-pwa build
```

Notes:

- Vite dev server runs on `http://127.0.0.1:5173`
- PWA manifest and service worker are generated during build
- Includes login, attendance check-in, liabilities, and salary views

### `apps/backend-api`

Cloudflare Worker powered by Hono and backed by D1.

Useful commands:

```bash
pnpm --filter @thihakyaw-leo/backend-api dev
pnpm --filter @thihakyaw-leo/backend-api build
pnpm --filter @thihakyaw-leo/backend-api deploy
pnpm --filter @thihakyaw-leo/backend-api db:apply:local
pnpm --filter @thihakyaw-leo/backend-api db:seed:local
```

Current API routes:

- `GET /health`
- `POST /api/auth/login`
- `GET /api/branches`
- `GET /api/employees`
- `POST /api/employees`
- `POST /api/liabilities/create`
- `GET /api/liabilities/mine`
- `POST /api/attendance/check-in`
- `GET /api/payroll/mine/latest`

Database schema lives in [`apps/backend-api/schema.sql`](apps/backend-api/schema.sql).

## Shared Packages

### `packages/ui-components`

Shared React UI building blocks used by the desktop and PWA apps.

### `packages/shared-types`

Shared TypeScript domain types such as:

- employee roles
- employee status
- auth response types
- dashboard metric types

## Environment Setup

Create a local Worker env file from the example:

```bash
copy apps\backend-api\.dev.vars.example apps\backend-api\.dev.vars
copy apps\admin-desktop\.env.example apps\admin-desktop\.env.local
copy apps\employee-pwa\.env.example apps\employee-pwa\.env.local
```

Set at least:

```env
JWT_SECRET=replace-with-a-long-random-secret
VITE_API_BASE_URL=http://127.0.0.1:8787
```

Demo local credentials after running `db:seed:local`:

- Admin: `JNR-001` / `admin123`
- Manager: `JNR-002` / `manager123`
- Employee: `EMP-001` / `staff123`

## Production Frontend Configuration

Before shipping the desktop app or the employee PWA, point both frontends at the live Worker URL:

```env
VITE_API_BASE_URL=https://jinner-hr-system-api.<your-workers-subdomain>.workers.dev
```

Recommended files:

- `apps/admin-desktop/.env.production`
- `apps/employee-pwa/.env.production`

If you later host the employee PWA on a custom domain, update backend CORS by setting `ALLOWED_ORIGINS` or the specific origin vars before redeploying the Worker.

## Cloudflare D1 Setup

The Worker is configured with a D1 binding named `DB` in [`apps/backend-api/wrangler.toml`](apps/backend-api/wrangler.toml).

Typical flow:

```bash
pnpm --filter @thihakyaw-leo/backend-api db:apply:local
pnpm --filter @thihakyaw-leo/backend-api build
pnpm --filter @thihakyaw-leo/backend-api deploy
```

If you have not created the D1 database yet, create it with Wrangler first and then update `wrangler.toml` with the real database ID.

## Production Backend Configuration

Set these values in Cloudflare before production use:

- `JWT_SECRET`: a long random secret used for signing tokens
- `ALLOWED_ORIGINS`: optional comma-separated production origins for stricter CORS
- `ADMIN_DESKTOP_ORIGIN`: optional explicit desktop web origin
- `EMPLOYEE_PWA_ORIGIN`: optional explicit employee PWA origin

Example:

```env
JWT_SECRET=replace-with-a-long-random-secret
ALLOWED_ORIGINS=https://employee.example.com,https://admin.example.com
```

## GitHub Actions Deployment

This repository includes [`.github/workflows/deploy-cloudflare.yml`](.github/workflows/deploy-cloudflare.yml) to deploy the backend Worker from GitHub Actions.

Add these repository secrets before enabling the workflow:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

The deploy job uses the GitHub environment `CLOUDFLARE_DEPLOY`, so store those secrets there for approval-gated production deploys.

The workflow:

1. Installs dependencies
2. Typechecks the workspace
3. Applies `schema.sql` to the remote D1 database
4. Deploys the Worker with Wrangler

## Development Flow

Recommended local workflow:

1. Run `pnpm install`
2. Create `apps/backend-api/.dev.vars`
3. Apply the local D1 schema
4. Start the backend API
5. Start the employee PWA
6. Start the admin desktop app

In practice:

```bash
pnpm --filter @thihakyaw-leo/backend-api db:apply:local
pnpm dev
```

## Verification

The current scaffold has been validated with:

- workspace typecheck
- workspace lint
- Turbo build pipeline
- Vite builds for both frontend apps
- Wrangler dry-run build for the backend
- local D1 schema application
- local D1 seed application

## Current Status

This repository currently provides:

- monorepo architecture
- backend schema and starter auth, employee, attendance, liability, and payroll APIs
- admin desktop starter dashboard and employee management flow
- employee PWA starter shell with login and self-service screens
- shared UI and shared type packages

Business workflows can now be expanded on top of this scaffold.
