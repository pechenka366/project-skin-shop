@echo off
echo ========================================
echo    Building and Deploying Project
echo ========================================
echo.

echo [1/5] Building frontend...
cd D:\projects\skin-shop
call npm run build
if errorlevel 1 (
    echo Frontend build failed!
    pause
    exit /b 1
)
echo Frontend build complete!
echo.

echo [2/5] Creating directories on server...
ssh deployer@157.22.192.56 "mkdir -p /home/deployer/backand-skin-shop/frontend/dist"
ssh deployer@157.22.192.56 "mkdir -p /home/deployer/backand-skin-shop/frontend/img"
echo Directories created!
echo.

echo [3/5] Uploading frontend...
cd D:\projects\skin-shop
scp -r dist/* deployer@157.22.192.56:/home/deployer/backand-skin-shop/frontend/dist/
if errorlevel 1 (
    echo Frontend upload failed!
    pause
    exit /b 1
)
echo Frontend uploaded!
echo.

echo [4/5] Uploading images...
cd D:\projects\skin-shop
if exist img (
    scp -r img/* deployer@157.22.192.56:/home/deployer/backand-skin-shop/frontend/img/
    echo Images uploaded!
) else if exist public\img (
    scp -r public\img/* deployer@157.22.192.56:/home/deployer/backand-skin-shop/frontend/img/
    echo Images from public/img uploaded!
) else (
    echo No images folder found, skipping...
)
echo.

echo [5/5] Setting permissions and restarting...
ssh deployer@157.22.192.56 "sudo chown -R www-data:www-data /home/deployer/backand-skin-shop/frontend/dist && sudo chmod -R 755 /home/deployer/backand-skin-shop/frontend/dist && sudo systemctl reload nginx"
echo Permissions set and Nginx reloaded!
echo.

echo ========================================
echo    Deployment complete!
echo    Website: https://bahtarma.ru
echo ========================================
pause