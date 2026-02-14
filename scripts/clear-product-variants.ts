import { DynamoDBClient, DeleteTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
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

async function clearProductVariants() {
    console.log('🗑️  Clearing old product variants...\n');

    try {
        // Scan all items
        const scanCommand = new ScanCommand({
            TableName: 'products-enhanced',
        });

        const response = await docClient.send(scanCommand);
        const items = response.Items || [];

        console.log(`Found ${items.length} items to delete\n`);

        // Delete all items
        for (const item of items) {
            await docClient.send(new DeleteCommand({
                TableName: 'products-enhanced',
                Key: {
                    PK: item.PK,
                    SK: item.SK,
                },
            }));
            console.log(`✓ Deleted: ${item.PK} - ${item.SK}`);
        }

        console.log('\n✅ All items deleted successfully!');
        console.log('   Ready to migrate with 6ml variants');

    } catch (error: any) {
        console.error('❌ Failed to clear variants:', error.message);
        throw error;
    }
}

clearProductVariants()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
