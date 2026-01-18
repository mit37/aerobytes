# 🚀 Quick Start Guide

## Step 1: Start the Backend Server

Open **Terminal 1** (PowerShell or Command Prompt):

```powershell
cd C:\Users\mitan\drone-food-delivery
npm run server
```

You should see:
```
Server running on port 3001
Daily scraper scheduled to run at 12:00 AM PST
```

**Keep this terminal open!**

## Step 2: Start the Frontend

Open **Terminal 2** (NEW terminal window):

```powershell
cd C:\Users\mitan\drone-food-delivery
npm start
```

Wait for it to compile and open `http://localhost:3000` in your browser.

## Step 3: Test the Application

1. **Home Page** → Should show all 14 dining locations
2. **Click a location** → Goes to Menu page
3. **Menu Page** → Shows menu items with progress bar
4. **Add items to cart** → Click "Add to Cart" on any item
5. **Cart Page** → Review items, adjust quantities
6. **Checkout** → Fill out form (name, email, phone, address)
7. **Place Order** → Redirects to Order Tracking
8. **Order Tracking** → Shows your order details

## Troubleshooting

### Backend won't start?
- Make sure port 3001 is not in use
- Check for errors in the terminal
- Try: `node server.js` directly

### Frontend won't start?
- Make sure port 3000 is not in use
- Check for errors in the terminal
- Try: `npm start` again

### No data showing?
- Check browser console (F12) for errors
- Check backend terminal for errors
- Make sure backend is running on port 3001

### CORS errors?
- Backend has CORS enabled, should work automatically
- Make sure backend is running before frontend

## Test Endpoints

Once backend is running, test these URLs:

- `http://localhost:3001/api/health` → Should return `{"status":"ok"}`
- `http://localhost:3001/api/dining-locations` → Should return array of locations
- `http://localhost:3001/api/menu-items?locationId=40` → Should return menu items

## What's Working

✅ All 14 dining locations displayed
✅ Menu items for each location
✅ Add to cart functionality
✅ Cart management (add/remove/update quantities)
✅ Checkout form with validation
✅ Order placement and storage
✅ Order tracking page
✅ Progress bars (simulated scraping)
✅ Daily scheduler (runs at 12:00 AM PST)
✅ Data persistence (saved to `data/` folder)

## File Structure

```
drone-food-delivery/
├── server.js              # Backend server
├── backend/
│   ├── scraper.js         # Web scraping logic
│   ├── cache.js           # In-memory cache
│   ├── storage.js         # File storage
│   ├── orders.js          # Order management
│   ├── scheduler.js       # Daily scraper
│   ├── locations.js       # Location fallback list
│   └── mockData.js        # Mock data for display
├── src/
│   ├── pages/
│   │   ├── Home.js        # Home page
│   │   ├── Menu.js        # Menu page
│   │   ├── Cart.js        # Cart page
│   │   ├── Checkout.js    # Checkout page
│   │   └── OrderTracking.js # Order tracking
│   └── context/
│       └── CartContext.js # Cart state management
└── data/                  # Stored data (created automatically)
    ├── locations.json
    ├── menu-items.json
    └── orders.json
```

## Need Help?

Check the backend terminal for logs - it shows what's happening!

