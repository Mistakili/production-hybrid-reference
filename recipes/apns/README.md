# Recipe: APNs Server Delivery

Node.js APNs send with production-safe error handling.

## What this fixes

- Process crashes from unhandled HTTP/2 `ECONNRESET` / `EPIPE`
- Wrong APNs host (sandbox token → production endpoint)
- Fire-and-forget sends in HTTP handlers under burst load

## Files

| File | Purpose |
|------|---------|
| [`../../modules/push-notifications/server/`](../../modules/push-notifications/server/) | **v1.0 runnable server** with `apns2` |
| [`apns-service-with-retry.ts`](apns-service-with-retry.ts) | Structural template (copy reference) |
| [`register-route.ts`](register-route.ts) | Backend token registration endpoint |

## Environment routing

| Token `environment` | APNs host |
|---------------------|-----------|
| `sandbox` | `api.sandbox.push.apple.com` |
| `production` | `api.push.apple.com` |

**Never** route based on `NODE_ENV` alone.

## Related

- [Lesson 03: APNs HTTP/2 crashes](../../docs/production-lessons/lesson-03-apns-http2-crashes.md)
- [`templates/APNSService.ts`](../../templates/APNSService.ts)