#!/bin/bash

# DynamoDB Migration Script
# This script runs all migration steps in the correct sequence

echo "🚀 Starting DynamoDB Migration"
echo "================================"
echo ""

# Step 1: Test connection
echo "Step 1: Testing AWS connection..."
npx ts-node scripts/test-connection.ts
if [ $? -ne 0 ]; then
  echo "❌ Connection test failed. Please check your AWS credentials."
  exit 1
fi
echo ""

# Step 2: Backup existing products
echo "Step 2: Backing up existing products table..."
npx ts-node scripts/backup-products.ts
if [ $? -ne 0 ]; then
  echo "❌ Backup failed. Aborting migration."
  exit 1
fi
echo ""

# Step 3: Create Cart table
echo "Step 3: Creating Cart table..."
npx ts-node scripts/create-cart-table.ts
if [ $? -ne 0 ]; then
  echo "❌ Failed to create Cart table."
  exit 1
fi
echo ""

# Step 4: Create Orders table
echo "Step 4: Creating Orders table..."
npx ts-node scripts/create-orders-table.ts
if [ $? -ne 0 ]; then
  echo "❌ Failed to create Orders table."
  exit 1
fi
echo ""

# Step 5: Create Returns table
echo "Step 5: Creating Returns table..."
npx ts-node scripts/create-returns-table.ts
if [ $? -ne 0 ]; then
  echo "❌ Failed to create Returns table."
  exit 1
fi
echo ""

# Step 6: Create products-enhanced and migrate data
echo "Step 6: Creating products-enhanced table and migrating data..."
npx ts-node scripts/migrate-products-enhanced.ts
if [ $? -ne 0 ]; then
  echo "❌ Failed to migrate products."
  exit 1
fi
echo ""

echo "================================"
echo "✨ Migration Complete!"
echo ""
echo "📊 Summary:"
echo "  ✅ Backed up existing products table"
echo "  ✅ Created cart table (On-Demand)"
echo "  ✅ Created orders table (Provisioned 2/2)"
echo "  ✅ Created returns table (Provisioned 1/1)"
echo "  ✅ Created products-enhanced table"
echo "  ✅ Migrated products with variants"
echo ""
echo "📝 Next Steps:"
echo "  1. Test the new tables"
echo "  2. Update API to use products-enhanced"
echo "  3. Build Cart API"
echo ""
