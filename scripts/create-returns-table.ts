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

async function createReturnsTable() {
    console.log('🔄 Creating Returns table...\n');

    const tableName = 'returns';

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
                { AttributeName: 'orderId', AttributeType: 'S' },
                { AttributeName: 'createdAt', AttributeType: 'S' },
            ],
            GlobalSecondaryIndexes: [
                {
                    IndexName: 'OrderIndex',
                    KeySchema: [
                        { AttributeName: 'orderId', KeyType: 'HASH' },
                        { AttributeName: 'createdAt', KeyType: 'RANGE' },
                    ],
                    Projection: { ProjectionType: 'ALL' },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1,
                    },
                },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
            Tags: [
                { Key: 'Project', Value: 'Hickoku' },
                { Key: 'Environment', Value: 'Production' },
            ],
        });

        await client.send(command);

        console.log(`✅ Table "${tableName}" created successfully!`);
        console.log('   - Billing: Provisioned (1 RCU, 1 WCU)');
        console.log('   - GSI: OrderIndex (find returns by order)');
        console.log('   - Keys: PK (returnId), SK (METADATA or ITEM#)');

    } catch (error: any) {
        console.error(`❌ Failed to create table "${tableName}"`);
        console.error(`   Error: ${error.message}`);
        throw error;
    }
}

createReturnsTable()
    .then(() => {
        console.log('\n✨ Returns table setup complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Setup failed:', error);
        process.exit(1);
    });
