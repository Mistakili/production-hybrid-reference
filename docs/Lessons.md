# Lessons Learned

Real production stories from teams shipping Capacitor apps. Each lesson follows a consistent format so readers can scan for symptoms they recognize.

Contributions welcome — see [CONTRIBUTING.md](../CONTRIBUTING.md).

---

## Template

```markdown
### [Short descriptive title]

**Problem** —

**Symptoms** —

**Root Cause** —

**Investigation** —

**Fix** —

**Why documentation wasn't enough** —

**Future prevention** —
```

---

## Placeholder: APNs sandbox vs production mismatch

**Problem** — Push notifications worked in TestFlight but never in local debug builds (or vice versa).

**Symptoms** — Backend logs show successful APNs `200` responses; device never displays notification. No errors in Xcode console.

**Root Cause** — *To be filled by contributor.*

**Investigation** — *To be filled by contributor.*

**Fix** — *To be filled by contributor.*

**Why documentation wasn't enough** — *To be filled by contributor.*

**Future prevention** — Add environment tag to every token registration; reject token/platform/environment mismatches at send time.

---

## Placeholder: RevenueCat webhook duplicate processing

**Problem** — Users charged once but entitlement flapped or duplicated in database.

**Symptoms** — Intermittent "premium" access loss; duplicate rows in `subscriptions` table.

**Root Cause** — *To be filled by contributor.*

**Investigation** — *To be filled by contributor.*

**Fix** — *To be filled by contributor.*

**Why documentation wasn't enough** — *To be filled by contributor.*

**Future prevention** — Idempotency key on `event_id`; integration test with replayed webhook payloads.

---

## Placeholder: Capacitor deep link race on cold start

**Problem** — Deep link URL lost when app launched from killed state.

**Symptoms** — User taps marketing link; app opens to home screen instead of target page.

**Root Cause** — *To be filled by contributor.*

**Investigation** — *To be filled by contributor.*

**Fix** — *To be filled by contributor.*

**Why documentation wasn't enough** — *To be filled by contributor.*

**Future prevention** — Register `App.addListener('appUrlOpen')` in root provider before router mounts; queue pending URL.