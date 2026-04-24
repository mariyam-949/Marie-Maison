# Marie Maison — Full-stack Jewelry Website

A complete full-stack e-commerce demo built for a university assignment.

- **Backend:** Node.js + Express (REST API with full CRUD + cart)
- **Frontend:** Plain HTML / CSS / Vanilla JavaScript (in `/public`)
- **Data:** In-memory store (40 products, 5 categories — `data/products.js`)

## Project Structure

```
marie-maison-fullstack/
├── server.js               # Express entry point
├── package.json
├── API.md                  # API documentation
├── README.md
├── render.yaml             # One-click deploy config for Render
├── data/
│   └── products.js         # In-memory product catalog (40 items)
├── routes/
│   ├── products.js         # /api/products CRUD
│   └── cart.js             # /api/cart endpoints
└── public/                 # Static frontend (served by Express)
    ├── index.html          # Home
    ├── shop.html           # Shop (loads products via fetch)
    ├── product.html        # Product detail
    ├── cart.html           # Cart view
    ├── admin.html          # Admin: add / edit / delete products
    ├── about.html
    ├── contact.html
    ├── css/style.css
    ├── js/app.js           # Shared header/footer/cart helpers
    └── images/             # 48 product & category images
```

## Run Locally

You need **Node.js 18+** installed.

```bash
npm install
npm start
```

Then open <http://localhost:3000>.

## API Overview

| Method | Endpoint                  | Description                  |
|--------|---------------------------|------------------------------|
| GET    | /api/products             | List all products (`?category=` optional) |
| GET    | /api/products/:id         | Single product               |
| POST   | /api/products             | Create product               |
| PUT    | /api/products/:id         | Update product               |
| DELETE | /api/products/:id         | Delete product               |
| GET    | /api/cart                 | View cart                    |
| POST   | /api/cart                 | Add to cart                  |
| DELETE | /api/cart/:productId      | Remove single item           |
| DELETE | /api/cart                 | Empty cart                   |
| GET    | /api/health               | Health check                 |

Full request/response examples → see [API.md](./API.md).

## Frontend ↔ Backend Wiring

All HTML pages call the API with `fetch()`:

- `shop.html` — `GET /api/products` (filters via `?category=`)
- `product.html` — `GET /api/products/:id`
- `admin.html` — `GET / POST / PUT / DELETE /api/products`
- `cart.html` — `GET / DELETE /api/cart` and `POST /api/cart`
- All pages — `GET /api/cart` to keep the header cart count in sync

## Deploying to Render

1. Push this folder to a GitHub repo.
2. On <https://render.com>, click **New → Web Service** and connect your repo.
3. Render will auto-detect `render.yaml` and deploy. Defaults:
   - Build command: `npm install`
   - Start command: `npm start`
4. After deploy, your site is live at `https://your-app.onrender.com`.

## Notes

- The cart and any new products created via the admin panel live in memory. They reset whenever the server restarts. This is intentional for a beginner-friendly assignment — to upgrade to MongoDB, replace `data/products.js` with a Mongoose model and swap the array operations in `routes/*.js` for `Model.find()`, `Model.create()`, etc.
