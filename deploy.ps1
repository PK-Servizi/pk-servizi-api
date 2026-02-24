# PK Servizi API - Deployment Script
# Usage: .\deploy.ps1

$ErrorActionPreference = "Stop"

$SERVER = "ubuntu@ec2-13-60-77-204.eu-north-1.compute.amazonaws.com"
$KEY = "D:\work\pk-servizi-key.pem"
$PROJECT_PATH = "d:\work\live_projects\pk-servizi-api"

Write-Host "Starting deployment..." -ForegroundColor Green

# Step 1: Pull latest code
Write-Host "`nPulling latest code..." -ForegroundColor Cyan
git pull origin main

# Step 2: Build locally
Write-Host "`nBuilding project..." -ForegroundColor Cyan
npm run build

# Step 3: Upload files
Write-Host "`nUploading files to server..." -ForegroundColor Cyan
scp -i $KEY -r "$PROJECT_PATH\dist" "${SERVER}:~/pk-servizi-api/"
scp -i $KEY "$PROJECT_PATH\package.json" "$PROJECT_PATH\package-lock.json" "${SERVER}:~/pk-servizi-api/"

# Step 4: Restart on server
Write-Host "`nRestarting application..." -ForegroundColor Cyan
$sshCommand = "cd ~/pk-servizi-api; npm ci --production; npm run migration:run; pm2 restart pk-servizi-api; pm2 list"
ssh -i $KEY $SERVER $sshCommand

Write-Host "`nDeployment complete!" -ForegroundColor Green
Write-Host "Check logs with: pm2 logs pk-servizi-api" -ForegroundColor Yellow

