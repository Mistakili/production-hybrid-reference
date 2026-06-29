# Fix: TestFlight Push Not Working

**Time:** ~30 minutes  
**Symptom:** Push works in Xcode debug, silent on TestFlight

---

## Step 1 — Confirm the environment mismatch (5 min)

Debug builds use **sandbox** APNs tokens. TestFlight uses **production** tokens.

Check your server logs. If every send goes to `api.sandbox.push.apple.com`, TestFlight will fail.

## Step 2 — Tag tokens at registration (10 min)

Mobile: send `environment` with every token:

```typescript
await fetch(`${API_URL}/api/push/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: deviceToken,
    platform: 'ios',
    environment: 'production', // TestFlight / App Store
    appVersion: '1.0.0',
  }),
});
```

TestFlight `.env`:

```env
VITE_IOS_PUSH_ENV=production
```

## Step 3 — Route server sends by token (10 min)

```typescript
const host =
  token.environment === 'sandbox'
    ? 'api.sandbox.push.apple.com'
    : 'api.push.apple.com';
```

Never use `NODE_ENV` to pick the APNs host.

## Step 4 — Verify (5 min)

1. Install TestFlight build on physical device
2. `GET /api/push/status` → `environment: production`
3. Send test push → notification appears

---

**Full module:** [`modules/push-notifications/`](../../modules/push-notifications/)  
**Troubleshooting:** [`docs/Troubleshooting/push-notifications.md`](../../docs/Troubleshooting/push-notifications.md)