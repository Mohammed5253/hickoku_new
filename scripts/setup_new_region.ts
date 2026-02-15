
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback to .env

import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';

// Initialize client (uses AWS_REGION from .env by default)
const client = new DynamoDBClient({});

const TABLES = [
    {
        TableName: 'products',
        KeySchema: [{ AttributeName: 'PK', KeyType: 'HASH' as const }],
        AttributeDefinitions: [{ AttributeName: 'PK', AttributeType: 'S' as const }],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
    },
    {
        TableName: 'product_variants',
        KeySchema: [{ AttributeName: 'PK', KeyType: 'HASH' as const }],
        AttributeDefinitions: [
            { AttributeName: 'PK', AttributeType: 'S' as const },
            { AttributeName: 'productId', AttributeType: 'S' as const }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'productId-index',
                KeySchema: [{ AttributeName: 'productId', KeyType: 'HASH' as const }],
                Projection: { ProjectionType: 'ALL' as const },
                ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
            }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
    },
    {
        TableName: 'orders',
        KeySchema: [
            { AttributeName: "PK", KeyType: "HASH" as const },
            { AttributeName: "SK", KeyType: "RANGE" as const }
        ],
        AttributeDefinitions: [
            { AttributeName: "PK", AttributeType: "S" as const },
            { AttributeName: "SK", AttributeType: "S" as const }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
    },
    {
        TableName: "cart",
        KeySchema: [
            { AttributeName: "PK", KeyType: "HASH" as const },
            { AttributeName: "SK", KeyType: "RANGE" as const }
        ],
        AttributeDefinitions: [
            { AttributeName: "PK", AttributeType: "S" as const },
            { AttributeName: "SK", AttributeType: "S" as const }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
    }
];

async function createTables() {
    console.log(`Setting up tables in region: ${await client.config.region()}`);

    for (const tableConfig of TABLES) {
        try {
            console.log(`Creating table: ${tableConfig.TableName}...`);
            await client.send(new CreateTableCommand(tableConfig));
            console.log(`Table ${tableConfig.TableName} created successfully (status: CREATING).`);
        } catch (error: any) {
            if (error.name === 'ResourceInUseException') {
                console.log(`Table ${tableConfig.TableName} already exists.`);
            } else {
                console.error(`Error creating table ${tableConfig.TableName}:`, error);
            }
        }
    }
    console.log('Table setup complete.');
}

createTables();
