# Recipe: Push Notifications

End-to-end Capacitor push registration with production fixes baked in.

## What this fixes

- Token never reaches JS in release builds (AppDelegate gap)
- Sandbox vs production environment confusion
- Token not re-registered after login
- Permission denial crashes or silent failures

## Files

| File | Purpose |
|------|---------|
| [`push-service.ts`](push-service.ts) | Core registration + listeners |
| [`PushProvider.tsx`](PushProvider.tsx) | React provider |
| [`register-after-auth.ts`](register-after-auth.ts) | Re-register after login |
| [`permission.ts`](permission.ts) | Permission UX helpers |

## Prerequisites

```bash
npm install @capacitor/push-notifications @capacitor/core
```

iOS: Enable Push Notifications capability in Xcode.  
Android: Add `google-services.json`.

## Usage

```tsx
// main.tsx
import { PushProvider } from './providers/PushProvider';

<PushProvider apiBaseUrl={import.meta.env.VITE_API_URL}>
  <App />
</PushProvider>
```

## Critical: pair with AppDelegate recipe

Push will fail in TestFlight without [`../appdelegate/AppDelegate.swift`](../appdelegate/AppDelegate.swift).

## Related

- [Lesson 01: TestFlight push fails](../../docs/production-lessons/lesson-01-testflight-push-fails.md)
- [Push Notifications guide](../../docs/PushNotifications.md)