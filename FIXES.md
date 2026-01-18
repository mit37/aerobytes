# Quick Fixes & Troubleshooting

## If Home Page Shows "No dining locations"

1. **Check backend is running:**
   - Open: http://localhost:3001/api/dining-locations
   - Should return JSON array of locations

2. **Check browser console (F12):**
   - Look for CORS errors
   - Look for network errors
   - Check if API_BASE_URL is correct

3. **Restart backend:**
   ```bash
   # Stop backend (Ctrl+C)
   npm run server
   ```

## If Menu Page Shows No Items

1. **Check the location ID:**
   - URL should be: `/menu?location=40`
   - Try different location IDs: 05, 20, 25, 30

2. **Check backend logs:**
   - Should see: "API: Fetching menu items for location X"
   - Should see: "Returning mock menu items"

3. **Test API directly:**
   - http://localhost:3001/api/menu-items?locationId=40

## If Checkout/Order Fails

1. **Check backend is running** (orders need backend)

2. **Check browser console** for errors

3. **Verify form is filled:**
   - Name, Email, Phone, Address are required

4. **Check data/orders.json** file is created after order

## Common Issues

### Port Already in Use
```bash
# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module Not Found
```bash
npm install
```

### CORS Errors
- Backend has CORS enabled
- Make sure backend starts before frontend
- Check backend is on port 3001

### Data Not Saving
- Check `data/` folder exists
- Check file permissions
- Check backend logs for errors

## Test Everything Works

1. **Backend Health:**
   ```
   http://localhost:3001/api/health
   ```

2. **Get Locations:**
   ```
   http://localhost:3001/api/dining-locations
   ```

3. **Get Menu Items:**
   ```
   http://localhost:3001/api/menu-items?locationId=40
   ```

4. **Place Test Order:**
   - Go to menu
   - Add item to cart
   - Go to cart
   - Go to checkout
   - Fill form
   - Place order
   - Should redirect to order tracking

## Still Not Working?

1. Check all files exist (use verify-setup.js)
2. Check backend terminal for errors
3. Check browser console (F12) for errors
4. Make sure you're in the right directory
5. Try restarting both servers

