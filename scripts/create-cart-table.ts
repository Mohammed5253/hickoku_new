import { DynamoDBClient, CreateTableCommand, DescribeTableCommand, UpdateTimeToLiveCommand } from '@aws-sdk/client-dynamodb';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

async function createCartTable() {
    console.log('🛒 Creating Cart table...\n');

    const tableName = 'cart';

    try {
        // Check if table already exists
        try {
            await client.send(new DescribeTableCommand({ TableName: tableName }));
            console.log(`⚠️  Table "${tableName}" already exists. Skipping creation.`);
            return;
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

        // Wait for table to be active before enabling TTL
        console.log('   - Waiting for table to be active...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Enable TTL
        const ttlCommand = new UpdateTimeToLiveCommand({
            TableName: tableName,
            TimeToLiveSpecification: {
                Enabled: true,
                AttributeName: 'ttl',
            },
        });

        await client.send(ttlCommand);

        console.log('   - TTL: Enabled (30 days auto-cleanup)');
        console.log('   - Keys: PK (sessionId), SK (item SKU)');

    } catch (error: any) {
        console.error(`❌ Failed to create table "${tableName}"`);
        console.error(`   Error: ${error.message}`);
        throw error;
    }
}

createCartTable()
    .then(() => {
        console.log('\n✨ Cart table setup complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Setup failed:', error);
        process.exit(1);
    });
