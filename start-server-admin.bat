@echo off
REM Run this script as Administrator to start the local web server AND the
REM DNS responder (DNS needs port 53, which requires administrator rights).
REM This re-uses start-server.bat, which now auto-restarts the server if it
REM ever stops, so the site stays up for the long term.
cd /d %~dp0
powershell -Command "Start-Process cmd -ArgumentList '/k \"\"%~dp0start-server.bat\"\"' -Verb RunAs"
echo The server is starting in the new Administrator window. You can close this window.
pause
