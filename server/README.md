# Saigon Sister Backend

Node.js, Express, and SQLite API for admin authentication and menu management.

## Setup

Run commands from the `server` folder:

```powershell
cd server
npm install
Copy-Item .env.example .env
```

Edit `.env`:

```env
PORT=3000
DB_PATH=./saigon.db
JWT_SECRET=replace-with-a-long-random-secret

SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
MAIL_FROM=noreply@saigonsisterrestaurant.com

ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password
ADMIN_EMAIL=admin@example.com
```

Use Mailtrap Email Testing credentials during development. Never commit `.env`.

## Create database data

Create the admin account and import the 101 menu items:

```powershell
npm run seed:admin
npm run seed:menu
```

To replace existing menu data with the latest `menu-data.json`:

```powershell
npm run seed:menu:force
```

## Run

```powershell
npm start
```

The API runs at `http://localhost:3000`.

Test the server:

```powershell
Invoke-RestMethod "http://localhost:3000/health"
```

Expected:

```json
{ "ok": true }
```

Restart the server after changing backend code.

## API endpoints

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | No | Check server status |
| POST | `/api/auth/login` | No | Check password and send OTP |
| POST | `/api/auth/verify-otp` | No | Verify OTP and return JWT |
| GET | `/api/menu` | No | Read menu and apply filters |
| POST | `/api/menu` | JWT | Create a menu item |
| PUT | `/api/menu/:id` | JWT | Update a menu item |
| DELETE | `/api/menu/:id` | JWT | Delete a menu item |

## End-to-end test

### 1. Login and send OTP

Use the admin credentials that were present when `npm run seed:admin` was run:

```powershell
$login = @{
  username = "admin"
  password = "your-password"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method POST `
  -Uri "http://localhost:3000/api/auth/login" `
  -ContentType "application/json" `
  -Body $login
```

Expected:

```json
{ "message": "OTP sent to your email" }
```

Open Mailtrap, select My Sandbox, and copy the six-digit OTP. It expires after five minutes.

### 2. Verify OTP and save JWT

Replace `123456` with the OTP from Mailtrap:

```powershell
$otpBody = @{ otp = "123456" } | ConvertTo-Json

$result = Invoke-RestMethod `
  -Method POST `
  -Uri "http://localhost:3000/api/auth/verify-otp" `
  -ContentType "application/json" `
  -Body $otpBody

$token = $result.token
$token
```

The OTP is single-use. Login again if it expires or has already been verified.

### 3. Read the public menu

```powershell
Invoke-RestMethod "http://localhost:3000/api/menu"
Invoke-RestMethod "http://localhost:3000/api/menu?category=breakfast"
Invoke-RestMethod "http://localhost:3000/api/menu?tag=vegan"
Invoke-RestMethod "http://localhost:3000/api/menu?specialty=true"
```

Available categories: `breakfast`, `lunch`, `dinner`, `drink`.

`specialty=true` returns today's entries from `daily_specials`. An empty result is normal when no daily special has been assigned.

### 4. Create a menu item

```powershell
$newItem = @{
  menuNumber = "TEST-1"
  name = "Test Dish"
  description = "Temporary test item"
  price = 9.99
  category = "breakfast"
  tags = @("vegan")
  choices = @()
  addOns = @()
} | ConvertTo-Json

$created = Invoke-RestMethod `
  -Method POST `
  -Uri "http://localhost:3000/api/menu" `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body $newItem

$created
$itemId = $created.id
```

Always use the returned database `id` for update and delete. Do not use `menuNumber`.

### 5. Update the item

```powershell
$update = @{ price = 10.99 } | ConvertTo-Json

Invoke-RestMethod `
  -Method PUT `
  -Uri "http://localhost:3000/api/menu/$itemId" `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body $update
```

### 6. Delete the item

```powershell
Invoke-RestMethod `
  -Method DELETE `
  -Uri "http://localhost:3000/api/menu/$itemId" `
  -Headers @{ Authorization = "Bearer $token" }
```

Expected:

```json
{ "message": "Menu item deleted" }
```

### 7. Test image upload

Use `curl.exe` because Windows PowerShell does not support `Invoke-RestMethod -Form`:

```powershell
curl.exe -X POST "http://localhost:3000/api/menu" `
  -H "Authorization: Bearer $token" `
  -F "name=Image Test Dish" `
  -F "price=12.50" `
  -F "category=lunch" `
  -F "image=@C:\path\to\food.jpg"
```

The response contains an `imageUrl` such as `/uploads/123456789-food.jpg`. Open it at:

```text
http://localhost:3000/uploads/<filename>
```

Delete the test item afterward.

## Negative tests

Wrong password should return `401`:

```powershell
$body = @{ username = "admin"; password = "wrong" } | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/auth/login" -ContentType "application/json" -Body $body
```

Wrong OTP should return `401`:

```powershell
$body = @{ otp = "000000" } | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/auth/verify-otp" -ContentType "application/json" -Body $body
```

Admin write without JWT should return `401`:

```powershell
$body = @{ name = "Blocked"; price = 1; category = "breakfast" } | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/menu" -ContentType "application/json" -Body $body
```

Unknown route should return `404`:

```powershell
Invoke-RestMethod "http://localhost:3000/api/unknown"
```

## Common problems

- `Cannot GET /`: normal, there is no homepage route. Use `/health` or `/api/menu`.
- `Unable to connect`: start the server with `npm start`.
- `Cannot GET /api/menu`: restart the server to load the newest code.
- `ENOTFOUND smtp.example.com`: replace placeholder SMTP values with Mailtrap credentials.
- `Invalid or expired OTP`: login again and use the newest OTP within five minutes.
- `Menu item not found`: use the item's database `id`, not its printed `menuNumber`.
- `-Form parameter not found`: use the `curl.exe` image upload example.
- Changed admin credentials do not work: the existing seeded user is unchanged. Reset the DB or update the user before seeding again.
