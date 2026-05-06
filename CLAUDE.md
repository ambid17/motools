# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview
The core goal of Motool (a combination of motorcycle and tool) is to track maintenance and be a handy tool for managing your garage of motorcycles.

Here are some of the core features:
- garage view
	- this allows the users to enter each of their motorcycles into their account
		- they will enter:
			- manufactured year
			- make/manufacturuer
			- model
			- trim level
			- modifications or aftermarket parts
- maintenance view
	- allow the user to enter their current odometer reading
	- send notifications or prompt the user to perform service
		- examples:
			- oil change due in 8000 miles
			- brake pads due at 6000 miles
			- tire pressure and wear check every 500 miles
	- if they haven't used the app in the past, anything that the owner's manual recommends at less than their current mileage will be on the list of "to do's"
	- however, if they last checked in at X miles, and they recorded an oil change, the software will tell them their next oil change isn't due for Y more miles.
	- there should also be a view in this space for pre-ride checklists
- service history
	- when going to a mechanic or dealer, the user can scan their invoice for the software to automatically log their current odometer reading and work done.
		- the software can store receipts for these transactions
	- when doing work by themselves, the software can be used to:
		- look up parts
		- save links to reputable sources for parts they (and other users) used
		- track when the part was added
		- find installation guides
		- save notes or tips on how to best install
	- this will allow a user transfer ownership with all of the service history
- the cost of ownership view
	- this view summarizes the purchase price and all service history to get a grand total for the bike
	- the view will be broken down by source of the cost
- manual lookup
	- this view will allow the user to look up:
		- owner's manuals
		- service manuals
		- shop manuals
		- tutorial guides for bike builds
		- installation guides for certain parts
		- tools required to perform specific services
- pricing: 
	- free for 1 bike 
	- $3/month for unlimited bikes
	- $10/month to request features

### Architecture
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
