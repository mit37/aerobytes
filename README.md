# aerobytes

A modern food delivery service that scrapes live data from UCSC dining locations.

## Features

- ✅ Real-time scraping from UCSC nutrition website
- ✅ Server-side scraping (no CORS issues)
- ✅ Caching system (7-minute cache to reduce server load)
- ✅ Graceful error handling
- ✅ No mock data - all data comes from live scraping

## Tech Stack

- **Frontend**: React 18
- **Backend**: Node.js + Express
- **Scraping**: Axios + Cheerio
- **Caching**: In-memory cache with TTL

## Setup

### Install Dependencies

```bash
npm install
```

### Run Development Server

Start both backend and frontend:

```bash
npm run dev
```

Or run them separately:

**Backend (Terminal 1):**
```bash
npm run server
```

**Frontend (Terminal 2):**
```bash
npm start
```

## API Endpoints

### GET `/api/dining-locations`
Returns all available dining locations from UCSC.

**Response:**
```json
[
  {
    "id": "01",
    "name": "Cowell/Stevenson Dining Hall",
    "type": "dining_hall",
    "supports_drone": true,
    "is_open": true
  }
]
```

### GET `/api/menu-items?locationId=<LOCATION_ID>`
Returns menu items for a specific dining location.

**Response:**
```json
[
  {
    "id": "01-pizza",
    "dining_location_id": "01",
    "name": "Pizza",
    "calories": 250,
    "is_available": true
  }
]
```

## Architecture

```
Frontend (React)
   ↓ fetch()
Backend API (Express)
   ↓ axios + cheerio
https://nutrition.sa.ucsc.edu/
```

## Caching

- Cache duration: 7 minutes (configurable in `backend/cache.js`)
- Cache is checked before each scrape
- Stale cache is returned as fallback on errors

## Error Handling

- Network failures return empty arrays (graceful degradation)
- HTML structure changes are handled with multiple selector fallbacks
- Server never crashes - all errors are caught and logged

## Environment Variables

Create a `.env` file (optional):

```
REACT_APP_API_URL=http://localhost:3001
PORT=3001
```

## Notes

- All scraping happens server-side to avoid CORS issues
- No mock data is used - everything comes from live scraping
- The scraper handles multiple HTML structure variations
- Calories are extracted when available, otherwise set to `null`

