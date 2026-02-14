import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

async function createOrdersTable() {
    console.log('📦 Creating Orders table...\n');

    const tableName = process.env.DYNAMODB_ORDERS_TABLE || 'hickoku-orders';

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
                { AttributeName: 'customerEmail', AttributeType: 'S' },
                { AttributeName: 'status', AttributeType: 'S' },
                { AttributeName: 'createdAt', AttributeType: 'S' },
            ],
            GlobalSecondaryIndexes: [
                {
                    IndexName: 'CustomerEmailIndex',
                    KeySchema: [
                        { AttributeName: 'customerEmail', KeyType: 'HASH' },
                        { AttributeName: 'createdAt', KeyType: 'RANGE' },
                    ],
                    Projection: { ProjectionType: 'ALL' },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 2,
                        WriteCapacityUnits: 2,
                    },
                },
                {
                    IndexName: 'StatusIndex',
                    KeySchema: [
                        { AttributeName: 'status', KeyType: 'HASH' },
                        { AttributeName: 'createdAt', KeyType: 'RANGE' },
                    ],
                    Projection: { ProjectionType: 'ALL' },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 2,
                        WriteCapacityUnits: 2,
                    },
                },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 2,
                WriteCapacityUnits: 2,
            },
            Tags: [
                { Key: 'Project', Value: 'Hickoku' },
                { Key: 'Environment', Value: 'Production' },
            ],
        });

        await client.send(command);

        console.log(`✅ Table "${tableName}" created successfully!`);
        console.log('   - Billing: Provisioned (2 RCU, 2 WCU)');
        console.log('   - GSI 1: CustomerEmailIndex (find orders by email)');
        console.log('   - GSI 2: StatusIndex (filter by order status)');
        console.log('   - Keys: PK (orderId), SK (METADATA or ITEM#)');

    } catch (error: any) {
        console.error(`❌ Failed to create table "${tableName}"`);
        console.error(`   Error: ${error.message}`);
        throw error;
    }
}

createOrdersTable()
    .then(() => {
        console.log('\n✨ Orders table setup complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Setup failed:', error);
        process.exit(1);
    });
