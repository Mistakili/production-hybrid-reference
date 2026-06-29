import fs from 'node:fs';
import { ApnsClient, Notification, Errors } from 'apns2';
import type { EnvConfig } from '../config/env.js';
import { log } from '../utils/logger.js';

export type APNsEnvironment = 'sandbox' | 'production';

export interface APNsSendRequest {
  deviceToken: string;
  title: string;
  body: string;
  environment: APNsEnvironment;
  data?: Record<string, string>;
}

export interface APNsSendResult {
  success: boolean;
  apnsId?: string;
  reason?: string;
  shouldRemoveToken?: boolean;
}

const HOSTS: Record<APNsEnvironment, string> = {
  sandbox: 'api.sandbox.push.apple.com',
  production: 'api.push.apple.com',
};

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(reason: string): boolean {
  return (
    reason.includes('ECONNRESET') ||
    reason.includes('EPIPE') ||
    reason.includes('503') ||
    reason.includes('InternalServerError') ||
    reason.includes('ServiceUnavailable')
  );
}

export class APNsService {
  private clients = new Map<APNsEnvironment, ApnsClient>();

  constructor(private readonly env: EnvConfig) {}

  private getClient(environment: APNsEnvironment): ApnsClient {
    const existing = this.clients.get(environment);
    if (existing) return existing;

    const signingKey = fs.readFileSync(this.env.apnsKeyPath);
    const client = new ApnsClient({
      team: this.env.apnsTeamId,
      keyId: this.env.apnsKeyId,
      signingKey,
      defaultTopic: this.env.apnsBundleId,
      host: HOSTS[environment],
      keepAlive: true,
      requestTimeout: 30_000,
    });

    client.on(Errors.badDeviceToken, (err) => {
      log('warn', 'apns.bad_device_token', {
        reason: err.reason,
        tokenPrefix: err.notification?.deviceToken?.slice(0, 8),
      });
    });

    client.on(Errors.unregistered, (err) => {
      log('warn', 'apns.unregistered', {
        reason: err.reason,
        tokenPrefix: err.notification?.deviceToken?.slice(0, 8),
      });
    });

    client.on(Errors.error, (err) => {
      log('error', 'apns.client_error', {
        reason: err.reason,
        statusCode: err.statusCode,
      });
    });

    this.clients.set(environment, client);
    return client;
  }

  async send(request: APNsSendRequest): Promise<APNsSendResult> {
    if (this.env.apnsMock) {
      log('info', 'apns.mock_send', {
        environment: request.environment,
        tokenPrefix: request.deviceToken.slice(0, 8),
        title: request.title,
      });
      return { success: true, apnsId: 'mock' };
    }

    const client = this.getClient(request.environment);
    const notification = new Notification(request.deviceToken, {
      alert: { title: request.title, body: request.body },
      data: request.data,
    });

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await client.send(notification);
        log('info', 'apns.send.success', {
          environment: request.environment,
          attempt,
          tokenPrefix: request.deviceToken.slice(0, 8),
        });
        return { success: true };
      } catch (err: unknown) {
        const reason =
          err && typeof err === 'object' && 'reason' in err
            ? String((err as { reason: string }).reason)
            : err instanceof Error
              ? err.message
              : String(err);

        const statusCode =
          err && typeof err === 'object' && 'statusCode' in err
            ? Number((err as { statusCode: number }).statusCode)
            : undefined;

        log('error', 'apns.send.failed', { attempt, reason, statusCode, environment: request.environment });

        if (reason === 'BadDeviceToken' || reason === 'Unregistered' || statusCode === 410) {
          return { success: false, reason, shouldRemoveToken: true };
        }

        if (!isRetryable(reason) || attempt === MAX_RETRIES) {
          return { success: false, reason };
        }

        await sleep(BASE_DELAY_MS * Math.pow(2, attempt - 1));
      }
    }

    return { success: false, reason: 'max_retries_exceeded' };
  }
}