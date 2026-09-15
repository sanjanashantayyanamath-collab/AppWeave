@echo off
echo ===================================================
echo   AppWeave - Modular Multi-App SaaS Ecosystem
echo   ArchScale Guild Hackathon AS-06
echo ===================================================
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting Next.js development server...
echo Access the app at: http://localhost:3000
echo.
call npm run dev
