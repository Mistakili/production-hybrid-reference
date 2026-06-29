# Why Capacitor Push Notifications Work in Debug but Fail in TestFlight

*I lost two days to this. Here's what actually broke — and the fix I open-sourced.*

---

Push notifications are the quiet killer of Capacitor iOS apps.

Everything works in Xcode. `PushNotifications.register()` resolves. Your backend logs show success. You ship to TestFlight. Nothing arrives. No error. No banner. Just silence.

I hit this shipping a commercial Capacitor app. This is the post-mortem — and the [open-source module](https://github.com/Mistakili/production-hybrid-reference/tree/main/modules/push-notifications) I built so you don't repeat it.

---

## The symptoms (if this sounds familiar, keep reading)

- Push works on debug device builds from Xcode
- `registration` listener fires and you get a device token
- Server returns `200` from APNs
- TestFlight build: zero notifications
- iOS Simulator: inconclusive (remote push doesn't work there anyway)

---

## False leads (don't waste time here)

I burned hours on these. They weren't the problem:

1. **Regenerating the `.p8` key** — key was fine
2. **Blaming `@capacitor/push-notifications`** — plugin worked
3. **Testing on Simulator** — remote push requires a physical device
4. **Checking Firebase config** — irrelevant for native iOS APNs path

---

## Root cause #1: Sandbox vs production environment mismatch

This is the big one.

| Build type | APNs environment | Token type |
|------------|------------------|------------|
| Xcode debug | Sandbox | Sandbox token |
| TestFlight / App Store | Production | Production token |

If your server sends all tokens to `api.sandbox.push.apple.com`, **TestFlight tokens never deliver**.

Apple's docs mention this. Capacitor docs don't emphasize it. Stack Overflow answers usually test debug builds only.

**Fix:** Tag every token at registration:

```json
{
  "token": "abc123...",
  "platform": "ios",
  "environment": "production",
  "appVersion": "1.0.0"
}
```

Route sends by token environment — not by `NODE_ENV`:

- `sandbox` → `api.sandbox.push.apple.com`
- `production` → `api.push.apple.com`

In your mobile app, set explicitly for TestFlight builds:

```env
VITE_IOS_PUSH_ENV=production
```

---

## Root cause #2: AppDelegate not forwarding the token

Capacitor requires `AppDelegate.swift` to post the device token to `NotificationCenter`. Without this, JS may never receive the token — especially in release builds.

```swift
func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
) {
    NotificationCenter.default.post(
        name: .capacitorDidRegisterForRemoteNotifications,
        object: deviceToken
    )
}
```

**The gotcha:** `npx cap sync` can overwrite `AppDelegate.swift`. Keep a canonical copy in your repo and restore after every sync.

---

## Root cause #3: Token registered before login

If you register push before authentication, the token sits in your database without a `userId`. After login, you never re-register. Server has a token; user association is wrong.

**Fix:** Call `PushNotifications.register()` again after login.

---

## How to verify (before every TestFlight upload)

1. `GET /api/push/status` — confirm `environment: production`
2. Send test push from server — `{ "success": true }`
3. Notification appears on physical device within 30 seconds
4. Repeat on TestFlight build

---

## The open-source fix

I packaged this as **Module Zero** — a runnable reference, not a tutorial:

**Repo:** https://github.com/Mistakili/production-hybrid-reference

**Release:** https://github.com/Mistakili/production-hybrid-reference/releases/tag/production-push-v1.0

Includes:

- Express server with `apns2` and environment routing
- Capacitor mobile demo
- AppDelegate restore script
- Symptom-first troubleshooting guide
- Production postmortem with measurable impact

```bash
cd modules/push-notifications/server
npm install && cp .env.example .env
# APNS_MOCK=true for API testing without Apple credentials
npm run dev
```

---

## Quick fixes (30 minutes each)

Don't need the full module? Grab one fix:

- [Fix TestFlight push environment](https://github.com/Mistakili/production-hybrid-reference/blob/main/recipes/30-minute-fixes/fix-testflight-push.md)
- [Fix AppDelegate after cap sync](https://github.com/Mistakili/production-hybrid-reference/blob/main/recipes/30-minute-fixes/fix-appdelegate-overwrite.md)
- [Fix push token registration](https://github.com/Mistakili/production-hybrid-reference/blob/main/recipes/30-minute-fixes/fix-push-token-registration.md)

---

## What I'd do differently next time

1. Test push on **TestFlight**, not simulator, before every release
2. Never infer APNs environment from server `NODE_ENV`
3. Add `/api/push/status` debug endpoint from day one
4. Restore AppDelegate in a `postcap:sync` script — non-negotiable

---

## Discussion

Stuck on Capacitor push? [Open a discussion](https://github.com/Mistakili/production-hybrid-reference/discussions) — share symptoms, build type, and what you've tried.

---

*Built from shipping [Veminder](https://github.com/Mistakili). MIT licensed. PRs welcome.*