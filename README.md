# CaseFlow

One-liner: **Import → Validate → Fix → Submit → Track**

## Architecture overview

- Frontend: React + TypeScript + Vite; state manager: Zustand; headless UI + Tailwind; AG Grid for editable, virtualized grid.
- Backend: Node.js + Express + TypeScript; Postgres with Prisma ORM.
- Auth: JWT + refresh token.
- Import flow: upload CSV → server stores import jobs → front-end chunked create → server creates cases & audit trail.
- Pagination: cursor-based (server-side).
- Observability: basic request logs + health endpoint; Sentry placeholder env var support.

(Diagram)
Frontend <-> Backend REST API <-> PostgreSQL (Prisma)


## Run locally (one command)

```bash
# fork the repo 

# Open terminal and clone it locally
git clone https://github.com/caseflow

# starting the build
docker compose up --build
```

# Visit the deployed link

```bash
Frontend Vite: http://localhost:5173

Backend API: http://localhost:4000/api

Health: http://localhost:4000/health
```

# Design decisions & tradeoffs

- Grid choice: AG Grid — enterprise-ready and supports virtualization, editing, column re-order. Chosen for performance given 50k row requirement. (Open-source community edition used.)

- Virtualization & performance: AG Grid provides row virtualization. Large CSV parsing offloaded to PapaParse worker. Chunked, incremental uploads (500 rows default) avoid large single DB transactions to reduce locking and memory pressure.

- Schema mapping: Auto-detect by fuzzy header normalization (lowercase + remove punctuation). Users can remap in UI before submission.

- Validation strategy: Client-side first-pass with zod rules to provide immediate inline errors; server re-validates before creating cases to avoid client tampering.

- Batch ingestion: Chunked with retry-on-failure; server logs per-row failures in ImportJob records for post-mortem & downloadable error CSV.


# Performance notes (50k rows)

- Use PapaParse with worker mode for streaming parse of CSV files.

- AG Grid virtualization prevents rendering all rows at once.

- Chunked server requests with configurable chunk size (500 default).

- Consider adding server-side import worker queue (Bull/Redis) for production.


# Security notes

- JWT for authentication; refresh tokens for session continuation.

- Input validation both client & server (Zod).

- Use parameterized queries via Prisma — prevents SQL injection.

- Rate-limit & helmet are recommended for production.

- Store secrets via environment variables (do not commit).

- OWASP basics: sanitize inputs, proper CORS, restrict file size, and validate file types.


# Testing strategy

- Unit tests: backend validation & services (Vitest), frontend components (Vitest + RTL).

- E2E: Playwright for the main happy path (sign-in → upload → fix → submit → view cases).

- CI runs lint, build, tests on PRs.

# Deployment

- Frontend: Vercel.
- Backend: Render.
- DB: Postgres (Supabase).

# Environment variables
- DATABASE_URL: postgres connection string
- JWT_SECRET
- REFRESH_TOKEN_SECRET
- PORT (backend)
- VITE_API_BASE (frontend dev override)
