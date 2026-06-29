# Fix: Push Token Never Reaches Backend

**Time:** ~20 minutes  
**Symptom:** Permission granted, but no token in database

---

## Checklist

### 1. Physical device (not Simulator)

Remote push requires a real iPhone.

### 2. AppDelegate forwarding

See [fix-appdelegate-overwrite.md](fix-appdelegate-overwrite.md)

### 3. Permission before register

```typescript
const { receive } = await PushNotifications.requestPermissions();
if (receive !== 'granted') return;
await PushNotifications.register();
```

### 4. API URL reachable from device

`localhost` fails on device. Use LAN IP:

```env
VITE_API_URL=http://192.168.1.10:3001
```

### 5. Re-register after login

```typescript
// After successful auth
await pushService.refreshRegistration();
```

### 6. Debug endpoint

```bash
curl http://localhost:3001/api/push/status
```

---

**Recipe:** [`recipes/push-notifications/`](../push-notifications/)