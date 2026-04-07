# Jinner HR System

Jinner HR System is a Turborepo-based monorepo for an HR platform with:

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
├─ apps/
│  ├─ admin-desktop/
│  ├─ backend-api/
│  └─ employee-pwa/
├─ packages/
│  ├─ shared-types/
│  └─ ui-components/
├─ package.json
├─ pnpm-workspace.yaml
├─ turbo.json
└─ tsconfig.base.json
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
- `pnpm build`: builds all apps/packages
- `pnpm lint`: currently runs TypeScript validation tasks
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
- Current auth handling is scaffolded with an in-memory session strategy

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

### `apps/backend-api`

Cloudflare Worker powered by Hono and backed by D1.

Useful commands:

```bash
pnpm --filter @thihakyaw-leo/backend-api dev
pnpm --filter @thihakyaw-leo/backend-api build
pnpm --filter @thihakyaw-leo/backend-api deploy
pnpm --filter @thihakyaw-leo/backend-api db:apply:local
```

Current API routes:

- `GET /health`
- `POST /api/auth/login`
- `POST /api/liabilities/create`
- `POST /api/attendance/check-in`

Database schema lives in [apps/backend-api/schema.sql](F:\jinner-hr-system\apps\backend-api\schema.sql).

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
```

Set at least:

```env
JWT_SECRET=replace-with-a-long-random-secret
```

## Cloudflare D1 Setup

The Worker is already configured with a D1 binding named `DB` in [apps/backend-api/wrangler.toml](F:\jinner-hr-system\apps\backend-api\wrangler.toml).

Before remote deploy, replace:

- `database_id = "REPLACE_WITH_D1_DATABASE_ID"`

Typical flow:

```bash
pnpm --filter @thihakyaw-leo/backend-api db:apply:local
pnpm --filter @thihakyaw-leo/backend-api build
pnpm --filter @thihakyaw-leo/backend-api deploy
```

If you have not created the D1 database yet, create it with Wrangler first and then update `wrangler.toml` with the real database ID.

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

The current scaffold has already been validated with:

- workspace typecheck
- Turbo build pipeline
- Vite builds for both frontend apps
- Wrangler dry-run build for the backend
- local D1 schema application

## Current Status

This repository currently provides:

- monorepo architecture
- backend schema and starter auth/attendance/liability APIs
- admin desktop starter dashboard
- employee PWA starter shell
- shared UI and shared type packages

Business feature implementation is still in the scaffold phase and can be expanded next.
