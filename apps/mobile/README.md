# Mobile Reference (`apps/mobile`)

Capacitor + React + Vite reference client.

## Start here (push notifications)

Don't wait for the full scaffold. Copy recipes now:

1. [`recipes/push-notifications/`](../../recipes/push-notifications/)
2. [`recipes/appdelegate/`](../../recipes/appdelegate/)
3. [Lesson 01: TestFlight push fails](../../docs/production-lessons/lesson-01-testflight-push-fails.md)

After `npx cap sync`, run:

```bash
../../scripts/restore-appdelegate.sh
```

## Structure

```
src/
├── components/
├── hooks/
├── services/
├── providers/
├── pages/
├── utils/
├── types/
├── config/
└── plugins/
```

## Status

Full mobile scaffold lands after push module is complete. Track [#10](https://github.com/Mistakili/production-hybrid-reference/issues/10).