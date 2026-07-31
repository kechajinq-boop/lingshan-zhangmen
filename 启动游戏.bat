@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Starting game server, please wait...
start "" http://localhost:5199
call npm run dev -- --port 5199 --strictPort
pause
