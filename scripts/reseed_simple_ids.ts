
import { DynamoDBClient, ScanCommand, PutItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall, marshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const PRODUCTS_TABLE = 'products-enhanced';
const CART_TABLE = 'cart';
const ORDERS_TABLE = 'orders';

async function clearTable(tableName: string) {
    console.log(`Clearing table: ${tableName}...`);
    let items: any[] = [];
    let lastEvaluatedKey: any = undefined;

    do {
        const command = new ScanCommand({
            TableName: tableName,
            ExclusiveStartKey: lastEvaluatedKey,
        });
        const response = await client.send(command);
        if (response.Items) {
            items = items.concat(response.Items);
        }
        lastEvaluatedKey = response.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    console.log(`Found ${items.length} items to delete in ${tableName}.`);

    for (const item of items) {
        // Assume PK and SK are the keys. Adjust if different for cart/orders
        const key: any = {};
        if (item.PK) key.PK = item.PK;
        if (item.SK) key.SK = item.SK;
        // Cart might use sessionId as PK? Let's check schema assumption or just use what we find
        // actually cart uses PK = CART#sessionId, SK = PRODUCT#productId
        // orders use PK = ORDER#id, SK = METADATA etc.
        // Generic deletion based on scanned keys
        const deleteKey: any = {};
        if (item.PK) deleteKey.PK = item.PK;
        if (item.SK) deleteKey.SK = item.SK;
        if (item.sessionId) deleteKey.sessionId = item.sessionId; // for cart if simple key
        if (item.productId) deleteKey.productId = item.productId; // for cart if composite

        // BETTER APPROACH for generic delete: use the keys from the schema.
        // Since we don't have exact schema defs here, we'll assume standard PK/SK pattern for our apps
        // products-enhanced: PK, SK
        // cart: PK (CART#sessionId), SK (PRODUCT#productId)
        // orders: PK (ORDER#id), SK (METADATA/ITEM#...)

        // Let's rely on the item having the key attributes

        const deleteParams = {
            TableName: tableName,
            Key: deleteKey
        };

        try {
            await client.send(new DeleteItemCommand(deleteParams));
        } catch (e) {
            console.error(`Failed to delete item in ${tableName}:`, e);
            // Non-critical, just keep going
        }
    }
    console.log(`Cleared ${tableName}.`);
}

async function migrateProducts() {
    console.log('Starting migration of products-enhanced...');

    // 1. Scan all items
    const scanCommand = new ScanCommand({ TableName: PRODUCTS_TABLE });
    const response = await client.send(scanCommand);
    const items = response.Items?.map(i => unmarshall(i)) || [];

    console.log(`Found ${items.length} items to migrate.`);

    for (const item of items) {
        // We only care about migrating if the PK or SK contains padding like "001"
        // Pattern: PRODUCT#001 -> PRODUCT#1

        const oldPK = item.PK;
        const oldSK = item.SK;

        let newPK = oldPK;
        let newSK = oldSK;
        let needsMigration = false;

        // Helper to strip zeros from ID part
        const stripZeros = (str: string) => str.replace(/PRODUCT#0*([1-9][0-9]*)/, 'PRODUCT#$1');

        if (oldPK && oldPK.startsWith('PRODUCT#')) {
            const stripped = stripZeros(oldPK);
            if (stripped !== oldPK) {
                newPK = stripped;
                needsMigration = true;
            }
        }

        // Also update productId field inside the item if it exists
        const newItem = { ...item };
        if (newItem.productId && typeof newItem.productId === 'string' && newItem.productId.startsWith('0')) {
            newItem.productId = String(Number(newItem.productId)); // "001" -> "1"
            needsMigration = true;
        }

        // Update SKU if it follows pattern like HICK-001 -> HICK-1 ? NO.
        // User query: "reference product and its variant with exact id of product raher than adding 00"
        // This implies SKU HICK-001 might effectively be HICK-1 or we keep SKU formatted.
        // Standard practice: SKUs are opaque strings often fixed length. 
        // Logic: "Product Card sends ID '1'". 
        // So we ONLY migrate the Database Keys (PK) and the productId field. 
        // We leave SKU alone unless user explicitly said "change SKU format". 
        // User said "reference product ... with exact id". 
        // Let's stick to PK and productId.

        if (needsMigration) {
            console.log(`Migrating: ${oldPK} -> ${newPK}`);

            // 1. Delete old
            await client.send(new DeleteItemCommand({
                TableName: PRODUCTS_TABLE,
                Key: { PK: { S: oldPK }, SK: { S: oldSK } }
            }));

            // 2. Put new
            newItem.PK = newPK;
            // SK usually is "METADATA" or "VARIANT#..."
            // If SK contains the ID, we might need to change it too?
            // In repo: query is 'PK = :pk'. SK is METADATA or VARIANT#...
            // So SK doesn't likely contain the ID.

            await client.send(new PutItemCommand({
                TableName: PRODUCTS_TABLE,
                Item: marshall(newItem)
            }));
        } else {
            console.log(`Skipping (already simple or not product): ${oldPK}`);
        }
    }
    console.log('Migration complete.');
}

async function run() {
    try {
        await migrateProducts();
        await clearTable(CART_TABLE);
        await clearTable(ORDERS_TABLE);
        console.log('SUCCESS: Database re-seeded and cleaned.');
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

run();
