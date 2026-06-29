import cors from 'cors';
import express from 'express';
import { loadEnv } from './config/env.js';
import { createPushRouter } from './routes/push.js';
import { APNsService } from './services/apns-service.js';
import { TokenStore } from './services/token-store.js';
import { log } from './utils/logger.js';

const env = loadEnv();
const app = express();
const store = new TokenStore();
const apns = new APNsService(env);

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    module: 'push-notifications',
    version: '1.0.0',
    apnsConfigured: env.apnsConfigured,
    apnsMock: env.apnsMock,
  });
});

app.use('/api/push', createPushRouter(apns, store));

app.listen(env.port, () => {
  log('info', 'server.started', {
    port: env.port,
    apnsConfigured: env.apnsConfigured,
    apnsMock: env.apnsMock,
  });
  if (!env.apnsConfigured && !env.apnsMock) {
    log('warn', 'server.apns_not_configured', {
      hint: 'Copy .env.example → .env and add your .p8 key, or set APNS_MOCK=true',
    });
  }
});