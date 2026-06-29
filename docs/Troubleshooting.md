# Troubleshooting

Quick reference for common production issues in Capacitor hybrid apps.

---

## Push notifications not received (iOS)

**Check:**

1. Correct APNs environment (sandbox vs production) for build type
2. Push capability enabled in Xcode
3. Device token registered on backend (check logs for `platform: ios`)
4. `AppDelegate` forwards token to Capacitor — see `examples/appdelegate/`

**Logs to search:** `push.register`, `apns.send`, `token.refresh`

---

## Push notifications not received (Android)

**Check:**

1. `google-services.json` matches Firebase project
2. FCM token sent to backend with correct `platform: android`
3. Notification channel created (Android 8+)

---

## RevenueCat entitlements out of sync

**Check:**

1. Webhook endpoint reachable from RevenueCat dashboard
2. Webhook secret matches `REVENUECAT_WEBHOOK_SECRET`
3. Duplicate events handled — search logs for `event_id` collisions
4. User identified with same `app_user_id` on client and webhook

---

## Deep links not opening app

**Check:**

1. Universal Links / App Links configured in native project
2. `apple-app-site-association` hosted with correct content-type
3. Capacitor `App` plugin listener registered before first navigation

See `examples/deep-links/`.

---

## API works in browser, fails on device

**Check:**

1. `VITE_API_URL` uses machine IP or deployed URL, not `localhost`
2. ATS (iOS) / cleartext (Android) rules for HTTP in dev
3. CORS allows mobile origin if using web fallback

---

## Contributing fixes

Found a new pitfall? Add a section here and a full lesson in [`Lessons.md`](Lessons.md).