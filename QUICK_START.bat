@echo off
title Drone Food Delivery - Quick Start
color 0A
echo.
echo ========================================
echo   DRONE FOOD DELIVERY - QUICK START
echo ========================================
echo.
echo This will start both backend and frontend servers.
echo.
echo Press Ctrl+C in each window to stop the servers.
echo.
pause
echo.
echo Starting Backend Server (Port 3001)...
start "Backend Server - Port 3001" cmd /k "cd /d %~dp0 && npm run server"
timeout /t 2 /nobreak >nul
echo.
echo Starting Frontend (Port 3000)...
start "Frontend - Port 3000" cmd /k "cd /d %~dp0 && npm start"
echo.
echo ========================================
echo   Servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo The browser should open automatically.
echo If not, go to: http://localhost:3000
echo.
pause

