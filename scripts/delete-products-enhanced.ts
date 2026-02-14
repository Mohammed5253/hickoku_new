import { DynamoDBClient, DeleteTableCommand } from '@aws-sdk/client-dynamodb';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

async function deleteTable() {
    console.log('🗑️  Deleting products-enhanced table...\n');

    try {
        await client.send(new DeleteTableCommand({ TableName: 'products-enhanced' }));
        console.log('✅ Table deleted successfully!');
        console.log('   Waiting for deletion to complete...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log('✨ Ready to recreate table');
    } catch (error: any) {
        if (error.name === 'ResourceNotFoundException') {
            console.log('⚠️  Table does not exist, nothing to delete');
        } else {
            console.error('❌ Failed to delete table:', error.message);
            throw error;
        }
    }
}

deleteTable()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
