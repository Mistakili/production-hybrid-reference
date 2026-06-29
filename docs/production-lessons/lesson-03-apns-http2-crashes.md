# Lesson 03: APNs HTTP/2 Socket Crashes in Node.js

**Source:** Shipping [Veminder](https://github.com/Mistakili) backend  
**Module:** APNs server delivery  
**Recipe:** [`recipes/apns/`](../../recipes/apns/)

---

## Problem

Node.js backend crashes intermittently when sending push notifications at scale. Error logs show `ECONNRESET`, `EPIPE`, or unhandled promise rejections from the APNs HTTP/2 client.

## Symptoms

- Push delivery works for single sends
- Under burst traffic (batch notifications), process crashes or hangs
- `ECONNRESET` / `EPIPE` in logs
- PM2/Docker restarts mask the issue; users see delayed or missing pushes
- Issue worse in production than local (connection pool + keep-alive)

## Hours lost

**~8 hours** — including production incident during a scheduled notification send.

## Root cause

APNs HTTP/2 connections are long-lived. Node APNs libraries (`node-apn`, `apns2`) can throw on stale socket reuse. Unhandled errors on the HTTP/2 session crash the Node process if not wrapped. No retry with backoff on transient 503 responses.

## Investigation

1. Correlated crashes with batch send timestamps
2. Found unhandled `'error'` events on HTTP/2 session in stack traces
3. Reproduced with 50 rapid sends from staging
4. Reviewed [node-apn issue threads](https://github.com/node-apn/node-apn) on connection handling

## Fix

1. Wrap APNs client in a service with explicit error handlers on the HTTP/2 session
2. Implement retry with exponential backoff for 503 + `Retry-After`
3. Remove invalid tokens on `410 Unregistered` — don't retry
4. Queue burst sends through a worker with concurrency limit (not fire-and-forget in request handler)
5. See [`recipes/apns/apns-service-with-retry.ts`](../../recipes/apns/apns-service-with-retry.ts)

## Why documentation wasn't enough

- APNs provider API docs describe protocol, not Node.js connection lifecycle
- Most tutorials show `send()` once in a route handler — not production burst patterns

## Lessons learned

- Never call APNs directly from an HTTP request handler for batch sends
- HTTP/2 errors must be **handled**, not thrown into the event loop
- Log `apns-id` and `reason` from every failed send

## Future prevention

- [ ] Worker queue for all push sends
- [ ] Integration test: 20 rapid sends without process crash
- [ ] Alert on APNs error rate > threshold