@echo off
echo Building frontend...
call npm run build
echo Uploading frontend...
scp -r dist/* deployer@157.22.192.56:/home/deployer/frontend/
echo Done!
pause