# TripCraft — Travel Itinerary Planner

A full-stack 3-tier web application for planning and managing travel itineraries.

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18 + Vite + Tailwind CSS          |
| Backend  | Node.js + Express                       |
| Database | Microsoft SQL Server / Azure SQL        |

---

## Project Structure

```
travel-planner/
├── backend/
│   ├── config/
│   │   └── db.js                  # SQL Server connection pool
│   ├── controllers/
│   │   ├── tripController.js      # Trip CRUD logic
│   │   └── activityController.js  # Activity CRUD logic
│   ├── routes/
│   │   ├── tripRoutes.js          # /trips + nested activity routes
│   │   └── activityRoutes.js      # /activities standalone routes
│   ├── database/
│   │   └── schema.sql             # Idempotent table + index creation
│   ├── app.js                     # Express app, middleware, routes
│   ├── server.js                  # Entry point — connects DB, starts server
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js             # Axios client with trip/activity helpers
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── TripForm.jsx
│   │   │   ├── TripCard.jsx
│   │   │   ├── TripList.jsx
│   │   │   ├── ActivityForm.jsx
│   │   │   ├── ActivityCard.jsx
│   │   │   └── ActivityList.jsx
│   │   ├── App.jsx                # Main layout + state management
│   │   ├── main.jsx
│   │   └── index.css              # Tailwind + reusable component classes
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Prerequisites

- **Node.js** 18+
- **npm** 9+ (or yarn)
- A **Microsoft SQL Server** instance (local or Azure SQL Database)

---

## Database Setup

1. Connect to your SQL Server instance using SSMS, Azure Data Studio, or `sqlcmd`.

2. Create the database (if it does not already exist):
   ```sql
   CREATE DATABASE TravelPlannerDB;
   ```

3. Run the schema script to create tables and indexes:
   ```bash
   # Using sqlcmd
   sqlcmd -S <server> -U <user> -P <password> -d TravelPlannerDB -i backend/database/schema.sql
   ```
   The script is fully idempotent — safe to run multiple times.

---

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DB_SERVER=your-server.database.windows.net
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=TravelPlannerDB
DB_PORT=1433
PORT=5000
NODE_ENV=development
ALLOWED_ORIGIN=http://localhost:3000
```

Start the server:

```bash
# Development (auto-reload on save)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.  
Health check: `GET http://localhost:5000/health`

---

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## API Reference

### Trips

| Method | Endpoint       | Description                         | Body                                  |
|--------|----------------|-------------------------------------|---------------------------------------|
| GET    | /trips         | List all trips                      | —                                     |
| POST   | /trips         | Create a trip                       | `{ destination, startDate, endDate }` |
| DELETE | /trips/:id     | Delete a trip (cascades activities) | —                                     |

### Activities

| Method | Endpoint                      | Description              | Body                                  |
|--------|-------------------------------|--------------------------|---------------------------------------|
| GET    | /trips/:tripId/activities     | List activities for trip | —                                     |
| POST   | /trips/:tripId/activities     | Add activity to trip     | `{ title, activityDate, notes? }`     |
| DELETE | /activities/:id               | Delete an activity       | —                                     |

### Example Requests

**Create a trip:**
```json
POST /trips
{
  "destination": "Tokyo, Japan",
  "startDate": "2024-03-01",
  "endDate": "2024-03-15"
}
```

**Add an activity:**
```json
POST /trips/1/activities
{
  "title": "Visit Senso-ji Temple",
  "activityDate": "2024-03-02",
  "notes": "Arrive early to beat the crowds. Wear comfortable shoes."
}
```

---

## Azure App Service Deployment

### Backend

1. **Create an Azure App Service** — choose **Node.js 18 LTS** as the runtime stack.

2. **Set Application Settings** (Environment Variables) in the Azure portal under *Configuration → Application settings*:

   | Name             | Value                          |
   |------------------|--------------------------------|
   | `DB_SERVER`      | your-server.database.windows.net |
   | `DB_USER`        | your-username                  |
   | `DB_PASSWORD`    | your-password                  |
   | `DB_NAME`        | TravelPlannerDB                |
   | `DB_PORT`        | 1433                           |
   | `NODE_ENV`       | production                     |
   | `ALLOWED_ORIGIN` | https://your-frontend-url.com  |

3. **Set the startup command** under *Configuration → General settings*:
   ```
   node server.js
   ```

4. **Deploy** via GitHub Actions, Azure CLI, or the VS Code Azure extension.

> The `encrypt: true` option in `config/db.js` is already set for Azure SQL compatibility.

### Frontend

1. Build the production bundle (pointing to your deployed backend):
   ```bash
   cd frontend
   VITE_API_URL=https://your-backend.azurewebsites.net npm run build
   ```

2. Deploy the generated `frontend/dist/` folder to one of:
   - **Azure Static Web Apps** (recommended — free tier available)
   - **Azure Blob Storage** with Static Website hosting
   - Any static CDN or host (Vercel, Netlify, Cloudflare Pages)

---

## Development Notes

- All SQL queries use **parameterized inputs** — no string concatenation, no SQL injection.
- The backend uses a **connection pool** (max 10 connections) via the `mssql` package.
- `encrypt: true` + `trustServerCertificate: false` (production) ensures TLS for Azure SQL.
- Trip deletion **cascades** to activities both at the application layer (controller) and database layer (`ON DELETE CASCADE`).
- Dates are handled carefully on the frontend to avoid UTC timezone shift issues.
