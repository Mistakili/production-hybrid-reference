/**
 * React provider for push notifications.
 * Requests permission, initializes service, exposes state to UI.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { PushService, type PushTokenPayload } from './push-service';
import {
  getPushPermissionState,
  requestPushPermission,
  type PermissionState,
  PUSH_DENIED_MESSAGE,
} from './permission';

interface PushContextValue {
  permission: PermissionState;
  token: PushTokenPayload | null;
  error: string | null;
  requestPermission: () => Promise<void>;
}

const PushContext = createContext<PushContextValue | null>(null);

export interface PushProviderProps {
  apiBaseUrl: string;
  appVersion: string;
  iosEnvironment: 'sandbox' | 'production';
  getAuthToken: () => string | null;
  children: React.ReactNode;
}

export function PushProvider({
  apiBaseUrl,
  appVersion,
  iosEnvironment,
  getAuthToken,
  children,
}: PushProviderProps) {
  const [permission, setPermission] = useState<PermissionState>('prompt');
  const [token, setToken] = useState<PushTokenPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const service = useMemo(
    () =>
      new PushService({
        apiBaseUrl,
        appVersion,
        iosEnvironment,
        getAuthToken,
        onTokenRegistered: setToken,
      }),
    [apiBaseUrl, appVersion, iosEnvironment, getAuthToken],
  );

  const bootstrap = useCallback(async () => {
    try {
      const state = await getPushPermissionState();
      setPermission(state);

      if (state === 'denied') {
        setError(PUSH_DENIED_MESSAGE);
        return;
      }

      if (state === 'prompt') return;

      await service.initialize();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Push initialization failed');
    }
  }, [service]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const requestPermission = useCallback(async () => {
    const state = await requestPushPermission();
    setPermission(state);

    if (state === 'granted') {
      setError(null);
      await service.initialize();
    } else if (state === 'denied') {
      setError(PUSH_DENIED_MESSAGE);
    }
  }, [service]);

  const value = useMemo(
    () => ({ permission, token, error, requestPermission }),
    [permission, token, error, requestPermission],
  );

  return <PushContext.Provider value={value}>{children}</PushContext.Provider>;
}

export function usePush(): PushContextValue {
  const ctx = useContext(PushContext);
  if (!ctx) throw new Error('usePush must be used within PushProvider');
  return ctx;
}