# RevenueCat

## Why this architecture exists

In-app subscriptions require client SDK integration **and** server-side webhook handling. The client alone cannot be trusted for entitlement state. RevenueCat webhooks are the source of truth for backend authorization.

## Client responsibilities (mobile)

- Initialize RevenueCat SDK with environment-specific API key
- Identify user after authentication (`Purchases.logIn`)
- Expose entitlement state via a provider (read-only for UI)
- Never gate security-sensitive API calls on client-side entitlement alone

## Server responsibilities (backend)

- Verify webhook signatures
- Handle events idempotently (`INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`, etc.)
- Persist entitlement state in PostgreSQL
- Expose internal entitlement check for API middleware

## Webhook flow

```
RevenueCat → POST /webhooks/revenuecat → signature middleware
         → controller → service (idempotent) → repository
         → 200 OK (always return quickly; queue heavy work)
```

## Common mistakes

- Trusting client-reported subscription status for API access
- No idempotency — duplicate webhooks create duplicate records
- Blocking webhook response on slow downstream operations
- Mixing sandbox and production RevenueCat projects in one environment

## Best practices

- Store `event_id` from webhook payload; reject duplicates
- Use [`templates/RevenueCatWebhook.ts`](../templates/RevenueCatWebhook.ts) as starting point
- See [`recipes/revenuecat/`](../recipes/revenuecat/) for isolated handler

## Related

- [`docs/ProductionChecklist.md`](ProductionChecklist.md#revenuecat)