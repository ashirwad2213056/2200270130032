@echo off
echo ========================================
echo  Pushing URL Shortener to GitHub
echo ========================================
echo.

cd /d "C:\Users\techn\OneDrive\Desktop\FrontEnd\affordmedical\url-shortener"
echo Current directory: %CD%
echo.

echo Initializing Git repository...
git init
echo.

echo Adding remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/ashirwad2213056/2200270130032.git
echo.

echo Adding all files...
git add .
echo.

echo Committing changes...
git commit -m "Initial commit: React URL Shortener Application

Features:
- URL shortening with custom shortcodes
- User authentication system
- Analytics dashboard with detailed click tracking
- QR code generation
- Material UI responsive design
- Click analytics by source, country, device, and time
- URL expiration functionality
- Copy to clipboard feature

Built with React, TypeScript, Material-UI, and localStorage for persistence."
echo.

echo Pushing to GitHub...
git branch -M main
git push -u origin main --force
echo.

echo ========================================
echo  Push completed!
echo  Repository: https://github.com/ashirwad2213056/2200270130032
echo ========================================
pause
