# Production Hybrid Reference

An open-source reference architecture for building **production-ready hybrid mobile applications** with Capacitor, React, and Node.js.

This is not a starter template and not an end-user application. It is a **consultable reference** — the kind of repository experienced engineers clone when they need to see how production concerns are structured, documented, and implemented.

It is the foundation of [Production Hybrid](https://github.com/Mistakili), a commercial developer toolkit for teams shipping Capacitor apps to the App Store and Google Play.

---

## Who this is for

- **Senior engineers** evaluating architecture before greenfielding a Capacitor project
- **Teams** migrating from prototype to production and needing a checklist-driven path
- **Maintainers** who want modular, documented patterns for push, subscriptions, logging, and deployment
- **Contributors** extending the reference with real production lessons

If you want a copy-paste boilerplate with minimal explanation, this repository is intentionally the wrong choice.

---

## Why this exists

Most Capacitor tutorials stop at `npx cap run ios`. Production apps require:

- Push notification registration across FCM and APNs
- Subscription webhooks (RevenueCat) with idempotent handling
- Environment separation across dev, staging, and production
- Structured logging and error boundaries on mobile and server
- Deep linking, permission flows, and token refresh
- CI/CD, Docker, and deployment documentation

This repository demonstrates **how to structure those concerns** without building a feature-complete product around them.

---

## Repository structure

```
production-hybrid-reference/
├── apps/
│   └── mobile/              # Capacitor + React + Vite reference client
├── backend/                 # Express + PostgreSQL + Drizzle reference API
├── docs/                    # Architecture decisions and production guides
├── examples/                # Isolated, copy-friendly snippets
├── templates/               # Reusable production templates
├── scripts/                 # Setup and maintenance scripts
├── diagrams/                # Architecture diagrams
└── .github/                 # CI workflows and issue templates
```

| Path | Purpose |
|------|---------|
| [`apps/mobile/`](apps/mobile/) | Mobile architecture: services, providers, plugins, config |
| [`backend/`](backend/) | API architecture: controllers, services, workers, middleware |
| [`docs/`](docs/) | Why decisions were made, checklists, troubleshooting |
| [`examples/`](examples/) | Standalone examples (APNs, RevenueCat, deep links, etc.) |
| [`templates/`](templates/) | Drop-in templates for common production modules |

---

## Tech stack

| Layer | Technologies |
|-------|--------------|
| Mobile | React, TypeScript, Capacitor, Vite |
| Backend | Node.js, TypeScript, Express |
| Database | PostgreSQL, Drizzle ORM |
| Push | Firebase Cloud Messaging, Apple Push Notifications |
| Subscriptions | RevenueCat (webhook integration) |
| Ops | Environment config, structured logging, Docker, GitHub Actions |

---

## Prerequisites

- Node.js 20+
- pnpm 9+ (recommended) or npm
- PostgreSQL 15+ (for backend modules)
- Xcode (iOS builds) and/or Android Studio (Android builds)
- Docker (optional, for local Postgres)

---

## Quick start

> **Status:** This repository is built incrementally. See [Roadmap](#roadmap) for module status.

```bash
git clone https://github.com/Mistakili/production-hybrid-reference.git
cd production-hybrid-reference
```

### Mobile (when scaffolded)

```bash
cd apps/mobile
pnpm install
cp .env.example .env.local
pnpm dev
```

### Backend (when scaffolded)

```bash
cd backend
pnpm install
cp .env.example .env
docker compose up -d   # optional: local Postgres
pnpm db:migrate
pnpm dev
```

See [`docs/Environment.md`](docs/Environment.md) for full environment variable reference.

---

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/Architecture.md) | System design and module boundaries |
| [Push Notifications](docs/PushNotifications.md) | FCM + APNs registration and delivery |
| [RevenueCat](docs/RevenueCat.md) | Webhook handling and entitlement sync |
| [Deployment](docs/Deployment.md) | CI/CD, Docker, and release process |
| [Environment](docs/Environment.md) | Config management across environments |
| [Troubleshooting](docs/Troubleshooting.md) | Common production failures |
| [Lessons](docs/Lessons.md) | Real production stories (contributions welcome) |
| [Production Checklist](docs/ProductionChecklist.md) | Pre-launch verification |

---

## Design principles

1. **Clarity over completeness** — Small, readable modules beat sprawling abstractions
2. **Production-ready, not production-finished** — Patterns are real; the demo app stays minimal
3. **Heavily documented** — Every non-obvious decision has a `docs/` explanation
4. **Modular and reusable** — Copy `templates/` or `examples/` without dragging the whole repo
5. **Educational value** — Teach *why*, not just *what*

---

## Roadmap

Modules are tracked as GitHub Issues. Current planned modules:

- [ ] Authentication
- [ ] RevenueCat integration
- [ ] Push Notifications (FCM + APNs)
- [ ] CI/CD pipelines
- [ ] Crash reporting
- [ ] Feature flags
- [ ] Offline sync
- [ ] Background tasks

Browse [open issues](https://github.com/Mistakili/production-hybrid-reference/issues) for status and discussion.

---

## Contributing

We welcome contributions that improve clarity, correctness, or production coverage. See [CONTRIBUTING.md](CONTRIBUTING.md).

Priority areas:

- Production lessons with the [Lessons format](docs/Lessons.md)
- Isolated examples in `examples/`
- Documentation fixes and diagram improvements

---

## License

MIT — see [LICENSE](LICENSE).

---

## Related

- **Production Hybrid** — Commercial toolkit built on this reference (coming soon)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/)