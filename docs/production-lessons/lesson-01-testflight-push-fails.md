# Lesson 01: Push Works Locally, Fails in TestFlight

**Source:** Shipping [Veminder](https://github.com/Mistakili) to TestFlight  
**Module:** Push Notifications  
**Recipe:** [`recipes/push-notifications/`](../../recipes/push-notifications/)

---

## Problem

Push notification registration succeeds in the iOS Simulator and on debug device builds. TestFlight builds never receive notifications. Backend logs show successful APNs delivery attempts.

## Symptoms

- `PushNotifications.register()` resolves without error on device
- Device token appears in backend database
- APNs returns `200` from server
- No notification banner on TestFlight build
- No error in Xcode console (release build strips verbose logs)

## Hours lost

**~12 hours** across two release cycles — mostly re-testing full archive flows and re-checking certificates.

## Root cause

Multiple compounding issues (common in Capacitor apps):

1. **APNs environment mismatch** — Debug builds use sandbox; TestFlight/App Store use production. Backend was sending to sandbox endpoint for all tokens.
2. **AppDelegate not forwarding token** — Capacitor requires explicit `NotificationCenter` posts in `AppDelegate.swift`. Without this, JS never receives the token in release builds.
3. **Token registered before user auth** — Token stored without `userId`, then never re-associated after login.

## Investigation

1. Compared `aps-environment` entitlement between debug and release targets
2. Added server-side logging: `environment`, `tokenPrefix`, `apnsHost`
3. Tested with [Pusher](https://github.com/noodlewerk/NWPusher) against sandbox vs production
4. Inspected `AppDelegate.swift` after `npx cap sync` — custom edits were present but token forwarding block was missing

## Fix

1. Tag every device token with `environment: 'sandbox' | 'production'` at registration time
2. Route APNs sends to correct host based on token metadata, not server `NODE_ENV`
3. Restore AppDelegate token forwarding — see [`recipes/appdelegate/AppDelegate.swift`](../../recipes/appdelegate/AppDelegate.swift)
4. Re-register push token after authentication — see [`recipes/push-notifications/register-after-auth.ts`](../../recipes/push-notifications/register-after-auth.ts)

## Why documentation wasn't enough

- Capacitor docs cover plugin API, not APNs environment matrix across debug/TestFlight/App Store
- Apple's sandbox vs production docs don't mention Capacitor's JS bridge gap
- Most Stack Overflow answers test simulator only

## Lessons learned

- Never infer APNs environment from `NODE_ENV`
- Test push on **TestFlight**, not simulator, before every release
- Add a `/debug/push-status` endpoint that returns last registration metadata

## Future prevention

- [ ] CI check: `AppDelegate.swift` contains `capacitorDidRegisterForRemoteNotifications`
- [ ] Production checklist item: TestFlight push smoke test
- [ ] Server rejects send if token environment ≠ build type