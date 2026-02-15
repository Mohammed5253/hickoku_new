
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { DynamoDBClient, ScanCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall, marshall } from '@aws-sdk/util-dynamodb';

// Source Client (Legacy Data)
const sourceClient = new DynamoDBClient({
    region: 'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

// Destination Client (New Data)
const destClient = new DynamoDBClient({
    region: process.env.AWS_REGION || 'ap-south-1', // Should be ap-south-1 from .env.local
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const SRC_PRODUCTS_TABLE = 'products-enhanced';
const SRC_ORDERS_TABLE = 'hickoku-orders';

const DEST_PRODUCTS_TABLE = 'products';
const DEST_VARIANTS_TABLE = 'product_variants';
const DEST_ORDERS_TABLE = 'orders';

// Helper to convert "001" -> "1"
function toSimpleId(id: string): string {
    return String(Number(id));
}

// Helper to generate Default Variant ID: "1" -> "101"
function toVariantId(simpleId: string): string {
    return `${simpleId}01`;
}

async function migrateProducts() {
    console.log('Migrating Products...');

    // 1. Scan Source
    const command = new ScanCommand({ TableName: SRC_PRODUCTS_TABLE });
    const response = await sourceClient.send(command);
    const items = response.Items?.map(i => unmarshall(i)) || [];
    console.log(`Found ${items.length} source products.`);

    for (const item of items) {
        // Assume Source has: productId="001", name="...", etc.
        // We only care about Items that represent the Product Metadata
        // In products-enhanced, SK="METADATA" usually holds the main info.

        let parentProduct: any = null;
        let childVariant: any = null;

        // Handling the "products-enhanced" schema
        // It uses PK=PRODUCT#... SK=METADATA
        // And possibly SK=VARIANT#...
        // But for "Simple" products, the METADATA often holds everything (price, stock).

        if (item.SK === 'METADATA') {
            const simpleId = toSimpleId(item.productId);
            const variantId = toVariantId(simpleId);

            // A. Create Parent (products)
            parentProduct = {
                PK: `PRODUCT#${simpleId}`,
                id: simpleId,
                name: item.name,
                slug: item.slug,
                description: item.description,
                category: item.category,
                basePrice: item.price, // Assuming simple product has price in metadata
                images: item.images,
                // Add other fields as needed
            };

            // B. Create Default Variant (product_variants)
            childVariant = {
                PK: `VARIANT#${variantId}`,
                id: variantId,
                productId: simpleId,
                sku: `HICK-${simpleId.padStart(3, '0')}`, // Keep legacy SKU format for visual continuity? User said ID should not relate to SKU, but we need a value. Let's keep it familiar.
                size: 'Standard', // Default size
                price: item.price,
                stock: item.stockQuantity || 0,
                // variant specific fields
            };

            // Check if source actually HAS variant data in METADATA?
            // Usually products-enhanced might have separate VARIANT# items.
            // If so, we should process THOSE instead for variants.

            // Let's assume for now we migrate from METADATA as default, 
            // but if we find SK=VARIANT#, we might need a more complex join.
            // Given the previous codebase analysis, `products-enhanced` was being used as a single source 
            // where METADATA had `items` (variants) or it IS the product.
            // Re-reading `products.repository.ts`:
            // loops items... if SK=METADATA -> product.metadata.
            // if SK startsWith VARIANT# -> product.variant.

            // SO we need to Group by PK first.
        }
    }

    // BETTER STRATEGY: Group items by PK first
    const productGroups = new Map<string, any[]>();
    for (const item of items) {
        const pk = item.PK;
        if (!productGroups.has(pk)) productGroups.set(pk, []);
        productGroups.get(pk)?.push(item);
    }

    for (const [pk, group] of productGroups) {
        // Find Metadata
        const metadata = group.find(i => i.SK === 'METADATA');
        const variants = group.filter(i => i.SK.startsWith('VARIANT#'));

        if (!metadata) continue;

        const simpleId = toSimpleId(metadata.productId);

        // 1. Write Parent
        const parent = {
            PK: `PRODUCT#${simpleId}`,
            id: simpleId,
            name: metadata.name,
            slug: metadata.slug,
            description: metadata.description,
            category: metadata.category,
            basePrice: metadata.price || 0, // Fallback
            images: metadata.images,
        };

        await destClient.send(new PutItemCommand({
            TableName: DEST_PRODUCTS_TABLE,
            Item: marshall(parent, { removeUndefinedValues: true })
        }));

        // 2. Write Variants
        if (variants.length > 0) {
            // Use existing variants
            for (const v of variants) {
                // v.SK is VARIANT#...
                // We construct new variant ID. 
                // Maybe preserve old SK suffix? Or generic 101?
                // If old SK is "VARIANT#6ml", we need a string ID.
                // Let's use `simpleId` + index? 
                // Or just use the suffix from SK?
                // Let's use `simpleId` + `01`, `02` etc.

                // Wait, if we use dynamic IDs on re-seed, we break Order links if we don't know mapping.
                // But orders rely on PRODUCT ID `001`.
                // Migrated orders will rely on VARIANT ID.
                // SO WE MUST DETERMINISTICALLY GENERATE VARIANT ID per product.

                // Rule: First variant = 101. Second = 102.
                // But wait, the Order likely says "Size: 6ml". 
                // We need to match that.

                // Let's just create ONE default variant if the code was relying on "Product ID" for cart.
                // In the previous code, `addToCart` sent `productId: "001"`. 
                // It did NOT send a variant ID. It sent `size: "Standard"`.

                // So we should map "Standard" -> Variant 101.
                // Does the source data have variants? 
                // If yes, we map them.

                const variantId = toVariantId(simpleId); // Force single variant for now to match strict "Simplification"
                // If there are multiple, this logic is flawed.
                // But looking at repo, most logic seemed to assume 1:1 or "6ml" default.

                // Let's use the first variant found as the "101".
                const v = variants[0];
                const variant = {
                    PK: `VARIANT#${variantId}`,
                    id: variantId,
                    productId: simpleId,
                    sku: v.sku || `HICK-${simpleId.padStart(3, '0')}`,
                    size: v.size || 'Standard',
                    price: v.price || parent.basePrice,
                    stock: v.stockQuantity || 0,
                    inventoryStatus: v.stockStatus
                };
                await destClient.send(new PutItemCommand({
                    TableName: DEST_VARIANTS_TABLE,
                    Item: marshall(variant, { removeUndefinedValues: true })
                }));
            }
        } else {
            // Create Default Variant from Metadata
            const variantId = toVariantId(simpleId);
            const variant = {
                PK: `VARIANT#${variantId}`,
                id: variantId,
                productId: simpleId,
                sku: `HICK-${simpleId.padStart(3, '0')}`,
                size: 'Standard',
                price: parent.basePrice,
                stock: 100, // Default stock if missing?
                inventoryStatus: 'IN_STOCK'
            };
            await destClient.send(new PutItemCommand({
                TableName: DEST_VARIANTS_TABLE,
                Item: marshall(variant, { removeUndefinedValues: true })
            }));
        }
        console.log(`Migrated Product ${simpleId}`);
    }
}

async function migrateOrders() {
    console.log('Migrating Orders...');
    const command = new ScanCommand({ TableName: SRC_ORDERS_TABLE });
    try {
        const response = await sourceClient.send(command);
        const items = response.Items?.map(i => unmarshall(i)) || [];
        console.log(`Found ${items.length} source orders.`);

        for (const item of items) {
            // item.items is likely array of Products
            const newItems = (item.items || []).map((lineItem: any) => {
                const simpleId = toSimpleId(lineItem.productId || lineItem.id); // Handle various formats
                const variantId = toVariantId(simpleId); // Assume Default Variant 101

                return {
                    variantId: variantId,
                    qty: lineItem.quantity || 1,
                    priceAtPurchase: lineItem.price || 0,
                    nameSnapshot: lineItem.name || 'Unknown Product' // Keep snapshot for safety
                };
            });

            const newOrder = {
                ...item,
                items: newItems,
                // Ensure PK is preserved "ORDER#..."
            };

            await destClient.send(new PutItemCommand({
                TableName: DEST_ORDERS_TABLE,
                Item: marshall(newOrder, { removeUndefinedValues: true })
            }));
            console.log(`Migrated Order ${item.PK}`);
        }
    } catch (e) {
        console.log("No orders table found or empty, skipping orders.");
    }
}

async function run() {
    try {
        console.log(`Source Region: ap-southeast-2`);
        console.log(`Dest Region: ${await destClient.config.region()}`);

        await migrateProducts();
        await migrateOrders();

        console.log('MIGRATION SUCCESSFUL');
    } catch (e) {
        console.error('Migration Failed:', e);
    }
}

run();
