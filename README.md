# Weather Full-Stack App

A React weather dashboard with an Express API and MySQL query history, built
by Ryan Wang for the PM Accelerator intern assessment.

Search for a city to view current conditions, a five-day forecast, and a map.
Save a weather snapshot with optional date labels, review or delete saved
queries, and export the history as CSV.

## Stack

- **Frontend:** React, Create React App, Axios.
- **Backend:** Node.js, Express, Axios, mysql2.
- **Storage:** MySQL with a JSON column for the weather response.
- **Weather:** OpenWeather current-weather and forecast endpoints.

## Local setup

You need Node.js and npm, a running MySQL server with JSON-column support,
and an OpenWeather API key. Use a Node.js version compatible with the locked
dependencies. Start both services from their own directories so their `.env`
files are loaded correctly.

### 1. Configure the database and backend

```sh
cd backend
npm ci
```

Copy `.env.example` to `.env` (`Copy-Item .env.example .env` in PowerShell,
or `cp .env.example .env` in a POSIX shell). Set the MySQL connection details
and `OPENWEATHER_API_KEY` in that file. The API key stays on the backend.

Create an empty database and a user with access to it using your MySQL
administration tools. Set `DB_NAME` to that database, then run the included
schema against it. For example, from the project root:

```sh
mysql -h localhost -P 3306 -u weather_app -p weather_app
```

At the MySQL prompt:

```sql
SOURCE backend/db/schema.sql;
```

The schema creates `weather_queries` if it does not exist. It does not create
a database/user or migrate an existing table.

From `backend/`, start the API:

```sh
npm start
```

The default endpoint is `http://localhost:5000`. `GET /` returns
`Weather App Backend is running` and does not query MySQL or OpenWeather.
Use `npm run dev` to restart automatically during development.

### 2. Start the frontend

In another terminal, from the project root:

```sh
cd frontend
npm ci
```

Copy `.env.example` to `.env` using the command for your shell above.
`REACT_APP_API_BASE_URL` defaults to `http://localhost:5000`; set it to the
backend origin if you use a different host or port. Then run:

```sh
npm start
```

Open the development URL printed by React, normally `http://localhost:3000`.
Frontend environment variables are embedded in the browser bundle, so only
the API's public base URL belongs there. Restart the development server or
rebuild after changing the frontend environment file.

## Environment settings

| Location | Variable | Purpose |
| --- | --- | --- |
| Backend | `PORT` | API port; defaults to `5000`. |
| Backend | `DB_HOST` | MySQL hostname. |
| Backend | `DB_PORT` | MySQL port; defaults to `3306`. |
| Backend | `DB_USER` | MySQL user. |
| Backend | `DB_PASSWORD` | MySQL password. |
| Backend | `DB_NAME` | Existing database containing `weather_queries`. |
| Backend | `OPENWEATHER_API_KEY` | Server-side OpenWeather credential. |
| Frontend | `REACT_APP_API_BASE_URL` | Backend origin, without `/api/weather`. |

Populated `.env` files are ignored by Git. Commit only the supplied examples.

## API routes

All routes below are relative to `/api/weather`.

| Method | Route | Behavior |
| --- | --- | --- |
| `GET` | `/current?location=London` | Current weather in metric units. |
| `GET` | `/forecast?location=London` | Forecast response, requested at three-hour intervals. |
| `POST` | `/queries` | Fetch and save a current weather snapshot. |
| `GET` | `/queries` | List saved queries, newest first. |
| `GET` | `/queries/:id` | Read one saved query. |
| `PUT` | `/queries/:id` | Update location and/or saved date labels. |
| `DELETE` | `/queries/:id` | Delete a saved query. |
| `GET` | `/export/csv` | Download saved-query metadata as CSV. |

Create/update requests accept `location`, `startDate`, and `endDate` in a JSON
body. Dates are optional labels stored with a snapshot. They do **not** request
historical weather or control the forecast window. The frontend currently
exposes create/read/delete; updates are available through the API.

## Project layout

```text
backend/
  server.js                    Express entry point and health response
  routes/weather.js            API routes
  controllers/weatherController.js
  db/connection.js             MySQL pool configuration
  db/schema.sql                Table setup
  utils/weatherAPI.js          OpenWeather requests
frontend/
  src/App.js                   Dashboard state and API calls
  src/config.js                Configurable API base URL
  src/components/              Search, weather, forecast, map, and history UI
  public/                      Browser metadata and static assets
```

## Checks

```sh
# From backend/
npm run check

# From frontend/
npm run build
```

The backend check validates JavaScript syntax; the frontend command builds the
production bundle. Database CRUD and real weather requests require configured
services and separate runtime verification. No automated application test
suite is currently included.

## Demo limitations

The API has no authentication or per-user history and currently allows CORS
from any origin. It is a local/demo application, not a configured multi-user
deployment. All clients use the same query table.

The location input is passed to OpenWeather's city-query parameter. The UI
also offers coordinates and browser geolocation, but these are not translated
into separate latitude/longitude parameters yet. City searches are the
implemented path. Provider availability and API-key access determine which
weather responses can be retrieved.
