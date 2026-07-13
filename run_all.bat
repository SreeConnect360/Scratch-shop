@echo off
title ReeVibes Full Application Launcher
echo ===================================================
echo           ReeVibes Application Launcher
echo ===================================================
echo.

:: 1. Attempt to start PostgreSQL service
echo [1/3] Checking PostgreSQL Database Service...
echo Attempting to start PostgreSQL service (may require Administrator privileges)...
net start postgresql-x64-16 >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] PostgreSQL service started successfully.
) else (
    net start postgresql-x64-15 >nul 2>&1
    if %errorlevel% equ 0 (
        echo [SUCCESS] PostgreSQL service started successfully.
    ) else (
        echo [INFO] PostgreSQL service is either already running or requires Administrator privileges to start automatically.
        echo        Please ensure PostgreSQL is running on port 5432.
    )
)
echo.

:: 2. Start Spring Boot Backend
echo [2/3] Starting Spring Boot Backend...
start "ReeVibes Backend" cmd /c "echo Starting Spring Boot Backend... && set \"JAVA_HOME=C:\Program Files\Java\jdk-17\" && cd backend-spring-boot && mvnw spring-boot:run"
echo [SUCCESS] Backend startup initiated in a new window.
echo.

:: 3. Start React Frontend
echo [3/3] Starting Vite React Frontend...
where bun >nul 2>&1
if %errorlevel% equ 0 (
    if exist bun.lock (
        start "ReeVibes Frontend" cmd /c "echo Starting Vite Frontend via Bun... && bun run dev"
    ) else (
        start "ReeVibes Frontend" cmd /c "echo Starting Vite Frontend via NPM... && npm run dev"
    )
) else (
    start "ReeVibes Frontend" cmd /c "echo Starting Vite Frontend via NPM... && npm run dev"
)
echo [SUCCESS] Frontend startup initiated in a new window.
echo.

echo ===================================================
echo All services initiated! Keep the windows open.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8081
echo ===================================================
pause
