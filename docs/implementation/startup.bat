@echo off
echo Starting NexProLink setup...

REM Check for global dependencies
echo Checking global dependencies...
call npm list -g firebase-tools >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Firebase Tools...
    call npm install -g firebase-tools
)

REM Navigate to project root
cd /d %~dp0\..\..

REM Install project dependencies
echo Installing project dependencies...
call npm install

REM Navigate to frontend
cd frontend

REM Install frontend dependencies
echo Installing frontend dependencies...
call npm install

REM Check for .env.local
if not exist .env.local (
    echo WARNING: .env.local not found! Please create it with your Firebase configuration.
    echo See docs/implementation/STARTUP_GUIDE.md for details.
    pause
)

REM Start development server
echo Starting development server...
call npm run dev
