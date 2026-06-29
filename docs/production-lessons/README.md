# Production Lessons

Real post-mortems from shipping a commercial Capacitor app. Each lesson documents **hours lost** so you know the pain is real.

## Format

```
Problem
Symptoms
Hours lost
Root cause
Investigation
Fix
Why documentation wasn't enough
Lessons learned
Future prevention
```

## Index

| # | Lesson | Hours |
|---|--------|-------|
| 01 | [TestFlight push fails](lesson-01-testflight-push-fails.md) | ~12h |
| 02 | [AppDelegate lost after cap sync](lesson-02-appdelegate-cap-sync.md) | ~6h |
| 03 | [APNs HTTP/2 crashes](lesson-03-apns-http2-crashes.md) | ~8h |

## Contributing

Shipped a Capacitor production scar? Open a PR with `lesson-NN-short-title.md` using the format above. Real numbers, real fixes.