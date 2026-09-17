# CasaNova — Furniture & Home Goods Store

A complete, working full-stack e-commerce app: a React + Vite frontend and a
Django REST-style API backend, wired together with a real eSewa **sandbox**
(test) payment flow. Cart state lives in memory via Context; orders, stock,
and payment status are persisted in Django/SQLite.

## Quick start (combined — one server, recommended)

The React app can be built once and served directly by Django, so the whole
site — pages, API, and admin — runs from a single command.

```bash
# 1. Build the frontend (only needed again if you change src/)
npm install
npm run build

# 2. Set up and run the backend (serves the built frontend too)
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_products
python manage.py createsuperuser  # optional, for /admin/
python manage.py runserver
```

Open `http://127.0.0.1:8000/` — that's the storefront, API, and admin
(`/admin/`) all served by the one Django process. A pre-migrated, pre-seeded
`db.sqlite3` and a pre-built `dist/` are already included, so `python
manage.py runserver` alone is enough to try it immediately.

## Quick start (separate dev servers)

Useful while actively editing the frontend, since Vite gives instant HMR.

```bash
# Terminal 1 — backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_products
python manage.py runserver

# Terminal 2 — frontend
npm install
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`); it talks to the Django
API at `http://localhost:8000/api` (see `src/api.js`, override with
`VITE_API_URL`).

## Stack

- React 18 + Vite
- React Router v6 (routing across Home / Shop / Product / Cart / Checkout / About)
- Plain CSS with a design-token system (`src/index.css`) — no UI framework
- Fonts: Fraunces (display), Inter (body), JetBrains Mono (prices/specs)

## Structure

```
src/
  main.jsx              entry point, wraps app in Router + API/cart providers
  App.jsx                routes
  index.css              design tokens + all styles
  context/CartContext.jsx  cart state (add/remove/qty, drawer open state)
  api.js                   Django API client
  context/ProductContext.jsx catalog state loaded from Django
  components/
    Navbar.jsx
    Footer.jsx
    ProductCard.jsx
    CartDrawer.jsx
  pages/
    Home.jsx
    Shop.jsx              filterable/sortable product grid
    ProductDetail.jsx     gallery, finish picker, qty, related products
    Cart.jsx
    Checkout.jsx          form + order summary, API order placement
    About.jsx
    NotFound.jsx
```

## Django backend

The Django API lives in `backend/` and stores the catalog and orders in
SQLite. It also serves the built React app (see "Combined" quick start
above) once `dist/` exists — `config/urls.py` routes `/api/*` and `/admin/*`
to Django and everything else to the SPA's `index.html`.

Open the admin dashboard at `http://127.0.0.1:8000/admin/` after creating a
superuser (`python manage.py createsuperuser`). Products, orders, payment
status, stock, and eSewa transaction IDs are managed there.

The React app expects the API at `http://localhost:8000/api` in dev mode
(same origin in combined mode). Set `VITE_API_URL` when the API is hosted
elsewhere. eSewa **sandbox** settings can be customized by copying
`backend/.env.example` to `backend/.env`; it's loaded automatically
(`python-dotenv`), and the same values are also used as defaults in
`settings.py` if no `.env` is present. The included values are eSewa's
public test-merchant sandbox credentials — fine for development, but eSewa's
real sandbox does not accept live payments.

For a real eSewa redirect, eSewa must be able to reach `BACKEND_URL`.
`localhost` works for local form generation, but a public HTTPS tunnel is
needed for callbacks from an external eSewa sandbox service.

Available endpoints are `GET /api/products/`, `GET /api/products/<id>/`,
`POST /api/orders/`, and the eSewa callbacks under `/api/payments/esewa/`.

## Wiring up real data

The app loads products from Django through `src/api.js` and `src/context/ProductContext.jsx`.
The API returns the same product shape the UI expects:
`id, name, category, price, material, dimensions, sku, colors[], image,
gallery[], description, stock`.

## Customizing the design

All colors, fonts, and spacing tokens are defined as CSS variables at the top
of `src/index.css`. Change the palette there and it cascades everywhere.
