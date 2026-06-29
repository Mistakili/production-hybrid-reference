# Backend Reference (`backend`)

Express + TypeScript + PostgreSQL + Drizzle reference API.

## Structure

```
src/
├── controllers/    # HTTP request/response mapping
├── routes/         # Route definitions
├── services/       # Business logic (APNs, FCM, RevenueCat)
├── middleware/     # Auth, logging, errors
├── repositories/   # Drizzle data access
├── workers/        # Background jobs (retries, webhooks)
├── utils/          # Shared utilities
├── config/         # Environment validation
└── types/          # Shared TypeScript types
```

## Planned modules

- APNs and FCM delivery services
- RevenueCat webhook with idempotency
- Authentication middleware
- Structured logging and error handling
- Retry logic for external APIs

## Status

Scaffold pending — track via [GitHub Issues](https://github.com/Mistakili/production-hybrid-reference/issues).