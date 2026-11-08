@echo off
REM Starts the local server on the compiled dist/ folder.
REM On a first run (fresh GitHub download / zip) there is no dist/ and no
REM node_modules/ yet, so this script installs dependencies and builds
REM once automatically, then boots straight into node. After that,
REM every later double-click skips straight to node — no build.
REM The server listens on IPv4 (0.0.0.0) and answers http://mastermind.local
REM (and the LAN IPv4 link). Port 80 is tried first; if it is taken or needs
REM admin rights, the server falls back to 8080 / 3000 by itself.
REM For phone DNS resolution, run start-server-admin.bat as Administrator instead.
cd /d %~dp0

REM ------------------------------------------------------------------
REM Auto-start on boot:
REM   Run once with  --install-startup    to make the server launch
REM   automatically every time the PC boots and you log in.
REM   Use --uninstall-startup to turn that off again.
REM ------------------------------------------------------------------
if /i "%~1"=="--install-startup"   goto install_startup
if /i "%~1"=="--uninstall-startup" goto uninstall_startup
if /i "%~1"=="--help"              goto show_help

REM The site runs from dist/Server/server.js exactly as it was last built.
REM dist/ and node_modules/ are git-ignored, so a fresh GitHub download
REM (git clone OR the Download ZIP) has neither. Build them once here,
REM automatically, so the downloaded copy works with no manual steps.
if not exist dist\Server\server.js goto first_run_build
goto server_loop

:first_run_build
echo.
echo First run on this copy: dist\Server\server.js is missing.
echo Installing dependencies and building the site (one time only)...
echo (later double-clicks start instantly - no build.)
echo.
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js was not found on this PC.
    echo Install Node.js 20 or newer from https://nodejs.org, then double-click this file again.
    echo.
    pause
    exit /b 1
)
node --version
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm was not found. Reinstall Node.js from https://nodejs.org - it includes npm.
    echo.
    pause
    exit /b 1
)
if not exist node_modules\express\package.json (
    echo --- npm install ---
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo ERROR: npm install failed. Check your internet connection and try again.
        echo.
        pause
        exit /b 1
    )
)
echo --- npm run build ---
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ERROR: the build failed - see the messages above.
    echo Fix the problem and double-click this file again to retry.
    echo.
    pause
    exit /b 1
)
if not exist dist\Server\server.js (
    echo.
    echo ERROR: the build finished but dist\Server\server.js is still missing.
    echo.
    pause
    exit /b 1
)
echo.
echo Build complete - starting the server...
echo.
goto server_loop

REM ------------------------------------------------------------------
REM Long-term reliability watchdog:
REM   If the server process ever exits for ANY reason (crash, power blip
REM   that scrambles state), wait a few seconds and start it again
REM   automatically instead of leaving the site down.
REM   Press Ctrl+C and answer "Y" to stop, or close this window.
REM ------------------------------------------------------------------
:server_loop
echo [%date% %time%] Starting the server (to STOP it for good: press Ctrl+C then Y)...
node dist/Server/server.js
echo [%date% %time%] The server stopped - restarting in 3 seconds (Ctrl+C then Y to stop)...
timeout /t 3 /nobreak >nul
goto server_loop

:install_startup
REM The task needs "Run with highest privileges" so the server can bind
REM port 80 (and port 53 for the DNS responder). Creating such a task
REM requires Administrator, so re-launch this script elevated if needed.
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting Administrator privileges to install the auto-start task...
    powershell -Command "Start-Process '%~f0' -ArgumentList '--install-startup' -Verb RunAs"
    exit /b
)
schtasks /create /tn "Mastermind TypeScript Server" /tr "\"%~f0\"" /sc onlogon /rl highest /f
if %errorlevel% equ 0 (
    echo.
    echo Auto-start installed: the server will start automatically at every boot/logon.
    echo To remove it later, run:  start-server.bat --uninstall-startup
) else (
    echo.
    echo Could not install the auto-start task. Run this command in an Administrator prompt.
)
pause
exit /b

:uninstall_startup
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting Administrator privileges to remove the auto-start task...
    powershell -Command "Start-Process '%~f0' -ArgumentList '--uninstall-startup' -Verb RunAs"
    exit /b
)
schtasks /delete /tn "Mastermind TypeScript Server" /f
if %errorlevel% equ 0 (
    echo.
    echo Auto-start removed.
) else (
    echo.
    echo No auto-start task was found.
)
pause
exit /b

:show_help
echo Usage:
echo   start-server.bat                        Run the server now (first run builds automatically)
echo   start-server.bat --install-startup      Start the server automatically on boot/logon
echo   start-server.bat --uninstall-startup    Stop auto-starting the server on boot/logon
pause
exit /b
