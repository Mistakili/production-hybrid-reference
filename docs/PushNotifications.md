# Push Notifications

## Why this architecture exists

Push notifications span three systems: the mobile OS, your backend, and a delivery provider (FCM for Android, APNs for iOS). Each has different token formats, permission flows, and failure modes. The reference architecture isolates registration, refresh, and delivery.

## Registration flow

1. Mobile requests OS permission (with graceful denial handling)
2. Device token obtained via Capacitor Push Notifications plugin
3. Token sent to backend with `platform`, `appVersion`, `deviceId`
4. Backend stores token with user association and expiry metadata
5. On token refresh, mobile re-registers; backend upserts

## FCM vs APNs

| Concern | FCM (Android) | APNs (iOS) |
|---------|---------------|------------|
| Token type | FCM registration token | Device token (hex) |
| Server auth | Service account JSON | `.p8` key + Key ID + Team ID |
| Sandbox | N/A (use Firebase project per env) | Separate sandbox vs production endpoint |

## Common mistakes

- Not handling token refresh — silent delivery failures after reinstall
- Using production APNs keys against sandbox builds
- Sending pushes without checking permission state
- No retry with exponential backoff on 5xx from APNs/FCM

## Production lessons

- Always log the **platform** and **environment** with every token registration
- Test permission-denied UX separately from token-registration failures
- Keep `recipes/apns/` and `recipes/appdelegate/` for iOS-specific setup

## Related

- [`recipes/push-notifications/`](../recipes/push-notifications/) — start here
- [`docs/production-lessons/lesson-01-testflight-push-fails.md`](production-lessons/lesson-01-testflight-push-fails.md)
- [`templates/APNSService.ts`](../templates/APNSService.ts)
- [`recipes/apns/`](../recipes/apns/)
- [`docs/ProductionChecklist.md`](ProductionChecklist.md#push-notifications)