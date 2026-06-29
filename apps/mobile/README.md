# Mobile Reference (`apps/mobile`)

Capacitor + React + Vite reference client. Intentionally minimal UI — architecture is the product.

## Structure

```
src/
├── components/   # Presentational UI only
├── hooks/        # Reusable stateful logic
├── services/     # API, push, deep links (framework-agnostic)
├── providers/    # React context (auth, push, subscriptions, logging)
├── pages/        # Route composition
├── utils/        # Pure helpers
├── types/        # Shared TypeScript types
├── config/       # Environment validation
└── plugins/      # Capacitor plugin wrappers
```

## Planned modules

- Push notification registration and token refresh
- Permission handling with denial UX
- Deep linking (cold start + warm start)
- Global error boundary and logging
- Environment management via `VITE_*` variables

## Status

Scaffold pending — track via [GitHub Issues](https://github.com/Mistakili/production-hybrid-reference/issues).