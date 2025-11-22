# CaseFlow

**A fast web app that lets an operations team upload a CSV, review/clean the data in a rich grid, and bulk-create “cases”**

> **Import → Validate → Fix → Submit → Track**

##  Live Deployment

| Service | Provider | Link |
| :--- | :--- | :--- |
| **Frontend** | Vercel | [Launch App](https://caseflow-frontend-url.com) |
| **Backend** | Render |  |
| **Database** | Supabase | PostgreSQL |

---

##  Architecture Overview

### Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Headless UI.
- **State Management:** Zustand.
- **Data Grid:** AG Grid (Community Edition) – chosen for virtualization and editing capabilities.
- **Backend:** Node.js, Express, TypeScript.
- **Database:** PostgreSQL with Prisma ORM.
- **Auth:** JWT + Refresh Tokens.
- **Observability:** Basic request logs + Health endpoint.
- **i18n:** Internationalization ready.

### System Architecture & Import Flow
**Import Flow:**
``` 
Upload CSV → Server stores job → Frontend chunks creation → Server creates cases & Audit trail.
```
![Frontend Architecture](frontend/src/assets/caseflowFrontend.png)

![Backend Architecture](frontend/src/assets/caseflowBackend.png)

---

##  Run Locally

Run the entire stack locally with a single command using Docker.

### Prerequisites
- Git
- Docker
- Docker Desktop(not necessary)

### Installation

```bash
# 1. Fork and Clone the repository
git clone [https://github.com/your-username/caseflow.git]
cd caseflow

# 2. Start the build (Frontend, Backend, and DB)
docker compose up --build

# 3. Accessing the Application
Once the containers are running, access the services at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api
- Health Check: http://localhost:4000/health

```

---

##  Design Decisions & Tradeoffs

- **AG Grid for UI:** Choose AG Grid (Community) because it supports row virtualization, inline editing, and column re-ordering out of the box. This is critical for the **50k row requirement** where standard HTML tables would crash the DOM.
- **Virtualization Strategy:** Large CSV parsing is offloaded to a **PapaParse worker** to keep the main thread unblocked.
- **Chunked Uploads:** Data is sent to the backend in configurable chunks (Default: 500 rows). This prevents large database transactions that cause locking and reduces memory pressure on the Node.js server.
- **Schema Mapping:** The system uses fuzzy header normalization (lowercase + punctuation removal) to auto-detect columns, but allows users to manually remap via the UI before submission.
- **Validation Layers:**
  - **Client-side:** Zod rules provide immediate inline feedback.
  - **Server-side:** Re-validation occurs before DB insertion to prevent tampering.

---

##  Performance & Scalability (50k Rows)

To handle high-volume data ingestion efficiently:

1. **Streaming Parse:** Uses PapaParse in worker mode to stream-parse large CSV files without freezing the UI.
2. **DOM Virtualization:** AG Grid only renders the rows currently visible in the viewport.
3. **Batch Ingestion:** Server processes requests in chunks with a retry-on-failure mechanism. Failures are logged per row in `ImportJob` records, allowing users to download an error CSV post-mortem.

---

##  Security Implementation

- **Authentication:** Done using  JWT Access tokens and Refresh Tokens for secure session continuation.
- **Input Sanitization:** All inputs are validated via Zod on both client and server.
- **SQL Injection Protection:** Prisma ORM uses parameterized queries by default.
- **Secret Management:** Sensitive data (DB URLs, Secrets) are stored in environment variables and never committed.
- **OWASP Basics:** CORS configuration, file size restrictions, and strict MIME-type validation on uploads.

---

##  Testing Strategy

- **Unit Tests:**
  - Backend validation & services using **Vitest**.
  - Frontend components using **Vitest**.
- **E2E Tests:**
  - **Playwright** covers end-to-end testing as: *Sign-in → Upload CSV → Fix Errors → Submit*.
---

##  Environment Variables

Create a `.env` file in the root directory (or respective service folders) with the following:

```bash
# Change them accordingly
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/caseflow?schema=public"

# Security
JWT_SECRET="your_super_secret_key"
REFRESH_TOKEN_SECRET="your_refresh_secret_key"

# Backend Configuration
PORT=4000

# Frontend Configuration
VITE_API_BASE="http://localhost:4000/api"
```