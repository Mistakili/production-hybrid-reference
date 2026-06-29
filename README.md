# Production Hybrid Reference

**Stop losing weekends debugging Capacitor production issues.**

This is the canonical open-source reference for shipping Capacitor apps to the App Store — built from real scars encountered while shipping a commercial hybrid application ([Veminder](https://github.com/Mistakili)).

Not a starter template. Not a tutorial app. A **reference implementation** other developers can point to when someone asks: *"Does anyone have a good production Capacitor example?"*

> Developed with Replit for speed. Runs anywhere standard Node.js and Capacitor are supported. No Replit required to clone.

---

## Problems this repository solves

- Push notifications work locally but **fail in TestFlight**
- **AppDelegate changes disappear** after `npx cap sync`
- **RevenueCat entitlement desync** between client and server
- **APNs HTTP/2 disconnects** (`ECONNRESET` / `EPIPE`) in Node.js
- Speech synthesis **blocked on iOS** until user gesture
- **Production vs sandbox** environment confusion
- **Debugging production builds** when logs disappear

Each problem maps to a [production lesson](docs/production-lessons/) with symptoms, hours lost, root cause, and fix.

---

## What's included

| Module | Status | Location |
|--------|--------|----------|
| Push Notifications (FCM + APNs) | 🚧 In progress | [`recipes/push-notifications/`](recipes/push-notifications/) |
| AppDelegate persistence | 🚧 In progress | [`recipes/appdelegate/`](recipes/appdelegate/) |
| APNs server delivery | 🚧 In progress | [`recipes/apns/`](recipes/apns/) |
| RevenueCat webhooks | ⬜ Planned | [`recipes/revenuecat/`](recipes/revenuecat/) |
| Deep links | ⬜ Planned | [`recipes/deep-links/`](recipes/deep-links/) |
| Production logging | ⬜ Planned | [`recipes/logging/`](recipes/logging/) |

Copy-paste templates: [`templates/`](templates/)

---

## Roadmap

| Module | Status |
|--------|--------|
| Push Notifications | 🚧 |
| AppDelegate / `cap sync` | 🚧 |
| RevenueCat | ⬜ |
| Apple Sign In | ⬜ |
| Environment separation | ⬜ |
| Production logging | ⬜ |
| Crash reporting | ⬜ |
| Feature flags | ⬜ |
| Background tasks | ⬜ |
| Offline sync | ⬜ |
| Apple Review checklist | ⬜ |
| CI/CD | ⬜ |

Track detailed work in [GitHub Issues](https://github.com/Mistakili/production-hybrid-reference/issues). Star this repo to follow module releases.

---

## Quick start

```bash
git clone https://github.com/Mistakili/production-hybrid-reference.git
cd production-hybrid-reference
```

**Start here if you're stuck on push:**

1. Read [lesson-01: TestFlight push failures](docs/production-lessons/lesson-01-testflight-push-fails.md)
2. Copy [AppDelegate recipe](recipes/appdelegate/)
3. Copy [push registration recipe](recipes/push-notifications/)
4. Copy [APNs server recipe](recipes/apns/)

Full mobile and backend scaffolds land after push module is complete.

---

## Repository structure

```
production-hybrid-reference/
├── apps/mobile/           # Capacitor + React reference client
├── backend/               # Express + Node reference API
├── docs/                  # Guides, checklists, production lessons
│   └── production-lessons/  # Real post-mortems (hours lost, fixes)
├── recipes/               # Copy-paste production recipes
├── templates/             # Drop-in TypeScript / Swift templates
├── scripts/
├── diagrams/
└── .github/
```

---

## Production lessons

The signature feature. Not generic docs — **post-mortems from shipping**.

| Lesson | Problem | Hours lost |
|--------|---------|------------|
| [lesson-01](docs/production-lessons/lesson-01-testflight-push-fails.md) | Push works locally, fails in TestFlight | ~12h |
| [lesson-02](docs/production-lessons/lesson-02-appdelegate-cap-sync.md) | AppDelegate overwritten after `cap sync` | ~6h |
| [lesson-03](docs/production-lessons/lesson-03-apns-http2-crashes.md) | APNs HTTP/2 socket crashes in Node | ~8h |

[Contributing a lesson →](CONTRIBUTING.md)

---

## Documentation

| Doc | Purpose |
|-----|---------|
| [Push Notifications](docs/PushNotifications.md) | Registration, tokens, FCM + APNs |
| [RevenueCat](docs/RevenueCat.md) | Webhook idempotency, entitlement sync |
| [Architecture](docs/Architecture.md) | Module boundaries |
| [Environment](docs/Environment.md) | Dev / staging / production config |
| [Deployment](docs/Deployment.md) | Release process |
| [Troubleshooting](docs/Troubleshooting.md) | Symptom → fix lookup |
| [Production Checklist](docs/ProductionChecklist.md) | Pre-launch verification |

---

## Tech stack

React · TypeScript · Capacitor · Vite · Node.js · Express · PostgreSQL · Drizzle · FCM · APNs · RevenueCat

---

## Who this is for

Developers who already shipped a Capacitor prototype and hit the production wall. If you're learning Capacitor basics, start with [official docs](https://capacitorjs.com/docs) first.

---

## Commercial toolkit

This open-source reference is the foundation of **Production Hybrid** — a paid developer toolkit (ebook, recipes, premium modules). The OSS repo proves the fixes work before anyone pays.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Priority: production lessons with real hours-lost stories and working recipes.

---

## License

MIT — [LICENSE](LICENSE)