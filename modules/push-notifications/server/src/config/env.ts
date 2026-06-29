import 'dotenv/config';
import fs from 'node:fs';

export interface EnvConfig {
  port: number;
  apnsTeamId: string;
  apnsKeyId: string;
  apnsKeyPath: string;
  apnsBundleId: string;
  apnsMock: boolean;
  apnsConfigured: boolean;
}

function requireIfNotMock(name: string, value: string | undefined, mock: boolean): string {
  if (mock) return value ?? '';
  if (!value) {
    throw new Error(`Missing required env: ${name} (or set APNS_MOCK=true for local UI testing)`);
  }
  return value;
}

const apnsMock = process.env.APNS_MOCK === 'true';

export function loadEnv(): EnvConfig {
  const apnsKeyPath = requireIfNotMock('APNS_KEY_PATH', process.env.APNS_KEY_PATH, apnsMock);
  const apnsConfigured =
    apnsMock ||
    Boolean(
      process.env.APNS_TEAM_ID &&
        process.env.APNS_KEY_ID &&
        process.env.APNS_BUNDLE_ID &&
        apnsKeyPath &&
        fs.existsSync(apnsKeyPath),
    );

  return {
    port: Number(process.env.PORT ?? 3001),
    apnsTeamId: requireIfNotMock('APNS_TEAM_ID', process.env.APNS_TEAM_ID, apnsMock),
    apnsKeyId: requireIfNotMock('APNS_KEY_ID', process.env.APNS_KEY_ID, apnsMock),
    apnsKeyPath,
    apnsBundleId: requireIfNotMock('APNS_BUNDLE_ID', process.env.APNS_BUNDLE_ID, apnsMock),
    apnsMock,
    apnsConfigured,
  };
}