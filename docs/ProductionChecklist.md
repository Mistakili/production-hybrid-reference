# Production Checklist

Use before every App Store / Play Store submission and major backend deploy.

---

## App Store / Play Store

- [ ] Version and build number incremented
- [ ] Release notes prepared
- [ ] Privacy policy URL valid and linked in store listing
- [ ] App icons and screenshots for required device sizes
- [ ] No debug logging enabled in production build
- [ ] `VITE_ENV=production` verified in release build
- [ ] API URL points to production backend
- [ ] Tested on physical devices (not just simulators)

---

## Push Notifications

- [ ] iOS: Push Notifications capability enabled
- [ ] iOS: APNs key (.p8) uploaded / configured on server
- [ ] iOS: Correct APNs environment for build type
- [ ] Android: `google-services.json` is production project
- [ ] Token registration endpoint tested end-to-end
- [ ] Token refresh handler implemented
- [ ] Permission-denied UX tested (no crash, clear messaging)
- [ ] Background notification handling tested (if applicable)

---

## RevenueCat

- [ ] Production RevenueCat project and API keys
- [ ] Webhook URL configured and returning 200
- [ ] Webhook secret set and verified
- [ ] Idempotent event handling tested with replay
- [ ] Restore purchases flow tested
- [ ] Subscription management link works (App Store / Play)

---

## Logging

- [ ] Structured JSON logs on backend
- [ ] Log levels appropriate for production (`info`, not `debug`)
- [ ] No PII in logs (tokens, emails masked)
- [ ] `requestId` correlation mobile → API
- [ ] Error boundaries on mobile catch and report UI crashes
- [ ] Log retention and access policy defined

---

## Security

- [ ] All secrets in environment variables / secret manager
- [ ] No `.p8`, `.p12`, or service account JSON in repo
- [ ] HTTPS only for production API
- [ ] Auth middleware on protected routes
- [ ] Rate limiting on public endpoints
- [ ] Webhook signature verification enabled
- [ ] Dependency audit run (`pnpm audit`)

---

## Environment

- [ ] Separate Firebase projects per environment
- [ ] Separate RevenueCat projects per environment
- [ ] Database backups configured for production
- [ ] Migration strategy documented (expand/contract)
- [ ] Rollback plan documented
- [ ] Health check endpoint monitored

---

## CI/CD

- [ ] CI passes on release branch
- [ ] Docker image tagged with git SHA (if applicable)
- [ ] Migrations run before new code serves traffic
- [ ] Smoke test after deploy