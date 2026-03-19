@echo off
title Naukri AI Agent - Cyber Dashboard Launcher
cls
echo ============================================================
echo   🤖 NAUKRI JOB AI AGENT - CYBER-PRO SUITE
echo ============================================================
echo.
echo [1/2] 🛰️ Synchronizing Market Intelligence (Updating Jobs)...
node index.js
echo.
echo [2/2] 🚀 Launching Visual Dashboard...
cd dashboard
npm run dev
pause
