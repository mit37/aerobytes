# Scraping & Data Display Guide

## What's Been Implemented

### ✅ Backend Scraper (`backend/scraper.js`)
- **Dining Locations**: Scrapes from `https://nutrition.sa.ucsc.edu/`
  - Extracts location dropdown/select element
  - Gets locationNum (ID) and locationName
  - Returns array of location objects

- **Menu Items**: Scrapes from menu pages
  - Uses proper URL format: `shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=X&locationName=Y&naFlag=1`
  - Parses HTML tables to extract menu items
  - Extracts item names and calories
  - Returns array of menu item objects

### ✅ API Endpoints (`server.js`)
- `GET /api/dining-locations` - Returns all dining locations
- `GET /api/menu-items?locationId=X&locationName=Y` - Returns menu items for a location
- `GET /api/test-scrape` - Test endpoint to verify scraping works

### ✅ Frontend Display
- **Home Page** (`src/pages/Home.js`):
  - Fetches and displays dining locations
  - Shows location cards with name, status, and drone delivery badge
  - Clicking a location navigates to menu page

- **Menu Page** (`src/pages/Menu.js`):
  - Fetches and displays menu items for selected location
  - Shows item name, calories, availability
  - "Add to Cart" button for each item

## How to Test

### 1. Start the Backend Server
```bash
npm run server
```

You should see:
```
Server running on port 3001
```

### 2. Test Scraping (Optional)
Visit: `http://localhost:3001/api/test-scrape`

This will show you if the scraper is working and what locations it finds.

### 3. Test Dining Locations Endpoint
Visit: `http://localhost:3001/api/dining-locations`

Should return JSON array of locations like:
```json
[
  {
    "id": "40",
    "name": "John R. Lewis & College Nine Dining Hall",
    "locationName": "John R. Lewis & College Nine Dining Hall",
    "type": "dining_hall",
    "supports_drone": true,
    "is_open": true
  }
]
```

### 4. Test Menu Items Endpoint
Visit: `http://localhost:3001/api/menu-items?locationId=40&locationName=John+R.+Lewis+%26+College+Nine+Dining+Hall`

Should return JSON array of menu items like:
```json
[
  {
    "id": "40-pizza",
    "dining_location_id": "40",
    "name": "Pizza",
    "calories": 250,
    "is_available": true
  }
]
```

### 5. Start Frontend
```bash
npm start
```

Visit: `http://localhost:3000`

### 6. Check Browser Console
Open browser DevTools (F12) and check:
- Network tab: See API calls
- Console tab: See logs like "Received X dining locations" or "Received X menu items"

### 7. Check Backend Console
Look for logs like:
```
Scraping dining locations from UCSC website...
Fetched page in 1234ms
Found location select element with 5 options
Extracted 5 dining locations: [...]
Found 5 dining locations in 1456ms
```

## Troubleshooting

### No Locations Showing on Home Page
1. Check backend is running: `http://localhost:3001/api/dining-locations`
2. Check browser console for errors
3. Check backend console for scraping errors
4. Try the test endpoint: `http://localhost:3001/api/test-scrape`

### No Menu Items Showing on Menu Page
1. Make sure you selected a location
2. Check backend console for menu scraping logs
3. Check the URL being used (should include locationName and naFlag=1)
4. Try direct API call: `http://localhost:3001/api/menu-items?locationId=40&locationName=...`

### Scraping Takes Too Long
- First request is slow (scraping from UCSC)
- Subsequent requests are fast (cached for 7 minutes)
- Check backend console for timing logs

### CORS Errors
- Make sure backend is running on port 3001
- Check `REACT_APP_API_URL` environment variable
- Backend has CORS enabled, should work automatically

## Data Flow

```
User visits Home Page
  ↓
Frontend calls: GET /api/dining-locations
  ↓
Backend scrapes: https://nutrition.sa.ucsc.edu/
  ↓
Backend returns: Array of locations
  ↓
Home Page displays: Location cards

User clicks location
  ↓
Navigates to: /menu?location=40
  ↓
Frontend calls: GET /api/menu-items?locationId=40&locationName=...
  ↓
Backend scrapes: https://nutrition.sa.ucsc.edu/shortmenu.aspx?...
  ↓
Backend returns: Array of menu items
  ↓
Menu Page displays: Menu item cards with "Add to Cart"
```

## Next Steps for Ordering

The menu items are displayed and can be added to cart. To complete the ordering flow:

1. Items are added to cart (already implemented)
2. User goes to Cart page (already implemented)
3. User goes to Checkout (already implemented)
4. Order is placed (you'll need to add backend endpoint to save orders)
5. Order data can be sent to drone system (you mentioned you'll handle this)

The scraping and display is complete! The data flows from UCSC → Backend → Frontend → Display.

