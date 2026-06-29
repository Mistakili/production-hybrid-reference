/**
 * APNs service with environment routing, error handling, and retry.
 *
 * Install a real client when implementing: `apns2` or `@parse/node-apn`
 * This file shows the production structure — swap sendApns() internals.
 */

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

const APNS_HOSTS: Record<APNsEnvironment, string> = {
  sandbox: 'api.sandbox.push.apple.com',
  production: 'api.push.apple.com',
};

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function log(level: string, message: string, context: Record<string, unknown>): void {
  console.log(JSON.stringify({ level, message, timestamp: new Date().toISOString(), ...context }));
}

/**
 * Replace this stub with your APNs HTTP/2 client.
 * Must attach error handlers to the HTTP/2 session — unhandled errors crash Node.
 */
async function sendApns(
  host: string,
  request: APNsSendRequest,
): Promise<APNsSendResult> {
  // TODO: Implement with apns2
  log('info', 'apns.send.stub', {
    host,
    tokenPrefix: request.deviceToken.slice(0, 8),
    environment: request.environment,
  });
  return { success: true, apnsId: 'stub' };
}

export class APNsServiceWithRetry {
  async send(request: APNsSendRequest): Promise<APNsSendResult> {
    const host = APNS_HOSTS[request.environment];

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await sendApns(host, request);

        if (result.reason === 'Unregistered' || result.shouldRemoveToken) {
          log('warn', 'apns.token.invalid', {
            tokenPrefix: request.deviceToken.slice(0, 8),
            environment: request.environment,
          });
          return { ...result, shouldRemoveToken: true };
        }

        if (result.success) {
          log('info', 'apns.send.success', {
            apnsId: result.apnsId,
            environment: request.environment,
            attempt,
          });
          return result;
        }

        // Non-retryable failure
        if (result.reason && !isRetryable(result.reason)) {
          return result;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        const retryable = isRetryable(message);

        log('error', 'apns.send.error', {
          attempt,
          retryable,
          environment: request.environment,
          error: message,
        });

        if (!retryable || attempt === MAX_RETRIES) {
          throw err;
        }

        await sleep(BASE_DELAY_MS * Math.pow(2, attempt - 1));
      }
    }

    return { success: false, reason: 'max_retries_exceeded' };
  }

  /** Queue burst sends — never call send() in a tight loop from a request handler */
  async sendBatch(requests: APNsSendRequest[], concurrency = 5): Promise<APNsSendResult[]> {
    const results: APNsSendResult[] = [];
    const queue = [...requests];

    async function worker(): Promise<void> {
      while (queue.length > 0) {
        const req = queue.shift();
        if (!req) return;
        results.push(await this.send(req));
      }
    }

    await Promise.all(Array.from({ length: concurrency }, () => worker.call(this)));
    return results;
  }
}

function isRetryable(reason: string): boolean {
  return (
    reason.includes('ECONNRESET') ||
    reason.includes('EPIPE') ||
    reason.includes('503') ||
    reason.includes('InternalServerError')
  );
}