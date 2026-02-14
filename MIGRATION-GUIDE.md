# Database Migration Guide

## Overview
This guide walks you through migrating your DynamoDB database safely.

---

## Prerequisites

✅ AWS credentials configured in `.env.local`
✅ Node.js and npm installed
✅ TypeScript and ts-node installed

---

## Migration Scripts

### Individual Scripts

| Script | Purpose | Safe? |
|--------|---------|-------|
| `test-connection.ts` | Test AWS connection | ✅ Read-only |
| `backup-products.ts` | Backup existing products | ✅ Read-only |
| `create-cart-table.ts` | Create cart table | ✅ New table |
| `create-orders-table.ts` | Create orders table | ✅ New table |
| `create-returns-table.ts` | Create returns table | ✅ New table |
| `migrate-products-enhanced.ts` | Create & migrate products | ✅ New table |

### Master Script

`run-migration.sh` - Runs all scripts in the correct sequence

---

## Step-by-Step Migration

### Option A: Run All at Once (Recommended)

```bash
# Run the master script
./scripts/run-migration.sh
```

This will:
1. Test AWS connection
2. Backup existing products table
3. Create cart table
4. Create orders table
5. Create returns table
6. Create products-enhanced table
7. Migrate all products with variants

**Time**: ~2-3 minutes

---

### Option B: Run Step by Step

If you prefer to run each step manually:

```bash
# Step 1: Test connection
npx ts-node scripts/test-connection.ts

# Step 2: Backup products
npx ts-node scripts/backup-products.ts

# Step 3: Create cart table
npx ts-node scripts/create-cart-table.ts

# Step 4: Create orders table
npx ts-node scripts/create-orders-table.ts

# Step 5: Create returns table
npx ts-node scripts/create-returns-table.ts

# Step 6: Migrate products
npx ts-node scripts/migrate-products-enhanced.ts
```

---

## What Gets Created

### New Tables

**1. cart**
- Billing: On-Demand
- TTL: 30 days
- Cost: ~₹200-300/month

**2. orders**
- Billing: Provisioned (2 RCU, 2 WCU)
- GSIs: CustomerEmailIndex, StatusIndex
- Cost: ~₹80-100/month

**3. returns**
- Billing: Provisioned (1 RCU, 1 WCU)
- GSI: OrderIndex
- Cost: ~₹40-50/month

**4. products-enhanced**
- Billing: On-Demand
- Contains: METADATA + VARIANT items
- Cost: ~₹50/month

### Existing Tables

**products** - UNTOUCHED (safe backup created)

---

## After Migration

### Verify Tables

```bash
# List all tables
aws dynamodb list-tables --region ap-southeast-2

# Check products-enhanced
aws dynamodb scan --table-name products-enhanced --limit 5 --region ap-southeast-2
```

### Test APIs

```bash
# Test products API (still using old table)
curl http://localhost:3000/api/products

# Update code to use products-enhanced
# Then test again
```

---

## Rollback Plan

If something goes wrong:

1. **Your original products table is safe** - never modified
2. **Backup created** in `backups/products-backup-*.json`
3. **Delete new tables** if needed:

```bash
aws dynamodb delete-table --table-name cart --region ap-southeast-2
aws dynamodb delete-table --table-name orders --region ap-southeast-2
aws dynamodb delete-table --table-name returns --region ap-southeast-2
aws dynamodb delete-table --table-name products-enhanced --region ap-southeast-2
```

4. **Restore from backup** (if needed):

```bash
npx ts-node scripts/restore-from-backup.ts backups/products-backup-*.json
```

---

## Troubleshooting

### Connection Failed
- Check AWS credentials in `.env.local`
- Verify region is correct (`ap-southeast-2`)
- Check IAM permissions

### Table Already Exists
- Scripts will skip creation if table exists
- Safe to re-run

### Migration Failed
- Check backup file was created
- Original products table is untouched
- Can retry migration

---

## Next Steps After Migration

1. ✅ Verify all tables created
2. ✅ Test products-enhanced table
3. 🔨 Update API to use products-enhanced
4. 🔨 Build Cart API
5. 🔨 Build Orders API
6. 🔨 Build Returns API

---

## Questions?

- Check AWS Console → DynamoDB → Tables
- View backup files in `backups/` directory
- Original products table remains working

**Ready to migrate?** Run `./scripts/run-migration.sh`
