# Fix: APNs ECONNRESET / Node Process Crashes

**Time:** ~30 minutes  
**Symptom:** Single push works; burst sends crash Node with `ECONNRESET` or `EPIPE`

---

## Step 1 — Attach error handlers (10 min)

APNs HTTP/2 clients throw unhandled errors. Attach listeners:

```typescript
client.on(Errors.error, (err) => {
  logger.error('apns.client_error', { reason: err.reason });
});
```

## Step 2 — Never send from HTTP request handler (10 min)

Queue burst sends. Use a worker with concurrency limit — not a `for` loop in your route.

See: [`modules/push-notifications/server/src/services/apns-service.ts`](../../modules/push-notifications/server/src/services/apns-service.ts)

## Step 3 — Retry transient failures (10 min)

Retry on `503`, `ECONNRESET`, `EPIPE` with exponential backoff.  
Do **not** retry `410 Unregistered` — delete the token.

---

**Postmortem:** [`docs/production-lessons/lesson-03-apns-http2-crashes.md`](../../docs/production-lessons/lesson-03-apns-http2-crashes.md)