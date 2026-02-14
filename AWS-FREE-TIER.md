# AWS Free Tier - DynamoDB Costs

## ✅ GOOD NEWS: You Won't Be Charged!

I've updated all scripts to use **Provisioned billing** to stay within AWS Free Tier.

---

## AWS DynamoDB Free Tier (PERMANENT)

**These limits are FREE FOREVER** (not just first year):
- ✅ 25 GB storage
- ✅ 25 RCU (Read Capacity Units)
- ✅ 25 WCU (Write Capacity Units)

---

## Our Setup (Updated for Free Tier)

### Total Capacity Used
```
Cart:              5 RCU + 5 WCU
Orders:            2 RCU + 2 WCU
Returns:           1 RCU + 1 WCU
Products-Enhanced: 5 RCU + 5 WCU
-----------------------------------
TOTAL:            13 RCU + 13 WCU ✅ (under 25 limit)
```

### Storage Used
```
Products:  ~5 MB
Cart:      ~1 MB
Orders:    ~10 MB (grows over time)
Returns:   ~2 MB
-----------------------------------
TOTAL:     ~18 MB ✅ (under 25 GB limit)
```

---

## Cost Breakdown

### ✅ FREE (Covered by Free Tier)
- Cart table: **₹0** (5+5 under 25 limit)
- Orders table: **₹0** (2+2 under 25 limit)
- Returns table: **₹0** (1+1 under 25 limit)
- Products-Enhanced: **₹0** (5+5 under 25 limit)
- Storage: **₹0** (under 25 GB)

### 💰 TOTAL MONTHLY COST
**₹0** (completely free!)

---

## When Will You Be Charged?

### Scenario 1: High Traffic
If your app gets **very popular** and exceeds:
- 25 RCU/WCU combined
- 25 GB storage

**Example**: 100K+ users/month might exceed limits

### Scenario 2: Never
For most small-medium e-commerce sites, you'll **never** exceed free tier!

---

## Monitoring Your Usage

### Check AWS Console
1. Go to AWS Console → DynamoDB
2. Click on each table
3. View "Metrics" tab
4. Monitor RCU/WCU usage

### Set Up Billing Alerts
```bash
# AWS Console → Billing → Budgets
# Create alert for $1 threshold
```

This way you'll know if you're approaching any charges.

---

## What If You Exceed Free Tier?

### Option 1: Optimize
- Reduce RCU/WCU per table
- Clean up old data
- Use caching

### Option 2: Pay (Very Cheap)
Even if you exceed, costs are minimal:
- Extra RCU: ~₹0.50 per unit/month
- Extra WCU: ~₹2.50 per unit/month

**Example**: 30 RCU + 30 WCU = ~₹15/month extra

---

## Summary

✅ **Your setup is FREE** (within free tier)
✅ **No charges for first year** (or ever, if under limits)
✅ **Free tier is PERMANENT** (not just 12 months)
✅ **You can monitor usage** to avoid surprises

**Run the migration with confidence!** 🚀
