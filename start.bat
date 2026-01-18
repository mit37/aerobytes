@echo off
echo Starting Drone Food Delivery Application...
echo.
echo Starting backend server on port 3001...
start "Backend Server" cmd /k "npm run server"
timeout /t 3 /nobreak >nul
echo.
echo Starting frontend on port 3000...
start "Frontend" cmd /k "npm start"
echo.
echo Both servers are starting!
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
pause

