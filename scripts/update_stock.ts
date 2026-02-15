
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'product_variants';

async function updateStock() {
    try {
        console.log(`Scanning table ${TABLE_NAME} in ${process.env.AWS_REGION}...`);

        // 1. Scan all variants
        const scanCmd = new ScanCommand({
            TableName: TABLE_NAME,
        });
        const response = await docClient.send(scanCmd);
        const items = response.Items || [];

        console.log(`Found ${items.length} variants. Updating stock...`);

        // 2. Update each variant
        let updatedCount = 0;
        for (const item of items) {
            const updateCmd = new UpdateCommand({
                TableName: TABLE_NAME,
                Key: {
                    PK: item.PK
                },
                UpdateExpression: 'set stock = :s, inventoryStatus = :is',
                ExpressionAttributeValues: {
                    ':s': 100,
                    ':is': 'IN_STOCK'
                }
            });

            await docClient.send(updateCmd);
            console.log(`Updated ${item.sku}: Stock=100, Status=IN_STOCK`);
            updatedCount++;
        }

        console.log(`Successfully updated ${updatedCount} variants.`);

    } catch (error) {
        console.error('Error updating stock:', error);
    }
}

updateStock();
