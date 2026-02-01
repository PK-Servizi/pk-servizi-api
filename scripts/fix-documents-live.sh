#!/bin/bash

# Quick fix script for documents category column error
# Run this on your live server

set -e

echo "=========================================="
echo "  Fix Documents Category Column Error"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as correct user
if [ "$USER" != "ubuntu" ]; then
    echo -e "${YELLOW}Warning: This script is designed to run as 'ubuntu' user${NC}"
    echo "Current user: $USER"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Navigate to project directory
cd /home/ubuntu/pk-servizi-api || exit 1

echo -e "${GREEN}✓${NC} In project directory: $(pwd)"
echo ""

# Pull latest code (includes the migration)
echo "Pulling latest code from repository..."
git pull || {
    echo -e "${RED}✗ Failed to pull latest code${NC}"
    echo "Continuing with local migration file..."
}

echo ""

# Install dependencies (in case migration dependencies are needed)
echo "Checking dependencies..."
npm install --production

echo ""

# Run migration
echo "Running database migration..."
echo "This will add the 'category' column to documents table"
echo ""

npm run migration:run

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Migration completed successfully!${NC}"
    echo ""
    
    # Restart the application
    echo "Restarting application..."
    pm2 restart pk-servizi-api
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Application restarted successfully!${NC}"
        echo ""
        echo "=========================================="
        echo "  ✓ Fix Applied Successfully!"
        echo "=========================================="
        echo ""
        echo "The documents upload should now work correctly."
        echo "Try uploading documents again."
        echo ""
        echo "Check logs with: pm2 logs pk-servizi-api"
    else
        echo -e "${RED}✗ Failed to restart application${NC}"
        echo "Please restart manually: pm2 restart pk-servizi-api"
        exit 1
    fi
else
    echo ""
    echo -e "${RED}✗ Migration failed!${NC}"
    echo ""
    echo "Trying manual SQL fix as fallback..."
    echo ""
    
    # Provide manual SQL command
    echo "Please run this SQL command manually in your database:"
    echo ""
    echo "ALTER TABLE documents ADD COLUMN IF NOT EXISTS category character varying(100) NOT NULL DEFAULT 'GENERAL';"
    echo ""
    echo "Then restart the app: pm2 restart pk-servizi-api"
    exit 1
fi
