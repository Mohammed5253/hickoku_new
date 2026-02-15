
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { DynamoDBClient, DescribeTableCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: 'ap-southeast-2' });

async function inspect() {
    console.log(`Inspecting tables in ${await client.config.region()}...`);
    const tables = ['products', 'orders', 'products-enhanced', 'hickoku-orders'];

    for (const tableName of tables) {
        try {
            const data = await client.send(new DescribeTableCommand({ TableName: tableName }));
            console.log(`Table: ${tableName}`);
            console.log('KeySchema:', JSON.stringify(data.Table?.KeySchema, null, 2));
            console.log('AttributeDefinitions:', JSON.stringify(data.Table?.AttributeDefinitions, null, 2));
        } catch (e: any) {
            console.log(`Table ${tableName} not found or error:`, e.message);
        }
    }
}

inspect();
