# Quick Start Guide

## ⚠️ IMPORTANT: Always run commands from the project directory!

```powershell
# First, navigate to the project directory
cd C:\Users\mitan\drone-food-delivery
```

## Running the Application

### Option 1: Run both servers together (Recommended)
```powershell
npm run dev
```

### Option 2: Run servers separately

**Terminal 1 - Backend Server:**
```powershell
cd C:\Users\mitan\drone-food-delivery
npm run server
```

**Terminal 2 - Frontend (in a new terminal):**
```powershell
cd C:\Users\mitan\drone-food-delivery
npm start
```

## Verify You're in the Right Directory

You should see `package.json` when you run:
```powershell
ls package.json
```

If you get an error, you're in the wrong directory!

## Troubleshooting

If you get "Missing script" errors:
1. Make sure you're in `C:\Users\mitan\drone-food-delivery`
2. Verify with: `Get-Location` (should show the drone-food-delivery path)
3. Check scripts with: `npm run`

If `react-scripts` is not found:
```powershell
cd C:\Users\mitan\drone-food-delivery
npm install
```

