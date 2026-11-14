# RentCar · Modern Minimal

Static HTML/CSS/vanilla-JS prototype of the RentCar car-rental marketplace (customer website, rental
provider dashboard and admin dashboard) in the **Modern Minimal** design: white surfaces, one blue, soft
shadows, 10–14px radii, Plus Jakarta Sans. All data is mock data; nothing talks to a server.

## Running it

No build step and no dependencies.

- Double-click `index.html` (works from `file://`), or
- serve the folder, e.g. `npx serve .` or `python -m http.server`, and open the printed URL.

Web fonts load from Google Fonts; all photos are local in `assets/images`.

## Theme

The site always opens in the **light** theme. The sun/moon button in the header (and dashboard top bar)
switches to dark for the current visit; the choice is not saved. The dark theme lives in `css/dark.css`,
scoped to `html[data-theme="dark"]`.

## Pages (hash routes)

| Area | Routes |
|---|---|
| Customer website | `#/` home · `#/search` · `#/vehicle/mercedes-c` (any vehicle id) · `#/signin` · `#/signup` · `#/forgot` |
| Rental provider dashboard | `#/owner/overview` · `#/owner/fleet` · `#/owner/reservations` · `#/owner/calendar` · `#/owner/locations` · `#/owner/messages` |
| Administrator dashboard | `#/admin/overview` · `#/admin/users` · `#/admin/reservations` · `#/admin/reports` |
| Design system | `#/styleguide` |

## Project structure

```
index.html            entry point
css/base.css          neutral reset
css/components.css    component styles (buttons, fields, badges, tables, modals…)
css/styles.css        tokens, layouts and pages
css/dark.css          dark theme
js/icons.js           line-icon set
js/data.js            mock data (vehicles, providers, locations, reservations, users, calendar)
js/core.js            formatting, state, hash router, render loop, toasts, theme
js/ui.js              shared markup helpers
js/interactions.js    front-end behaviour, wired through data-* attributes
js/views.js           page templates and layouts
assets/images/        car and destination photos (see assets/images/CREDITS.md)
```

## Mock data notes

- Prices are stored and shown in **ALL**; EUR is display-only, prefixed with "≈" (1 € = 98.60 ALL, indicative).
- "Today" is fixed to Saturday 14 November 2026. The default search is Tirana, Wed 18 Nov 10:00 → Sat 21 Nov 10:00.

## Image credits

Photos are from Wikimedia Commons (CC BY-SA and similar licences), cropped and resized. See
`assets/images/CREDITS.md`. Review the licences or replace them before production use.
