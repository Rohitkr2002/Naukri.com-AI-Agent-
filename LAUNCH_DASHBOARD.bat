@echo off
title Naukri AI Agent - Cyber Dashboard
cls
echo.
echo  ============================================================
echo   NAUKRI JOB AI AGENT - CYBER-PRO SUITE
echo  ============================================================
echo.

:: --- Step 1: Check if dashboard dependencies are installed ---
if not exist "%~dp0dashboard\node_modules\" (
    echo  [SETUP] node_modules not found. Installing dashboard dependencies...
    cd /d "%~dp0dashboard"
    npm install
    if errorlevel 1 (
        echo  [ERROR] npm install failed! Please check your internet connection.
        pause
        exit /b 1
    )
    echo  [OK] Dependencies installed successfully!
    echo.
)

:: --- Step 2: Run job sync in a SEPARATE background window ---
echo  [1/2] Starting Job Sync in background...
start "Naukri Job Sync" cmd /c "cd /d "%~dp0" && node index.js && echo. && echo [SYNC DONE] Jobs updated! && pause"

:: --- Step 3: Launch dashboard immediately (browser will auto-open) ---
echo  [2/2] Launching Dashboard... (browser will open automatically)
echo.
cd /d "%~dp0dashboard"
npm run dev
