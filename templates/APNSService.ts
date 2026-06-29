/**
 * APNSService — Apple Push Notification service template.
 *
 * Requires: APNS_KEY_ID, APNS_TEAM_ID, APNS_KEY_PATH, APNS_BUNDLE_ID
 * Use HTTP/2 provider API. Implement retry with exponential backoff in production.
 *
 * This is a structural template — install `@parse/node-apn` or use `apns2` when implementing.
 */

import { logger } from './ProductionLogger';

export interface APNsPayload {
  deviceToken: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  /** sandbox for debug/TestFlight dev builds; production for App Store */
  environment: 'sandbox' | 'production';
}

export interface APNsSendResult {
  success: boolean;
  apnsId?: string;
  reason?: string;
}

export class APNsService {
  private readonly keyId: string;
  private readonly teamId: string;
  private readonly bundleId: string;

  constructor() {
    this.keyId = process.env.APNS_KEY_ID ?? '';
    this.teamId = process.env.APNS_TEAM_ID ?? '';
    this.bundleId = process.env.APNS_BUNDLE_ID ?? '';

    if (!this.keyId || !this.teamId || !this.bundleId) {
      throw new Error('APNs environment variables are not configured');
    }
  }

  /**
   * Send a push notification. Replace stub with real HTTP/2 APNs client.
   */
  async send(payload: APNsPayload): Promise<APNsSendResult> {
    logger.info('apns.send.attempt', {
      module: 'apns',
      environment: payload.environment,
      tokenPrefix: payload.deviceToken.slice(0, 8),
    });

    // TODO: Implement with @parse/node-apn or apns2
    // - JWT auth from .p8 key
    // - Retry on 503 with Retry-After header
    // - Remove invalid tokens (410 Unregistered)

    return {
      success: false,
      reason: 'NOT_IMPLEMENTED — replace stub with APNs HTTP/2 client',
    };
  }
}