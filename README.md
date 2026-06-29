# Production Hybrid Reference

**Stop losing weekends debugging Capacitor push notifications in TestFlight.**

Canonical open-source reference for shipping Capacitor iOS push to production — built from real postmortems while shipping [Veminder](https://github.com/Mistakili).

---

## Modules

| Module | Version | Status |
|--------|---------|--------|
| **Production Push Notifications** | **v1.0** | ✅ Runnable server + mobile demo |
| RevenueCat | v0.0 | ⬜ Planned |
| Apple Review | v0.0 | ⬜ Planned |
| Background Tasks | — | ⬜ Coming |
| Crash Reporting | — | ⬜ Coming |

**Start here:** [`modules/push-notifications/`](modules/push-notifications/)

---

## Problems this solves

- Push works locally but **fails in TestFlight**
- **AppDelegate overwritten** after `npx cap sync`
- **APNs HTTP/2 crashes** in Node.js (`ECONNRESET` / `EPIPE`)
- Sandbox vs production **environment mismatch**

---

## Quick start (Module Zero)

```bash
git clone https://github.com/Mistakili/production-hybrid-reference.git
cd production-hybrid-reference/modules/push-notifications
```

See **[Module Zero README](modules/push-notifications/README.md)** for full setup.

```bash
# Terminal 1 — server
cd server && npm install && cp .env.example .env
# APNS_MOCK=true for testing without Apple credentials
npm run dev

# Terminal 2 — mobile
cd mobile && npm install && cp .env.example .env.local
npm run build && npx cap add ios && npm run cap:sync && npm run cap:ios
```

Verify: `GET http://localhost:3001/api/push/status` → send test push from app.

---

## Production postmortems

| Date | Story |
|------|-------|
| [2026-06-15](production-postmortems/2026-06-15-testflight-push-fails.md) | TestFlight push failed — environment mismatch |

---

## Recipes

Copy-paste without the full module: [`recipes/`](recipes/)

- [Push notifications](recipes/push-notifications/)
- [AppDelegate](recipes/appdelegate/)
- [APNs server](recipes/apns/)

---

## Troubleshooting

Symptom-first guides: [`docs/Troubleshooting/`](docs/Troubleshooting/)

- [Push notifications](docs/Troubleshooting/push-notifications.md)

---

## Principles

[`docs/Principles.md`](docs/Principles.md) — production over cleverness, real bugs over hypotheticals.

---

## Changelog

[`CHANGELOG.md`](CHANGELOG.md) — **Production Push v1.0** released 2026-06-29.

---

## Contributing

Real production scars welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT — [LICENSE](LICENSE)