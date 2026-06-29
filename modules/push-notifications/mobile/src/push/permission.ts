/** Synced from recipes/push-notifications/permission.ts */

import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export type PermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported';

export async function getPushPermissionState(): Promise<PermissionState> {
  if (!Capacitor.isNativePlatform()) return 'unsupported';
  const { receive } = await PushNotifications.checkPermissions();
  if (receive === 'granted') return 'granted';
  if (receive === 'denied') return 'denied';
  return 'prompt';
}

export async function requestPushPermission(): Promise<PermissionState> {
  if (!Capacitor.isNativePlatform()) return 'unsupported';
  const current = await getPushPermissionState();
  if (current === 'granted') return 'granted';
  if (current === 'denied') return 'denied';
  const { receive } = await PushNotifications.requestPermissions();
  return receive === 'granted' ? 'granted' : 'denied';
}

export const PUSH_DENIED_MESSAGE =
  'Notifications are off. Enable them in Settings → Notifications to receive alerts.';