import { Router } from 'express';
import type { APNsService } from '../services/apns-service.js';
import type { TokenStore, StoredToken } from '../services/token-store.js';
import { log } from '../utils/logger.js';

export function createPushRouter(apns: APNsService, store: TokenStore): Router {
  const router = Router();

  router.post('/register', (req, res) => {
    const { token, platform, environment, appVersion } = req.body ?? {};

    if (!token || !platform || !environment) {
      res.status(400).json({ error: 'token, platform, and environment are required' });
      return;
    }

    if (platform === 'ios' && !['sandbox', 'production'].includes(environment)) {
      res.status(400).json({ error: 'iOS requires environment: sandbox | production' });
      return;
    }

    const record: StoredToken = {
      token,
      platform,
      environment,
      appVersion: appVersion ?? 'unknown',
      updatedAt: new Date(),
    };

    store.upsert(record);
    log('info', 'push.token.registered', {
      platform,
      environment,
      tokenPrefix: token.slice(0, 8),
      appVersion: record.appVersion,
    });

    res.json({ ok: true });
  });

  router.get('/tokens', (_req, res) => {
    res.json({
      count: store.list().length,
      tokens: store.list().map((t) => ({
        tokenPrefix: t.token.slice(0, 8) + '…',
        platform: t.platform,
        environment: t.environment,
        appVersion: t.appVersion,
        updatedAt: t.updatedAt,
      })),
    });
  });

  router.get('/status', (_req, res) => {
    const tokens = store.list();
    const latest = tokens[0];
    res.json({
      registeredDevices: tokens.length,
      latestRegistration: latest
        ? {
            platform: latest.platform,
            environment: latest.environment,
            appVersion: latest.appVersion,
            updatedAt: latest.updatedAt,
            tokenPrefix: latest.token.slice(0, 8) + '…',
          }
        : null,
    });
  });

  router.post('/send-test', async (req, res) => {
    const { token, title, body } = req.body ?? {};
    const stored = token ? store.get(token) : store.list()[0];

    if (!stored) {
      res.status(404).json({ error: 'No device token registered. Open the mobile app on a device first.' });
      return;
    }

    const result = await apns.send({
      deviceToken: stored.token,
      title: title ?? 'Production Hybrid',
      body: body ?? 'Module Zero — push is working.',
      environment: stored.environment,
      data: { source: 'module-zero' },
    });

    if (result.shouldRemoveToken) {
      store.remove(stored.token);
    }

    res.status(result.success ? 200 : 502).json(result);
  });

  return router;
}