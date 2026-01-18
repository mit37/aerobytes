# Troubleshooting: "You need to enable JavaScript" Message

## What This Means

The noscript message appears when:
1. **JavaScript is disabled** in your browser
2. **React app isn't loading** (frontend server not running)
3. **JavaScript error** preventing the app from starting

## Quick Fixes

### 1. Check if Frontend is Running

**Backend is running** ✅ (port 3001)
**Frontend needs to be running** ❌ (port 3000)

**Start the frontend:**
```powershell
npm start
```

Or double-click `START_FRONTEND.bat`

### 2. Enable JavaScript in Browser

**Chrome/Edge:**
- Settings → Privacy and security → Site settings → JavaScript → Allowed

**Firefox:**
- Settings → Privacy & Security → Permissions → Enable JavaScript

**Safari:**
- Preferences → Security → Enable JavaScript

### 3. Check Browser Console

Press **F12** → **Console** tab
- Look for red error messages
- Common errors:
  - `Failed to fetch` → Backend not running
  - `Cannot find module` → Run `npm install`
  - `CORS error` → Backend CORS not enabled

### 4. Verify Both Servers Are Running

**Backend (Port 3001):**
```powershell
# Test backend
curl http://localhost:3001/api/health
# Should return: {"status":"ok"}
```

**Frontend (Port 3000):**
```powershell
# Test frontend
curl http://localhost:3000
# Should return HTML page
```

### 5. Restart Everything

1. **Stop all Node processes:**
   ```powershell
   taskkill /F /IM node.exe
   ```

2. **Start backend:**
   ```powershell
   npm run server
   ```

3. **Start frontend (new terminal):**
   ```powershell
   npm start
   ```

### 6. Clear Browser Cache

- Press **Ctrl + Shift + Delete**
- Clear cached images and files
- Refresh page (**Ctrl + F5**)

## Expected Behavior

When everything works:
1. You see the **SkyBites** logo and navbar
2. Home page shows **14 dining locations**
3. No noscript message visible
4. Browser console shows no errors

## Still Not Working?

1. Check `package.json` has all dependencies
2. Run `npm install` again
3. Check firewall isn't blocking ports 3000/3001
4. Try a different browser
5. Check Windows Defender/Antivirus isn't blocking Node.js

