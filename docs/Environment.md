# Environment Configuration

## Principles

1. **No secrets in source control** — use `.env.example` as documentation only
2. **Explicit environment names** — `development`, `staging`, `production`
3. **Fail fast** — validate required variables at startup
4. **Separate mobile and server config** — different variable names, same environment concept

## Mobile (`apps/mobile`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend base URL |
| `VITE_ENV` | Yes | `development` \| `staging` \| `production` |
| `VITE_REVENUECAT_IOS_KEY` | Staging+ | RevenueCat public iOS key |
| `VITE_REVENUECAT_ANDROID_KEY` | Staging+ | RevenueCat public Android key |

Copy `.env.example` to `.env.local` for local development.

## Backend (`backend`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | Runtime mode |
| `PORT` | No | Default `3000` |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `APNS_KEY_ID` | iOS push | Apple Key ID |
| `APNS_TEAM_ID` | iOS push | Apple Team ID |
| `APNS_KEY_PATH` | iOS push | Path to `.p8` file |
| `FCM_PROJECT_ID` | Android push | Firebase project |
| `FCM_CLIENT_EMAIL` | Android push | Service account |
| `FCM_PRIVATE_KEY` | Android push | Service account key |
| `REVENUECAT_WEBHOOK_SECRET` | Subscriptions | Webhook auth |

## Common mistakes

- Using `process.env` directly in mobile code (use Vite `import.meta.env`)
- One `.env` file shared between mobile and backend
- Missing validation — app crashes at runtime instead of build/startup

## Best practices

- Centralize validation in `config/env.ts` (both mobile and backend)
- Document every variable in this file when adding modules
- Use different Firebase/RevenueCat projects per environment