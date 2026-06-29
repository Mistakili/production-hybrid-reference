# Changelog

## Production Push v1.0 — Module Zero Complete (2026-06-29)

### Added

- **Module Zero** — `modules/push-notifications/` runnable server + mobile demo
- APNs delivery via `apns2` with sandbox/production routing and retry
- Push registration API (`/api/push/register`, `/status`, `/send-test`)
- Mobile demo app integrating `recipes/push-notifications/`
- `scripts/restore-appdelegate.mjs` for post-`cap sync` restore
- `docs/Troubleshooting/push-notifications.md` — symptom-first guide
- `docs/Principles.md` — project philosophy
- `production-postmortems/2026-06-15-testflight-push-fails.md`

### Notes

- Set `APNS_MOCK=true` to run server without Apple credentials
- TestFlight builds require `VITE_IOS_PUSH_ENV=production`
- Physical iOS device required for remote push verification

---

## v0.1.0 — Reference scaffold (2026-06-29)

- Repository structure, recipes, production lessons, GitHub Issues