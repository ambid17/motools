# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

**motools** is a monorepo containing two independent applications:

- `motool-web/` — Next.js 16.2.4 frontend (React 19, TypeScript with Strict Mode, Tailwind CSS 4)
- `Motool-api/` — ASP.NET Core 10.0 REST API (C#, EF Core, Postgres)

## Commands

### Frontend (`motool-web/`)

```bash
pnpm dev       # Dev server on http://localhost:3000
pnpm build     # Production build
pnpm lint      # ESLint
```

Use **pnpm** (not npm or yarn) — a `pnpm-lock.yaml` and `pnpm-workspace.yaml` are present.

### Backend (`Motool-api/`)

```bash
dotnet run     # Dev server on http://localhost:5274
dotnet build   # Compile
dotnet publish # Production publish
```

Docker build: `docker build -f Dockerfile .` (targets .NET 10.0, exposes ports 8080/8081).

## Architecture

### Frontend

Uses the **Next.js App Router** (`app/` directory). All routes, layouts, and pages live under `app/`. The `@/*` TypeScript path alias maps to the project root.

> **Important:** Next.js 16.2.4 has breaking changes from earlier versions. Before writing any Next.js code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices — APIs, conventions, and file structure may differ from training data.

### Backend

Standard **ASP.NET Core Controllers** pattern. `Program.cs` is the entry point and wires up services, middleware, and routing. Controllers live in `Controllers/`. OpenAPI docs are available at `/openapi` in development.

### Frontend ↔ Backend

The frontend (port 3000) is intended to call the backend API (port 5274). No API proxy or shared type layer is configured yet — this will need to be added as features are built out.
