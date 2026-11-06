# Weather App Frontend

React dashboard for city weather, forecasts, maps, and saved query history.
See the [root README](../README.md) for complete backend/database setup and API
details.

From this directory:

```sh
npm ci
npm start
```

Copy `.env.example` to `.env` before starting if you need to change the API
origin. `REACT_APP_API_BASE_URL` defaults to `http://localhost:5000` and is read
through `src/config.js`. It is included in the browser bundle; never put API
keys or database passwords in frontend environment variables.

`npm run build` creates the production bundle in `build/`. The backend must be
running for weather requests and saved history. Restart or rebuild after
changing the frontend configuration.
