@echo off
echo Setting up Git repository for Apple Complaint Portal...
echo.

echo 1. Creating README.md...
echo # applecomplaint >> README.md

echo 2. Initializing Git repository...
git init

echo 3. Adding README.md...
git add README.md

echo 4. Creating initial commit...
git commit -m "first commit"

echo 5. Setting main branch...
git branch -M main

echo 6. Adding remote origin...
git remote add origin https://github.com/janetgunnoe09-netizen/applecomplaint.git

echo 7. Pushing to GitHub...
git push -u origin main

echo.
echo Setup complete! Now adding all project files...
git add .
git commit -m "Add all project files"
git push origin main

echo.
echo All done! Your project is now on GitHub.
pause
