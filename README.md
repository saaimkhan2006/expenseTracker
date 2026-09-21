# Smart Budget — Phase 1 (Foundation + MVP)

Offline-first personal finance app. React + Vite + TS + Tailwind + PWA frontend. Express + MongoDB + JWT backend.

## Phase 1 scope
Register → Login → Create account → Add expense/income → Instant UI → Offline queue (IndexedDB, `syncStatus: pending`) → Auto-sync (`POST /api/transactions/sync`, idempotent on `clientId`) → Dashboard updates. Calendar (basic), Analytics (basic), Accounts, Categories included.

## Architecture
- Financial math centralized: `backend/src/utils/finance.js`, `frontend/src/utils/finance.ts`.
- Sync: local-first writes → IndexedDB → `online` event → bulk sync → `synced`. Last-write-wins v1 via `version`/`updatedAt`; `clientId` dedupes retries.
- Models carry `clientId/deviceId/syncStatus/version` for conflict upgrades.
- API: `/api/auth/*`, `/api/dashboard`, `/api/transactions` (+`/sync`), `/api/accounts`, `/api/categories`.

## Run locally
```bash
# backend
cd backend && cp .env.example .env && npm install && npm run dev
# frontend (new terminal)
cd frontend && npm install && npm run dev
```
Needs MongoDB at `MONGO_URI` (or `docker compose up mongo`). Frontend proxies `/api` → `localhost:4000`.

## Docker
`docker compose up --build` → web :8080, api :4000, mongo :27017.

## PWA / offline
`vite-plugin-pwa` generates the service worker on `npm run build`. App shell cached; data in IndexedDB (`smart-budget` DB: `transactions`, `accounts`). Offline banner + `✓ Synced / 🔄 Syncing / 📴 Offline` states.

## Roadmap
Phase 2: budgets, transfers, lending/borrowing, recurring, subscriptions. Phase 3: advanced analytics + rule-based insights. Phase 4: goals, net worth. Phase 5: push, AI assistant.
