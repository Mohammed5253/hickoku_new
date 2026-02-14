import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const docClient = DynamoDBDocumentClient.from(client);

async function backupProducts() {
    console.log('💾 Backing up existing products table...\n');

    try {
        // Scan existing products table
        const scanCommand = new ScanCommand({
            TableName: 'products',
        });

        const response = await docClient.send(scanCommand);
        const items = response.Items || [];

        console.log(`📦 Found ${items.length} products to backup`);

        // Create backup directory
        const backupDir = path.join(__dirname, '../backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Save backup
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(backupDir, `products-backup-${timestamp}.json`);

        fs.writeFileSync(backupFile, JSON.stringify(items, null, 2));

        console.log(`✅ Backup saved to: ${backupFile}`);
        console.log('\n✨ Backup complete!');

        return items;
    } catch (error: any) {
        console.error('❌ Backup failed!');
        console.error(`   Error: ${error.message}`);
        process.exit(1);
    }
}

backupProducts();
