/**
 * CLI: send a test push to the last registered device.
 * Usage: npm run send-test
 */
import 'dotenv/config';

const base = process.env.PUSH_SERVER_URL ?? 'http://127.0.0.1:3001';

const res = await fetch(`${base}/api/push/send-test`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'CLI Test',
    body: 'Sent from npm run send-test',
  }),
});

const json = await res.json();
console.log(res.status, json);
process.exit(res.ok ? 0 : 1);