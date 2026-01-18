@echo off
title Frontend Server - Port 3000
color 0B
echo.
echo ========================================
echo   Starting Frontend (React App)
echo ========================================
echo.
echo This will start the React development server on port 3000
echo.
echo The browser should open automatically at:
echo   http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d %~dp0
npm start

