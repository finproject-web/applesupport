@echo off
echo Setting up GitHub repository for Apple Complaint Portal...
echo Current directory: %CD%
echo.

echo 1. Creating README.md...
echo # applecomplaint > README.md
echo. >> README.md
echo Apple Support Complaint Portal - A comprehensive complaint management system >> README.md
echo. >> README.md
echo ## Features >> README.md
echo - User complaint submission >> README.md
echo - Admin dashboard for managing complaints >> README.md
echo - Complaint tracking system >> README.md
echo - Apple-style UI design >> README.md
echo. >> README.md
echo ## Getting Started >> README.md
echo 1. Install dependencies: npm install >> README.md
echo 2. Start server: npm start >> README.md
echo 3. Open browser: http://localhost:8080 >> README.md

echo 2. Initializing Git repository...
git init

echo 3. Adding all files...
git add .

echo 4. Creating initial commit...
git commit -m "Initial commit: Apple Support Complaint Portal"

echo 5. Setting main branch...
git branch -M main

echo 6. Adding remote origin...
git remote add origin https://github.com/janetgunnoe09-netizen/applecomplaint.git

echo 7. Pushing to GitHub...
git push -u origin main

echo.
echo Setup complete! Your project is now on GitHub.
echo Repository URL: https://github.com/janetgunnoe09-netizen/applecomplaint
pause
