# Recipe: AppDelegate

iOS push notifications require `AppDelegate.swift` to forward the device token to Capacitor. **`npx cap sync` can overwrite your edits.**

## Workflow

```
1. Edit recipes/appdelegate/AppDelegate.swift (canonical source)
2. npx cap sync
3. ./scripts/restore-appdelegate.sh   # copies canonical → ios/
4. Verify in Xcode
```

## After every cap sync

```bash
./scripts/restore-appdelegate.sh
```

Or add to `package.json`:

```json
{
  "scripts": {
    "cap:sync": "npx cap sync && ./scripts/restore-appdelegate.sh"
  }
}
```

## Required code

Your `AppDelegate.swift` **must** include:

```swift
NotificationCenter.default.post(
    name: .capacitorDidRegisterForRemoteNotifications,
    object: deviceToken
)
```

Without this, `@capacitor/push-notifications` never receives the token in release builds.

## Related

- [Lesson 02: AppDelegate cap sync](../../docs/production-lessons/lesson-02-appdelegate-cap-sync.md)
- [`AppDelegate.swift`](AppDelegate.swift)