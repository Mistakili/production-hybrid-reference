# Fix: AppDelegate Overwritten After `cap sync`

**Time:** ~15 minutes  
**Symptom:** Push stopped working right after `npx cap sync`

---

## Step 1 — Add token forwarding to AppDelegate (5 min)

`ios/App/App/AppDelegate.swift` must include:

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

Canonical copy: [`recipes/appdelegate/AppDelegate.swift`](../appdelegate/AppDelegate.swift)

## Step 2 — Restore after every sync (5 min)

```bash
node scripts/restore-appdelegate.mjs
```

Or wire into `package.json`:

```json
"cap:sync": "npx cap sync && node ../../../scripts/restore-appdelegate.mjs"
```

## Step 3 — Verify (5 min)

1. Run `npx cap sync`
2. Run restore script
3. Open `AppDelegate.swift` in Xcode — forwarding block present
4. Rebuild to device, confirm token registers

---

**Postmortem:** [`production-postmortems/2026-06-15-testflight-push-fails.md`](../../production-postmortems/2026-06-15-testflight-push-fails.md)