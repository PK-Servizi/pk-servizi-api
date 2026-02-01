#!/bin/bash

# Script to run database migrations on the live server

echo "=== Running Database Migration ==="
echo "This will add the missing 'category' column to the documents table"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: Must run this script from the project root directory"
    exit 1
fi

# Run the migration
echo "Running migration..."
npm run typeorm migration:run

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration completed successfully!"
    echo "The 'category' column has been added to the documents table."
    echo ""
    echo "Next steps:"
    echo "1. Restart the application: pm2 restart pk-servizi-api"
    echo "2. Test document upload functionality"
else
    echo ""
    echo "❌ Migration failed!"
    echo "Please check the error messages above."
    exit 1
fi
