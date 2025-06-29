@echo off
echo Starting WorkVerse Backend Server...
echo.

REM Check if port 5000 is in use
netstat -ano | findstr :5000 > nul
if %errorlevel% equ 0 (
    echo Port 5000 is already in use!
    echo Killing existing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
        taskkill /PID %%a /F > nul 2>&1
    )
    echo Process killed.
    echo.
)

REM Start the server
echo Starting server on port 5000...
npm start

pause 