# Warranty timer (owner actions)

Admin card: **Warranty**.

| State | Admin UI |
|-------|----------|
| Not started | **Start 30-day warranty** (client clicks once) |
| Active | Countdown, e.g. `29d 14h` |
| Expired | **Expired** + contact `superstrikehsgs@gmail.com` and `giabophannguyen@gmail.com` to extend |

Client cannot clear/renew/extend. Owner uses `TIMER_OWNER_SECRET` only.

## Setup

Local `server/.env`:

```env
PORT=4000
TIMER_OWNER_SECRET=local-owner-timer-secret
```

Railway Variables (then redeploy):

```env
TIMER_OWNER_SECRET=your-production-secret
```

Never put the secret in the frontend.

## Actions

| Action | Effect |
|--------|--------|
| `clear` | Remove timer → Start button again |
| `renew` | Now + 30 days |
| `expire` | Force expired (test contact UI) |

## Local PowerShell (one-liners)

Run from anywhere while API is on port 4000. Secret must match `server/.env`.

### Clear

```powershell
Invoke-RestMethod -Method POST -Uri "http://127.0.0.1:4000/api/timer/owner" -ContentType "application/json" -Body '{"secret":"local-owner-timer-secret","action":"clear"}'
```

### Renew

```powershell
Invoke-RestMethod -Method POST -Uri "http://127.0.0.1:4000/api/timer/owner" -ContentType "application/json" -Body '{"secret":"local-owner-timer-secret","action":"renew"}'
```

### Expire

```powershell
Invoke-RestMethod -Method POST -Uri "http://127.0.0.1:4000/api/timer/owner" -ContentType "application/json" -Body '{"secret":"local-owner-timer-secret","action":"expire"}'
```

Then hard-refresh `http://localhost:3000/admin`.

## Railway Console (one-liners)

Bash + Node (no curl / no PowerShell). Env vars come from Railway after redeploy.

### Clear

```bash
node -e 'fetch("http://127.0.0.1:"+(process.env.PORT||3000)+"/api/timer/owner",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:process.env.TIMER_OWNER_SECRET,action:"clear"})}).then(r=>r.json()).then(console.log).catch(console.error)'
```

### Renew

```bash
node -e 'fetch("http://127.0.0.1:"+(process.env.PORT||3000)+"/api/timer/owner",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:process.env.TIMER_OWNER_SECRET,action:"renew"})}).then(r=>r.json()).then(console.log).catch(console.error)'
```

### Expire

```bash
node -e 'fetch("http://127.0.0.1:"+(process.env.PORT||3000)+"/api/timer/owner",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:process.env.TIMER_OWNER_SECRET,action:"expire"})}).then(r=>r.json()).then(console.log).catch(console.error)'
```

## From PC to Railway public URL (one-liners)

Replace URL + secret with yours.

### Clear

```powershell
Invoke-RestMethod -Method POST -Uri "https://YOUR-RAILWAY-URL/api/timer/owner" -ContentType "application/json" -Body '{"secret":"your-production-secret","action":"clear"}'
```

### Renew

```powershell
Invoke-RestMethod -Method POST -Uri "https://YOUR-RAILWAY-URL/api/timer/owner" -ContentType "application/json" -Body '{"secret":"your-production-secret","action":"renew"}'
```

### Expire

```powershell
Invoke-RestMethod -Method POST -Uri "https://YOUR-RAILWAY-URL/api/timer/owner" -ContentType "application/json" -Body '{"secret":"your-production-secret","action":"expire"}'
```

## Errors

| Result | Cause |
|--------|--------|
| `{"error":"Forbidden"}` | Wrong/missing secret, or API not restarted after `.env` change |
| `{"error":"action must be clear, renew, or expire"}` | Bad action |
| Connection refused | Backend down / wrong port |
| `curl: command not found` | Use Railway Node one-liners |
| `Invoke-RestMethod: command not found` | PowerShell only; on Railway use Node |
