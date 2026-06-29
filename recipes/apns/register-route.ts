/**
 * Express route: POST /api/push/register
 * Stores device token with platform + environment for correct APNs routing.
 */

import type { Request, Response } from 'express';

export interface DeviceTokenRecord {
  token: string;
  platform: 'ios' | 'android' | 'web';
  environment: 'sandbox' | 'production';
  appVersion: string;
  userId?: string;
  updatedAt: Date;
}

export interface PushRegisterDeps {
  upsertToken: (record: DeviceTokenRecord) => Promise<void>;
}

export function createPushRegisterHandler(deps: PushRegisterDeps) {
  return async function pushRegister(req: Request, res: Response): Promise<void> {
    const { token, platform, environment, appVersion } = req.body ?? {};

    if (!token || !platform || !environment) {
      res.status(400).json({ error: 'token, platform, and environment are required' });
      return;
    }

    if (platform === 'ios' && !['sandbox', 'production'].includes(environment)) {
      res.status(400).json({ error: 'iOS tokens require environment: sandbox | production' });
      return;
    }

    const userId = (req as Request & { user?: { id: string } }).user?.id;

    await deps.upsertToken({
      token,
      platform,
      environment,
      appVersion: appVersion ?? 'unknown',
      userId,
      updatedAt: new Date(),
    });

    res.status(200).json({ ok: true });
  };
}