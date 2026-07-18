# All@One Vietnamese Kitchen

Frontend website for a Vietnamese restaurant focused on fresh rolls, daily specialties, vegan options, banh mi, chef story, and contact details.

## Pages

- `/` - Home with daily dish announcement, background story, chef info, and moving decorative imagery
- `/menu` - Interactive menu page with categories and menu item structure
- `/contact` - Location, hours, and contact info
- `/admin` - Staff workspace for managing menu and restaurant content

## Run locally

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build check

```powershell
npm run build
```

## Where to edit content

Most restaurant content is in `app/lib/restaurant-data.ts`.

Page layouts are in `app/page.tsx`, `app/menu/page.tsx`, `app/contact/page.tsx`, and `app/admin/page.tsx`.

The visual style is in `app/globals.css`.
