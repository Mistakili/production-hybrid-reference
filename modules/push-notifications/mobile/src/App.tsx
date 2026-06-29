import { PushProvider, usePush } from './push/PushProvider';
import { Capacitor } from '@capacitor/core';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:3001';
const IOS_ENV = (import.meta.env.VITE_IOS_PUSH_ENV ?? 'sandbox') as 'sandbox' | 'production';
const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? '1.0.0';

function PushDemo() {
  const { permission, token, error, requestPermission } = usePush();

  async function sendTestPush() {
    const res = await fetch(`${API_URL}/api/push/send-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const json = await res.json();
    alert(res.ok ? `Sent! ${JSON.stringify(json)}` : `Failed: ${JSON.stringify(json)}`);
  }

  const badgeClass =
    permission === 'granted' ? 'badge-ok' : permission === 'denied' ? 'badge-err' : 'badge-warn';

  return (
    <div className="app">
      <h1>Production Push v1.0</h1>
      <p className="sub">Module Zero — Capacitor iOS push reference</p>

      <div className="card">
        <div className="label">Platform</div>
        <div className="value">{Capacitor.getPlatform()}</div>
      </div>

      <div className="card">
        <div className="label">Permission</div>
        <span className={`badge ${badgeClass}`}>{permission}</span>
        {permission !== 'granted' && (
          <button type="button" onClick={() => void requestPermission()}>
            Enable Push Notifications
          </button>
        )}
      </div>

      <div className="card">
        <div className="label">iOS environment</div>
        <div className="value">{IOS_ENV}</div>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.5rem 0 0' }}>
          TestFlight/App Store builds must use <code>production</code>
        </p>
      </div>

      {token && (
        <div className="card">
          <div className="label">Device token (registered)</div>
          <div className="value">{token.token.slice(0, 16)}…</div>
          <div className="label" style={{ marginTop: '0.75rem' }}>
            Backend
          </div>
          <div className="value">{API_URL}</div>
          <button type="button" onClick={() => void sendTestPush()}>
            Send test push
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <div className="card">
        <div className="label">Verify on device</div>
        <ol className="steps">
          <li>Server running on {API_URL}</li>
          <li>Build to physical iPhone (not simulator for remote push)</li>
          <li>Grant notification permission</li>
          <li>Tap Send test push</li>
          <li>TestFlight? Set VITE_IOS_PUSH_ENV=production</li>
        </ol>
      </div>
    </div>
  );
}

export function App() {
  return (
    <PushProvider
      apiBaseUrl={API_URL}
      appVersion={APP_VERSION}
      iosEnvironment={IOS_ENV}
      getAuthToken={() => null}
    >
      <PushDemo />
    </PushProvider>
  );
}