#!/bin/bash
# Server Deployment Script
# Run this on your live server: bash deploy-on-server.sh

echo ""
echo "========================================"
echo "Deploying Payment Fix on Live Server"
echo "========================================"
echo ""

# Step 1: Pull latest changes
echo "Step 1: Pulling latest changes from Git..."
cd ~/pk-servizi-api || exit 1
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Git pull failed"
    exit 1
fi
echo "✅ Latest changes pulled"

# Step 2: Install dependencies (if needed)
echo ""
echo "Step 2: Checking dependencies..."
npm install
echo "✅ Dependencies checked"

# Step 3: Restart PM2
echo ""
echo "Step 3: Restarting application..."
pm2 restart pk-servizi-api

if [ $? -ne 0 ]; then
    echo "❌ PM2 restart failed"
    exit 1
fi
echo "✅ Application restarted"

# Step 4: Show logs
echo ""
echo "========================================"
echo "Deployment Complete!"
echo "========================================"
echo ""
echo "Checking logs for errors..."
sleep 2
pm2 logs pk-servizi-api --lines 30

echo ""
echo "Monitor logs with: pm2 logs pk-servizi-api"
echo "Check status with: pm2 status"
echo ""
