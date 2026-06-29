/**
 * RevenueCatWebhook — idempotent webhook handler template.
 *
 * Mount at POST /webhooks/revenuecat
 * Verify Authorization header against REVENUECAT_WEBHOOK_SECRET.
 */

import type { Request, Response } from 'express';
import { logger } from './ProductionLogger';
import { AppError } from './ErrorMiddleware';

export interface RevenueCatEvent {
  id: string;
  type: string;
  app_user_id: string;
  product_id?: string;
  expiration_at_ms?: number;
}

export interface WebhookDependencies {
  /** Return true if event was already processed */
  isEventProcessed: (eventId: string) => Promise<boolean>;
  markEventProcessed: (event: RevenueCatEvent) => Promise<void>;
  syncEntitlement: (appUserId: string, event: RevenueCatEvent) => Promise<void>;
}

export function createRevenueCatWebhookHandler(deps: WebhookDependencies) {
  return async function revenueCatWebhook(req: Request, res: Response): Promise<void> {
    const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
    const auth = req.headers.authorization;

    if (!secret || auth !== `Bearer ${secret}`) {
      throw new AppError('Unauthorized', 401, 'WEBHOOK_UNAUTHORIZED');
    }

    const event = req.body?.event as RevenueCatEvent | undefined;
    if (!event?.id || !event?.type || !event?.app_user_id) {
      throw new AppError('Invalid webhook payload', 400, 'WEBHOOK_INVALID');
    }

    if (await deps.isEventProcessed(event.id)) {
      logger.info('revenuecat.webhook.duplicate', {
        module: 'revenuecat',
        eventId: event.id,
        type: event.type,
      });
      res.status(200).json({ ok: true, duplicate: true });
      return;
    }

    await deps.syncEntitlement(event.app_user_id, event);
    await deps.markEventProcessed(event);

    logger.info('revenuecat.webhook.processed', {
      module: 'revenuecat',
      eventId: event.id,
      type: event.type,
      appUserId: event.app_user_id,
    });

    res.status(200).json({ ok: true });
  };
}