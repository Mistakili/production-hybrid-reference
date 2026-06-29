# Postmortem: TestFlight Push Notifications Failed

**Date:** 2026-06-15  
**App:** Veminder (commercial Capacitor hybrid)  
**Module:** Production Push Notifications v1.0

---

## What happened

Push notifications worked during local Xcode debugging. First TestFlight build shipped without working push. Users and internal testers never received notifications. Server logs showed successful APNs API responses.

## Impact

| Metric | Value |
|--------|-------|
| Users affected | All TestFlight testers (~40) |
| Release blocked? | No — but launch feature degraded |
| Time to diagnose | ~8 hours |
| Time to fix | ~4 hours |
| Could monitoring have caught it? | Yes — environment mismatch alert on token/send |
| Preventable? | Yes |

## Symptoms

- `PushNotifications.register()` succeeds on device
- Device token stored in backend
- APNs HTTP 200 from server
- No notification on TestFlight build
- No errors in release build console

## False leads

1. **Assumed broken APNs key** — regenerated `.p8`, wasted 2 hours
2. **Blamed Capacitor plugin** — plugin worked; environment routing didn't
3. **Tested on simulator** — inconclusive; remote push requires device
4. **Checked Firebase** — irrelevant for iOS APNs path

## Root cause

Server sent all iOS tokens to the **sandbox** APNs endpoint. TestFlight builds produce **production** tokens. Apple accepts the request in some cases but devices never display notifications.

Compounding issue: `AppDelegate.swift` token forwarding was lost after `npx cap sync`, so earlier debug builds intermittently failed token registration in JS.

## Fix

1. Store `environment: sandbox | production` on every token at registration
2. Route APNs sends to `api.sandbox.push.apple.com` or `api.push.apple.com` based on token
3. Canonical `AppDelegate.swift` in repo + restore script after `cap sync`
4. `VITE_IOS_PUSH_ENV=production` for TestFlight release builds

Implemented in [`modules/push-notifications/`](../../modules/push-notifications/).

## How to detect it next time

- Alert when `token.environment` ≠ `apns.host` for a send
- `/api/push/status` debug endpoint showing last registration environment
- TestFlight smoke test in release checklist before upload

## References

- [Troubleshooting: Push Notifications](../docs/Troubleshooting/push-notifications.md)
- [Lesson 01](../docs/production-lessons/lesson-01-testflight-push-fails.md)
- [Apple: APNs environments](https://developer.apple.com/documentation/usernotifications)