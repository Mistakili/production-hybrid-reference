# Troubleshooting: Push Notifications

## Symptoms

Push notifications work in Xcode debug but **never arrive on TestFlight** or production builds.

---

## Diagnosis

| Check | How |
|-------|-----|
| Token registered? | `GET /api/push/status` on your push server |
| Correct environment? | Token must be `sandbox` for debug, `production` for TestFlight |
| AppDelegate forwarding? | `AppDelegate.swift` posts `capacitorDidRegisterForRemoteNotifications` |
| APNs host matches token? | Server must not send sandbox tokens to production endpoint |
| Physical device? | Remote push does not work on iOS Simulator |

---

## Root cause (most common)

**APNs environment mismatch.** Debug builds generate sandbox tokens. TestFlight generates production tokens. If your server routes all tokens to one endpoint, one environment silently fails.

Secondary: **AppDelegate not forwarding token** to Capacitor after `cap sync` overwrote your edits.

---

## Fix

1. Tag every token at registration:

```json
{
  "token": "...",
  "platform": "ios",
  "environment": "production",
  "appVersion": "1.0.0"
}
```

2. Route sends by token environment — see [`modules/push-notifications/server/src/services/apns-service.ts`](../../modules/push-notifications/server/src/services/apns-service.ts)

3. Restore AppDelegate after every sync:

```bash
npm run cap:sync
# or
node scripts/restore-appdelegate.mjs
```

4. Set mobile env for TestFlight builds:

```env
VITE_IOS_PUSH_ENV=production
```

---

## How to verify

1. Register on device → `GET /api/push/status` shows `environment: production`
2. `POST /api/push/send-test` returns `{ "success": true }`
3. Notification appears on device within 30 seconds
4. Repeat on TestFlight build before App Store submission

---

## Related

- [Postmortem: TestFlight push fails](../../production-postmortems/2026-06-15-testflight-push-fails.md)
- [Module Zero README](../../modules/push-notifications/README.md)