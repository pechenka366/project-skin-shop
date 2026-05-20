@echo off
echo ========================================
echo    Building and Deploying Project
echo ========================================
echo.

echo [1/4] Building frontend...
cd D:\projects\skin-shop
call npm run build
if errorlevel 1 (
    echo Frontend build failed!
    pause
    exit /b 1
)
echo Frontend build complete!
echo.

echo [2/4] Uploading frontend...
scp -r dist/* deployer@157.22.192.56:/home/deployer/frontend/
if errorlevel 1 (
    echo Frontend upload failed!
    pause
    exit /b 1
)
echo Frontend uploaded!
echo.

echo [3/4] Uploading backend...
cd D:\projects\skin-shop\backend
scp server.js package.json package-lock.json passport.js deployer@157.22.192.56:~/backand-skin-shop/backend/
if errorlevel 1 (
    echo Backend upload failed!
    pause
    exit /b 1
)
echo Backend uploaded!
echo.

echo ========================================
echo    Deployment complete
echo ========================================
pause