/**
 * Capacitor push notification service — production reference.
 *
 * Key production behaviors:
 * - Tags tokens with platform + environment (sandbox vs production)
 * - Handles registration, errors, and token refresh
 * - Posts token to backend with app version for debugging
 */

import { Capacitor } from '@capacitor/core';
import {
  PushNotifications,
  type Token,
  type PushNotificationSchema,
  type ActionPerformed,
} from '@capacitor/push-notifications';

export type PushEnvironment = 'sandbox' | 'production';

export interface PushTokenPayload {
  token: string;
  platform: 'ios' | 'android' | 'web';
  environment: PushEnvironment;
  appVersion: string;
}

export interface PushServiceConfig {
  apiBaseUrl: string;
  getAuthToken: () => string | null;
  appVersion: string;
  /**
   * iOS only. TestFlight/App Store = production. Xcode debug = sandbox.
   * Set explicitly — never infer from import.meta.env alone.
   */
  iosEnvironment: PushEnvironment;
  onTokenRegistered?: (payload: PushTokenPayload) => void;
  onNotificationReceived?: (notification: PushNotificationSchema) => void;
  onNotificationAction?: (action: ActionPerformed) => void;
}

export class PushService {
  private listenersAttached = false;

  constructor(private readonly config: PushServiceConfig) {}

  async initialize(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      console.info('[push] Skipping — not native platform');
      return;
    }

    this.attachListeners();
    await PushNotifications.register();
  }

  private attachListeners(): void {
    if (this.listenersAttached) return;
    this.listenersAttached = true;

    PushNotifications.addListener('registration', async (token: Token) => {
      const payload = this.buildTokenPayload(token.value);
      await this.postTokenToBackend(payload);
      this.config.onTokenRegistered?.(payload);
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('[push] registrationError', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      this.config.onNotificationReceived?.(notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      this.config.onNotificationAction?.(action);
    });
  }

  private buildTokenPayload(token: string): PushTokenPayload {
    const platform = Capacitor.getPlatform() as PushTokenPayload['platform'];
    const environment: PushEnvironment =
      platform === 'ios' ? this.config.iosEnvironment : 'production';

    return {
      token,
      platform,
      environment,
      appVersion: this.config.appVersion,
    };
  }

  private async postTokenToBackend(payload: PushTokenPayload): Promise<void> {
    const authToken = this.config.getAuthToken();

    const res = await fetch(`${this.config.apiBaseUrl}/api/push/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`[push] Backend registration failed: ${res.status}`);
    }
  }

  /** Call after login when auth token becomes available */
  async refreshRegistration(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    await PushNotifications.register();
  }
}