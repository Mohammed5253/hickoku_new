import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

async function testConnection() {
    console.log('🔍 Testing DynamoDB connection...\n');

    try {
        // Test credentials
        console.log('📋 Configuration:');
        console.log(`   Region: ${process.env.AWS_REGION}`);
        console.log(`   Access Key: ${process.env.AWS_ACCESS_KEY_ID?.substring(0, 8)}...`);
        console.log('');

        // List tables
        const command = new ListTablesCommand({});
        const response = await client.send(command);

        console.log('✅ Connection successful!\n');
        console.log('📊 Existing tables:');
        if (response.TableNames && response.TableNames.length > 0) {
            response.TableNames.forEach((table) => {
                console.log(`   - ${table}`);
            });
        } else {
            console.log('   (No tables found)');
        }

        console.log('\n✨ Ready to proceed with migration!');
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Connection failed!');
        console.error(`   Error: ${error.message}`);
        console.error('\n💡 Please check:');
        console.error('   1. AWS credentials in .env.local');
        console.error('   2. AWS region is correct');
        console.error('   3. IAM user has DynamoDB permissions');
        process.exit(1);
    }
}

testConnection();
