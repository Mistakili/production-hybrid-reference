# Architecture

## Purpose

This document describes the system boundaries and module responsibilities of the Production Hybrid reference architecture.

## High-level overview

```
┌─────────────────────────────────────────────────────────────┐
│                     apps/mobile (Capacitor)                  │
│  pages → providers → services → plugins → native (iOS/Android)│
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────┐
│                    backend (Express API)                     │
│  routes → middleware → controllers → services → repositories │
│                              ↓                               │
│                         PostgreSQL                           │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
      FCM / APNs      RevenueCat         Logging
```

## Mobile layer responsibilities

| Module | Responsibility |
|--------|----------------|
| `pages/` | Route-level composition only; no business logic |
| `providers/` | React context for auth, push, subscriptions, logging |
| `services/` | API clients, push registration, deep link parsing |
| `plugins/` | Capacitor plugin wrappers with typed interfaces |
| `config/` | Environment-driven configuration |
| `hooks/` | Reusable stateful UI logic |

## Backend layer responsibilities

| Module | Responsibility |
|--------|----------------|
| `routes/` | HTTP surface area; no business logic |
| `middleware/` | Auth, logging, error handling, rate limits |
| `controllers/` | Request/response mapping |
| `services/` | Business logic, external API calls (APNs, FCM, RevenueCat) |
| `repositories/` | Database access via Drizzle |
| `workers/` | Async jobs (push retries, webhook processing) |

## Why separate mobile services from providers

Providers manage React lifecycle and UI state. Services are framework-agnostic and testable. This separation prevents push registration logic from being trapped inside a component tree.

## Common mistakes

- Putting API calls directly in page components
- Mixing environment config with feature flags in one file
- Handling RevenueCat webhooks synchronously in the request thread
- Storing push tokens only on-device without server registration

## Best practices

- One service per external system (APNs, FCM, RevenueCat)
- Idempotent webhook handlers with deduplication keys
- Structured logs with `requestId` propagated mobile → API
- Feature modules added via `examples/` before promotion to `apps/` or `backend/`

## Status

> This document will expand as modules land. Track progress via GitHub Issues.