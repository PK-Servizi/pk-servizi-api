# Fix Documents Table - Add Missing Category Column

## Problem
The live server is showing this error:
```
column "category" of relation "documents" does not exist
```

This happens because the database schema is missing the `category` column that the application code expects.

## Solution

### Option 1: Run Migration (Recommended)

**On your live server**, run these commands:

```bash
cd /home/ubuntu/pk-servizi-api

# Run the migration
npm run typeorm migration:run

# Restart the application
pm2 restart pk-servizi-api
```

Or use the migration script:
```bash
chmod +x scripts/run-migration.sh
./scripts/run-migration.sh
```

### Option 2: Manual SQL (If migration fails)

Connect to your PostgreSQL database and run:

```sql
-- Add category column
ALTER TABLE documents 
ADD COLUMN category character varying(100) NOT NULL DEFAULT 'GENERAL';

-- Verify the column was added
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'documents' 
AND column_name = 'category';
```

### Option 3: Add All Missing Columns

If you encounter more missing column errors, run all these:

```sql
-- Add category
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS category character varying(100) NOT NULL DEFAULT 'GENERAL';

-- Rename file_name to filename (if needed)
ALTER TABLE documents 
RENAME COLUMN file_name TO filename;

-- Add original_filename
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS original_filename character varying(255);

-- Update existing records
UPDATE documents 
SET original_filename = filename 
WHERE original_filename IS NULL;

-- Add is_required
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS is_required boolean NOT NULL DEFAULT false;

-- Add admin_notes
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS admin_notes text;

-- Add version
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;
```

## Verification

After running the migration, verify it worked:

```sql
-- Check all columns in documents table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'documents'
ORDER BY ordinal_position;
```

Expected columns:
- id (uuid)
- service_request_id (uuid)
- category (character varying) ← **This should now exist**
- filename (character varying)
- original_filename (character varying)
- file_path (character varying)
- file_size (integer)
- mime_type (character varying)
- status (character varying)
- is_required (boolean)
- admin_notes (text)
- version (integer)
- created_at (timestamp)
- updated_at (timestamp)

## Testing

After the fix, test document upload:
1. Navigate to the service request in Swagger/Postman
2. Try uploading documents using the endpoint shown in your image
3. Verify no more "column does not exist" errors

## Files Changed
- `migrations/1770000000001-AddCategoryToDocuments.ts` - New migration file
- `scripts/run-migration.sh` - Helper script to run migrations

## Prevention
To prevent this in the future:
1. Always run migrations on production after deployment
2. Add migration check to your deployment script
3. Keep database schema in sync with entity definitions
