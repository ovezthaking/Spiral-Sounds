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

2. Start the server:

```powershell
node server.js
```

The server listens by default on `http://localhost:8000`.

**API:**

- `GET /api/products` — returns all products (JSON).
- `GET /api/products?genre=<genre>` — returns products filtered by the `genre` field.
- `GET /api/products/genres` — (if implemented) returns the list of available genres.

Example (curl / PowerShell):

```powershell
curl http://localhost:8000/api/products
curl "http://localhost:8000/api/products?genre=Rock"
```

**Database:**

The project uses a local DB (files in `db/`). Helper scripts to create and seed the DB are located in `helpers/` (`createTable.js`, `seedTable.js`, `logTable.js`). Run them with `node helpers/<name>.js` to initialize the DB.

**Notes & suggestions:**

- Server builds SQL WHERE clauses dynamically, making it easy to add more query filters.
- Consider validating query inputs and adding an index on the `genre` column if the dataset grows.

---

If you want, I can:
- add brief JSON response examples for the endpoints;
- add instructions on how to create and seed the database (specific commands `node helpers/createTable.js` and `node helpers/seedTable.js`);
- check `package.json` and add a `start` script if missing.

If you want, I can perform one of the above actions — just let me know which one.

PL
--

**Opis:**

Prosty serwer Express udostępniający katalog `public` oraz REST API dla zasobów muzycznych (produkty). Projekt służy jako przykładowe API do filtrowania produktów po gatunku i prostego frontendu w katalogu `public`.

**Szybki start (Windows / PowerShell):**

1. Zainstaluj zależności:

```powershell
npm install
```

2. Uruchom serwer:

```powershell
node server.js
```

Serwer będzie nasłuchiwał domyślnie na `http://localhost:8000`.

**API:**

- `GET /api/products` — zwraca listę wszystkich produktów (JSON).
- `GET /api/products?genre=<gatunek>` — zwraca produkty przefiltrowane po polu `genre`.
- `GET /api/products/genres` — (jeśli jest zaimplementowane) zwraca listę dostępnych gatunków.

Przykład użycia (curl / PowerShell):

```powershell
curl http://localhost:8000/api/products
curl "http://localhost:8000/api/products?genre=Rock"
```

**Baza danych:**

Projekt korzysta z lokalnej bazy (pliki w folderze `db/`). W folderze `helpers/` znajdują się skrypty pomocnicze do tworzenia tabel i seedowania danych (`createTable.js`, `seedTable.js`, `logTable.js`). Uruchom je za pomocą `node helpers/<nazwa>.js` jeśli chcesz zainicjować DB lokalnie.

**Uwagi i sugestie:**

- Filtry są budowane dynamicznie po stronie serwera, dzięki czemu łatwo dodać kolejne parametry zapytań.
- Rozważ dodanie walidacji wejścia i indeksu na kolumnie `genre`, jeśli baza będzie duża.

Jeśli chcesz, mogę:

- dodać krótkie przykłady odpowiedzi JSON dla endpointów;
- dodać instrukcję jak utworzyć bazę i zseedować dane (konkretne komendy `node helpers/createTable.js` i `node helpers/seedTable.js`);
- sprawdzić `package.json` i dodać skrypt `start` jeśli go brakuje.

Jeśli chcesz, wykonam jedną z powyższych akcji — powiedz która.


