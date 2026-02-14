import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const docClient = DynamoDBDocumentClient.from(client);

// Pricing for 6ml (in paise)
const PRICING = {
    '6ml': 12500,   // ₹125
};

// Weight for 6ml (in grams)
const WEIGHTS = {
    '6ml': 50,
};

const SIZES = ['6ml'];

async function createProductsEnhancedTable() {
    console.log('🎨 Creating products-enhanced table...\n');

    const tableName = 'products-enhanced';

    try {
        // Check if table already exists
        try {
            await client.send(new DescribeTableCommand({ TableName: tableName }));
            console.log(`⚠️  Table "${tableName}" already exists. Skipping creation.`);
            return tableName;
        } catch (error: any) {
            if (error.name !== 'ResourceNotFoundException') {
                throw error;
            }
        }

        // Create table
        const command = new CreateTableCommand({
            TableName: tableName,
            KeySchema: [
                { AttributeName: 'PK', KeyType: 'HASH' },  // Partition key
                { AttributeName: 'SK', KeyType: 'RANGE' }, // Sort key
            ],
            AttributeDefinitions: [
                { AttributeName: 'PK', AttributeType: 'S' },
                { AttributeName: 'SK', AttributeType: 'S' },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
            Tags: [
                { Key: 'Project', Value: 'Hickoku' },
                { Key: 'Environment', Value: 'Production' },
            ],
        });

        await client.send(command);

        console.log(`✅ Table "${tableName}" created successfully!`);
        console.log('   - Billing: Provisioned (5 RCU, 5 WCU) ✨ FREE TIER');
        console.log('   - Keys: PK (productId), SK (METADATA or VARIANT#)');
        console.log('   - Waiting for table to be active...');

        // Wait for table to be fully active
        await new Promise(resolve => setTimeout(resolve, 10000));

        return tableName;
    } catch (error: any) {
        console.error(`❌ Failed to create table "${tableName}"`);
        console.error(`   Error: ${error.message}`);
        throw error;
    }
}

async function migrateProducts() {
    console.log('\n📦 Migrating products from old table...\n');

    try {
        // Scan existing products table
        const scanCommand = new ScanCommand({
            TableName: 'products',
        });

        const response = await docClient.send(scanCommand);
        const products = response.Items || [];

        console.log(`Found ${products.length} products to migrate\n`);

        let totalItems = 0;

        for (const product of products) {
            const productId = String(product.id).padStart(3, '0');
            const productCode = product.name.substring(0, 3).toUpperCase();

            console.log(`Migrating: ${product.name} (ID: ${productId})`);

            // Create METADATA item
            const metadataItem = {
                PK: `PRODUCT#${productId}`,
                SK: 'METADATA',
                productId,
                name: product.name,
                description: product.description || '',
                highlight: product.highlight || '',
                category: product.category,
                badge: product.badge || null,
                images: [product.image], // Convert single image to array
                availableSizes: SIZES,
                status: 'active',
                slug: product.name.toLowerCase().replace(/\s+/g, '-'),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            await docClient.send(new PutCommand({
                TableName: 'products-enhanced',
                Item: metadataItem,
            }));

            totalItems++;
            console.log(`  ✓ Created METADATA`);

            // Create VARIANT items for each size
            for (const size of SIZES) {
                const sku = `${productCode}-${size.toUpperCase()}-${productId}`;

                const variantItem = {
                    PK: `PRODUCT#${productId}`,
                    SK: `VARIANT#${sku}`,
                    productId,
                    sku,
                    size,
                    price: PRICING[size as keyof typeof PRICING],
                    compareAtPrice: null,
                    stockQuantity: 50, // Default stock
                    lowStockThreshold: 10,
                    stockStatus: 'in_stock',
                    weight: WEIGHTS[size as keyof typeof WEIGHTS],
                    isAvailable: true,
                    updatedAt: new Date().toISOString(),
                };

                await docClient.send(new PutCommand({
                    TableName: 'products-enhanced',
                    Item: variantItem,
                }));

                totalItems++;
                console.log(`  ✓ Created variant: ${sku} (₹${PRICING[size as keyof typeof PRICING] / 100})`);
            }

            console.log('');
        }

        console.log(`✅ Migration complete!`);
        console.log(`   - Products migrated: ${products.length}`);
        console.log(`   - Total items created: ${totalItems}`);
        console.log(`   - METADATA items: ${products.length}`);
        console.log(`   - VARIANT items: ${products.length * SIZES.length}`);

    } catch (error: any) {
        console.error('❌ Migration failed!');
        console.error(`   Error: ${error.message}`);
        throw error;
    }
}

async function main() {
    try {
        await createProductsEnhancedTable();
        await migrateProducts();
        console.log('\n✨ Products migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Setup failed:', error);
        process.exit(1);
    }
}

main();
