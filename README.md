# Spiral Sounds / Spiral-Sounds


EN
--

**Description:**

Simple Express server that serves the `public` folder and provides a small REST API for music products. The project demonstrates filtering products by genre and a minimal frontend in `public`.

**Quick Start (Windows / PowerShell):**

1. Install dependencies:

```powershell
npm install
```
```markdown
# Spiral Sounds / Spiral-Sounds

**EN**
--

**Description:**

Simple Express server that serves the `public` folder and provides a small REST API for music products. The project demonstrates filtering products by genre and a minimal frontend in `public`.

**Quick Start (Windows / PowerShell):**

1. Install dependencies:

```powershell
npm install
```

2. Start the server:

```powershell
node server.js
```

The server listens by default on `http://localhost:8000`.

**API (main endpoints):**

- `GET /api/products` — returns all products (JSON).
- `GET /api/products?genre=<genre>` — returns products filtered by the `genre` field.
- `GET /api/products/genres` — returns list of available genres.
- `POST /api/cart/add` — add a product to the logged-in user's cart (body: `{ productId: <number> }`).
- `GET /api/cart` — get cart contents for logged-in user.
- `GET /api/cart/cart-count` — get total items count in cart for logged-in user.
- `DELETE /api/cart/all` — clear all items in logged-in user's cart.
- `DELETE /api/cart/:itemId` — delete a single cart item by id.

Protected routes require a session with `userId` set (see **Auth / Sessions**).

**Database:**

- Local SQLite file: `database.db` at the project root.
- SQL helper scripts for creating tables and seeding live in `sql/` (e.g. `createUsersTable.js`, `createProductsTable.js`, `createCart_itemsTable.js`, `seedProductsTable.js`). Run them with:

```powershell
node sql/createUsersTable.js
node sql/createProductsTable.js
node sql/createCart_itemsTable.js
node sql/seedProductsTable.js
```

**Debugging / Recent fixes & notes:**

- **express-session usage:** The app imports `express-session` and must call `session({...})` — do NOT call `express.session(...)`. Example in `server.js`:

	```js
	import session from 'express-session'
	app.use(session({ secret: process.env.SPIRAL_SESSION_SECRET || 'your-secret' }))
	```

- **Cart router mounting:** Ensure `app.use('/api/cart', cartRouter)` uses a leading slash — otherwise routes like `/api/cart/add` won't be registered.

- **deleteAll behavior (cart):** The server checks the number of items with `SELECT COUNT(*)` and returns `204 No Content` even when the cart is already empty. This prevents the frontend from treating an empty-cart response as an error.

- **Parameter passing to sqlite methods:** Always pass query parameters as an array, e.g. `db.get(query, [userId])` and `db.run(query, [userId])`.

- **Products filtering:** The server builds dynamic WHERE clauses from query params (e.g. `genre`) to make adding more filters straightforward and safe (uses parameterized queries to prevent SQL injection).

- **Middleware export/import:** The middleware `requireAuth` can be exported as default or named. The codebase contains a default export at `middleware/requireAuth.js`:

	```js
	export default function requireAuth(req, res, next) {
		if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' })
		next()
	}
	```

	If you change to a named export, update imports accordingly:

	```js
	// named export
	export function requireAuth(...) { ... }

	// import
	import { requireAuth } from '../middleware/requireAuth.js'
	```

**Auth / Sessions:**

- Sessions use `express-session`. Set a secure `SPIRAL_SESSION_SECRET` in environment for production.
- For testing, you can log in via the project's auth endpoints (if present) or temporarily set `req.session.userId` in a test route.

**Quick manual tests (PowerShell / curl):**

- Get products:

```powershell
curl http://localhost:8000/api/products
```

- Add to cart (requires session/cookie):

```powershell
curl -X POST http://localhost:8000/api/cart/add -H "Content-Type: application/json" -d "{\"productId\":1}"
```

- Clear cart:

```powershell
curl -X DELETE http://localhost:8000/api/cart/all
```

If you test with `curl` you must forward cookies to keep the session, or use the browser frontend that already handles cookies.

**Suggestions & next steps you can add:**

- Add an example login endpoint or a tiny test route that sets `req.session.userId` to make manual testing easier.
- Use a persistent session store (e.g. `connect-sqlite3` or `connect-redis`) for production.
- Add input validation for query params and request bodies (e.g. `validator` package).

---

**PL**
--

**Opis:**

Prosty serwer Express udostępniający katalog `public` oraz REST API dla produktów muzycznych. Projekt pokazuje filtrowanie po gatunku oraz minimalny frontend w `public`.

**Szybki start (Windows / PowerShell):**

1. Zainstaluj zależności:

```powershell
npm install
```

2. Uruchom serwer:

```powershell
node server.js
```

Serwer działa na `http://localhost:8000`.

**Główne endpointy:**

- `GET /api/products` — lista produktów (JSON).
- `GET /api/products?genre=<gatunek>` — produkty filtrowane po `genre`.
- `GET /api/products/genres` — lista dostępnych gatunków.
- `POST /api/cart/add` — dodanie produktu do koszyka zalogowanego użytkownika (body: `{ productId: <liczba> }`).
- `GET /api/cart` — zawartość koszyka zalogowanego użytkownika.
- `GET /api/cart/cart-count` — liczba przedmiotów w koszyku.
- `DELETE /api/cart/all` — wyczyszczenie koszyka zalogowanego użytkownika.
- `DELETE /api/cart/:itemId` — usunięcie pojedynczej pozycji z koszyka.

**Baza danych:**

- Plik SQLite: `database.db` w katalogu projektu.
- Skrypty tworzące tabele i seedujące dane znajdują się w `sql/`. Uruchom je tak:

```powershell
node sql/createUsersTable.js
node sql/createProductsTable.js
node sql/createCart_itemsTable.js
node sql/seedProductsTable.js
```

**Debug / Changelog (ważne poprawki):**

- **express-session:** Używaj `session({...})` z importu `express-session`. Nie wywołuj `express.session(...)`.
- **Montowanie routy koszyka:** Upewnij się, że w `server.js` jest `app.use('/api/cart', cartRouter)` (z ukośnikiem na początku). Brak ukośnika powodował, że trasy nie były dostępne.
- **deleteAll:** Funkcja czyszcząca koszyk używa `COUNT(*)` i zwraca `204` także dla pustego koszyka — to zapobiega zwracaniu błędu do frontendu.
- **Parametry do sqlite:** Przekazuj parametry jako tablicę, np. `db.run(query, [userId])`.
- **Middleware requireAuth:** W repo jest domyślny eksport `export default function requireAuth(...)`. Jeśli zmienisz na named export, pamiętaj o zaktualizowaniu importu.

**Szybkie testy (PowerShell):**

```powershell
curl http://localhost:8000/api/products
curl -X POST http://localhost:8000/api/cart/add -H "Content-Type: application/json" -d "{\"productId\":1}"
curl -X DELETE http://localhost:8000/api/cart/all
```

Pamiętaj: do testów wymagających sesji użyj przeglądarki lub narzędzia, które potrafi zachować ciasteczka.

**Jeśli chcesz, mogę:**

- dodać endpoint testowy, który ustawia `req.session.userId` do szybkich testów;
- dodać przykładowe odpowiedzi JSON dla endpointów;
- dodać instrukcję migracji DB i skrypt `npm run init-db`.

Powiedz, co wolisz, a wprowadzę dalsze zmiany.

```


