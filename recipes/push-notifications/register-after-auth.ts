/**
 * Re-register push token after authentication.
 *
 * Common bug: token registered before login, stored without userId,
 * never associated with the authenticated user.
 */

import type { PushService } from './push-service';

export interface AuthPushBridge {
  pushService: PushService;
  onLogin: (userId: string) => Promise<void>;
  onLogout: () => Promise<void>;
}

export function createAuthPushBridge(pushService: PushService): AuthPushBridge {
  return {
    pushService,

    async onLogin(_userId: string) {
      // Re-register so backend can associate token with authenticated user
      await pushService.refreshRegistration();
    },

    async onLogout() {
      // Optional: call backend to invalidate token for this device
      // await fetch(`${apiBaseUrl}/api/push/unregister`, { method: 'POST', ... })
    },
  };
}