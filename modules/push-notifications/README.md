# Module Zero: Production Push Notifications v1.0

End-to-end Capacitor iOS push — registration, AppDelegate, APNs delivery, TestFlight environment handling.

**Search intent this module owns:** `Capacitor push notifications TestFlight not working`

---

## What's included

| Piece | Path |
|-------|------|
| Runnable server | [`server/`](server/) — Express + `apns2` |
| Runnable mobile demo | [`mobile/`](mobile/) — Capacitor + React |
| Copy-paste recipes | [`../../recipes/push-notifications/`](../../recipes/push-notifications/) |
| AppDelegate | [`../../recipes/appdelegate/`](../../recipes/appdelegate/) |
| Postmortem | [`../../production-postmortems/`](../../production-postmortems/) |
| Troubleshooting | [`../../docs/Troubleshooting/push-notifications.md`](../../docs/Troubleshooting/push-notifications.md) |

---

## Quick start (15 minutes)

### 1. Start the server

```bash
cd modules/push-notifications/server
npm install
cp .env.example .env
```

For UI testing without Apple credentials:

```env
APNS_MOCK=true
```

For real pushes, add your `.p8` key to `secrets/AuthKey.p8` and set `APNS_TEAM_ID`, `APNS_KEY_ID`, `APNS_BUNDLE_ID`.

```bash
npm run dev
# → http://127.0.0.1:3001/health
```

### 2. Start the mobile app

```bash
cd modules/push-notifications/mobile
npm install
cp .env.example .env.local
```

On a **physical device**, set your machine's LAN IP:

```env
VITE_API_URL=http://192.168.1.x:3001
VITE_IOS_PUSH_ENV=sandbox
```

For **TestFlight** builds:

```env
VITE_IOS_PUSH_ENV=production
```

```bash
npm run dev          # browser UI check
npm run build
npx cap add ios      # first time only
npm run cap:sync     # sync + restore AppDelegate
npm run cap:ios      # open Xcode → run on device
```

### 3. Verify

1. Grant notification permission on device
2. Confirm token registered: `GET http://localhost:3001/api/push/status`
3. Tap **Send test push** in the app, or:

```bash
cd server && npm run send-test
```

---

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server + APNs config status |
| `/api/push/register` | POST | Register device token |
| `/api/push/status` | GET | Debug registration state |
| `/api/push/tokens` | GET | List registered tokens (masked) |
| `/api/push/send-test` | POST | Send test notification |

---

## TestFlight checklist

- [ ] `VITE_IOS_PUSH_ENV=production` in release build
- [ ] Server sends to `api.push.apple.com` for production tokens
- [ ] AppDelegate restored after `cap sync`
- [ ] Push capability enabled in Xcode
- [ ] Physical device test before TestFlight upload

---

## Common failures

See [`docs/Troubleshooting/push-notifications.md`](../../docs/Troubleshooting/push-notifications.md).