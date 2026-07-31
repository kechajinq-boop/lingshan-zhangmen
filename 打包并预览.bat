@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Building and starting preview...
call npm run build
start "" http://localhost:5200
call npx vite preview --port 5200 --strictPort
pause
