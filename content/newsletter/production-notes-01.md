# Production Notes #1 — TestFlight Push Failed

**Module:** Production Push Notifications v1.0

---

## What broke

Push notifications worked in Xcode debug. TestFlight build: zero notifications. Server showed APNs success.

## Why

1. Server sent production tokens to sandbox APNs endpoint
2. AppDelegate token forwarding lost after `cap sync`

## How we fixed it

- Tag tokens with `environment: sandbox | production`
- Route APNs sends by token metadata
- Canonical `AppDelegate.swift` + restore script after sync
- `VITE_IOS_PUSH_ENV=production` for TestFlight builds

## Links

- [Article: Debug vs TestFlight](../articles/capacitor-push-testflight.md)
- [Module Zero](../../modules/push-notifications/)
- [30-min fix: TestFlight](../../recipes/30-minute-fixes/fix-testflight-push.md)
- [Postmortem](../../production-postmortems/2026-06-15-testflight-push-fails.md)
- [Release](https://github.com/Mistakili/production-hybrid-reference/releases/tag/production-push-v1.0)

---

*Template for future issues. Send when you have subscribers.*