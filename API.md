# Marie Maison — API Documentation

Base URL (local): `http://localhost:3000`
All API routes are prefixed with `/api`.

All requests/responses use JSON. `Content-Type: application/json` is required for `POST` and `PUT`.

---

## Health

### `GET /api/health`
Quick liveness check.
```json
{ "status": "ok", "service": "Marie Maison API", "time": "2025-01-01T..." }
```

---

## Products (Full CRUD)

### `GET /api/products`
Returns all products. Optional query: `?category=rings|necklaces|earrings|bracelets|anklets`.

**Response 200**
```json
[
  { "id": 1, "sku": "MM-R-001", "name": "Solitaire Étoile Ring", "category": "rings",
    "price": 2450, "image": "/images/ring-01.jpg",
    "description": "...", "material": "18k Yellow Gold, 0.75ct Diamond" }
]
```

### `GET /api/products/:id`
Returns one product.
- `200` — product object
- `404` — `{ "error": "Product not found" }`

### `POST /api/products`
Creates a new product.

**Body**
```json
{
  "name": "New Ring",            // required
  "category": "rings",           // required
  "price": 1200,                 // required (number)
  "sku": "MM-R-009",             // optional (auto-generated if omitted)
  "image": "/images/ring-01.jpg",// optional
  "description": "Description",  // optional
  "material": "18k Gold"         // optional
}
```
- `201` — created product (with new auto-incremented `id`)
- `400` — `{ "error": "name, category and price are required" }`

### `PUT /api/products/:id`
Updates an existing product. Send only fields you want to change.

**Body** — any subset of: `name, category, price, sku, image, description, material`
- `200` — updated product
- `404` — not found

### `DELETE /api/products/:id`
Deletes a product.
- `200` — `{ "message": "Product deleted", "product": {...} }`
- `404` — not found

---

## Cart (Simple Session Cart)

### `GET /api/cart`
Returns the current cart with full product details and totals.
```json
{
  "items": [
    { "productId": 1, "quantity": 2,
      "product": { ...full product... },
      "subtotal": 4900 }
  ],
  "total": 4900,
  "count": 2
}
```

### `POST /api/cart`
Adds an item to the cart (or increments quantity if already present).

**Body**
```json
{ "productId": 1, "quantity": 1 }   // quantity defaults to 1
```
- `201` — `{ "message": "Added to cart", "cart": [...] }`
- `404` — product not found

### `DELETE /api/cart/:productId`
Removes a single line item from the cart.
- `200` — `{ "message": "Removed from cart", "cart": [...] }`
- `404` — item not in cart

### `DELETE /api/cart`
Empties the entire cart.
- `200` — `{ "message": "Cart cleared", "cart": [] }`

---

## Quick test with curl

```bash
# List all products
curl http://localhost:3000/api/products

# Filter by category
curl http://localhost:3000/api/products?category=rings

# Add a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Ring","category":"rings","price":999}'

# Update a product
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":2500}'

# Delete a product
curl -X DELETE http://localhost:3000/api/products/1

# Add to cart
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId":2,"quantity":1}'

# View cart
curl http://localhost:3000/api/cart
```
