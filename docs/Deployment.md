# Deployment

## Overview

This reference supports local development, Docker-based Postgres, and GitHub Actions CI. Production deployment targets are intentionally generic — teams choose Railway, Fly.io, AWS, or bare metal.

## Environments

| Environment | Purpose | Mobile build | API |
|-------------|---------|--------------|-----|
| `development` | Local dev | Debug, sandbox push | localhost |
| `staging` | Pre-release QA | TestFlight / internal track | staging API |
| `production` | App Store / Play Store | Release | production API |

## Mobile release checklist

1. Bump version in `apps/mobile` (semver + build number)
2. Verify environment points to correct API URL
3. Run `cap sync` after native dependency changes
4. Archive via Xcode / build signed AAB for Android
5. Submit with correct push entitlement and RevenueCat keys

## Backend deployment

```bash
# Build
cd backend && pnpm build

# Run migrations before traffic
pnpm db:migrate

# Start (example)
node dist/index.js
```

## Docker

A `docker-compose.yml` will be added with the backend module for local Postgres. Production images should:

- Use multi-stage builds
- Run as non-root
- Inject secrets via environment, never baked into image

## CI/CD (GitHub Actions)

Workflows in `.github/workflows/`:

- **ci.yml** — Lint, typecheck, test on PR
- Future: mobile build verification, Docker publish

## Common mistakes

- Shipping staging API URL in production mobile build
- Running migrations after new code without backward compatibility
- Missing health check endpoint for load balancers

## Related

- [`docs/Environment.md`](Environment.md)
- [`docs/ProductionChecklist.md`](ProductionChecklist.md)