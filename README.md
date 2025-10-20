## CTFE

Modern Next.js 15 app using the App Router, Tailwind CSS, Redux Toolkit, and a separate API backend. The UI provides login, dashboard, admin tools, media players, and system diagnostics.

### Tech stack
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Redux Toolkit + redux-persist
- Radix UI primitives, Lucide icons
- Chart.js, Framer Motion

---

## Prerequisites
- Node.js 18.18+ (recommended 20+)
- npm (or yarn/pnpm/bun). Examples below use npm.
- A reachable API backend that implements the endpoints used by this app (see API notes below).

## Environment variables
Create a `.env.local` file in the project root:

```bash
# Base URL for the API the frontend calls
NEXT_PUBLIC_API_URL=http://localhost:5000

# Optional: cookie key used by js-cookie for storing the JWT
# If omitted, defaults to "mcToken"
NEXT_PUBLIC_TOKEN=mcToken

# Optional: change the dev server port
# PORT=3000
```

Notes:
- The app uses browser cookies for auth. Middleware checks a cookie named `token` for route protection. The login flow also stores the JWT under the `mcToken` key (configurable via `NEXT_PUBLIC_TOKEN`).
- If `NEXT_PUBLIC_API_URL` is not set, the app will fall back to `http://192.168.1.51:5000` (intended for a local network setup). Set it explicitly for your environment.

## Install dependencies

```bash
npm install
```

## Run the app (development)

```bash
npm run dev
# or override port
PORT=4000 npm run dev
```

Open `http://localhost:3000` (or your chosen port).

## Build and run (production)

```bash
# Build
npm run build

# Start the production server
npm run start
# Optionally set PORT
# PORT=8080 npm run start
```

## Available scripts
- `npm run dev` — Start Next.js dev server (Turbopack)
- `npm run build` — Create production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## How authentication works (frontend)
- The login form posts to your API: `POST /auth/login` at `NEXT_PUBLIC_API_URL`.
- On success, the app expects `{ accessToken, refreshToken?, sessionId, user }`.
- The JWT is stored in two places:
  - Cookie `token` (used by middleware for route protection)
  - Cookie `mcToken` (configurable via `NEXT_PUBLIC_TOKEN`, used for API Authorization header)
- Protected routes are enforced by `middleware.ts` and HOCs in `lib/auth-middleware.tsx`.

## API expectations (backend)
Configure/implement these endpoints on your backend (examples):
- `POST /auth/login` — returns tokens and user info
- `GET /auth/me` — returns current user info
- `POST /auth/change-password`
- `POST /auth/logout`, `POST /auth/logout-all`
- `GET /users/all`, `PUT /users/:id`, `PUT /users/admin/:id`, `PUT /users/admin/reset-password/:id`
- `GET /global/`, `POST /global/`, `GET /global/launch`
- `GET /audio/`, `GET /audio/play`, `GET /audio/stream`
- `GET /video/`, `GET /video/previews/`, `GET /video/stream/:name`

Make sure your API enables CORS for the frontend origin and accepts `Authorization: Bearer <token>` headers.

## Troubleshooting
- Redirect loop to login or blank page
  - Ensure the API is reachable at `NEXT_PUBLIC_API_URL`.
  - After successful login, verify cookies: a `token` cookie must be present. Also `mcToken` (or your custom token name) should exist.
  - Check your backend CORS settings for the dev origin (e.g., `http://localhost:3000`).

- CORS errors in the browser console
  - Allow the frontend origin on the API and include allowed headers (e.g., `Authorization`).

- Media (audio/video) not loading
  - Confirm the streaming endpoints exist and are reachable from the browser.

- Stale or incorrect state after code/data changes
  - Clear local storage and cookies (`token`, `mcToken`) to reset persisted auth and state.

## Security testing content
This repo includes an educational guide for vulnerability testing. See `HACKING_SETUP.md` and `VULNERABILITY_README.md`. Use only in controlled, authorized environments.

## Contributing
Standard TypeScript, ESLint, and Tailwind conventions apply. Keep code clear and readable. Run `npm run lint` before committing.
