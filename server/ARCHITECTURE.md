# Saigon Sister: Backend Architecture

> **774 Yonge Street, Toronto** · Node.js + Express + SQLite

Reference doc for database design, auth flow, and API shape.


---

## System overview

![Menu and daily specials ER diagram](/server/system-overview.png)

---



## ER diagram (4 tables)



### Menu and daily specials

![Menu and daily specials ER diagram](/server/er-menu-daily-specials.png)

### Users and OTP verifications

![Users and OTP ER diagram](/server/er-users-otp.png)

### Table notes


| Table               | Purpose                                                           |
| ------------------- | ----------------------------------------------------------------- |
| `users`             | Single admin account (username + bcrypt password + email for OTP) |
| `menu_items`        | Full menu; `category` is one of four fixed values                 |
| `otp_verifications` | Temporary 6-digit codes; expire after 5 minutes                   |
| `daily_specials`    | Which menu item is featured on which date                         |


---



## OTP workflow

![OTP and session workflow](/server/otp-workflow.png)


| Step | Endpoint                    | Auth                            |
| ---- | --------------------------- | ------------------------------- |
| 1    | `POST /api/auth/login`      | Public                          |
| 2    | Email OTP (nodemailer)      | n/a                             |
| 3    | `POST /api/auth/verify-otp` | Public, returns JWT             |
| 4    | Menu write routes           | `Authorization: Bearer <token>` |


Mail sent **from** `noreply@saigonsisterrestaurant.com` **to** admin `users.email`.

After JWT: admin CRUD on `menu_items`, assign `daily_specials` by date, public frontend reads menu and specials.

---



## Menu taxonomy



### Categories (4 only)

```
breakfast · lunch · dinner · drink
```

Stored on `menu_items.category`. API filter: `GET /api/menu?category=lunch`

### Tags (5)


| Tag        | Meaning                      |
| ---------- | ---------------------------- |
| `vegan`    | Plant-based option           |
| `must-try` | House signature              |
| `creation` | Saigon Sister original       |
| `spicy`    | Spicy dish or rim            |
| `seafood`  | Fish, shrimp, tuna, calamari |


Stored as JSON array on `menu_items.tags`. API filter: `GET /api/menu?tag=vegan`

Seed data: `[menu-data.json](./menu-data.json)`, 101 items.

---



## API map

![API MAP](/server/api-map.png)

---
