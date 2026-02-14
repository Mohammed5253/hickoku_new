import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const docClient = DynamoDBDocumentClient.from(client);

export interface ProductVariant {
    sku: string;
    size: string;
    price: number;
    stockQuantity: number;
    stockStatus: string;
    weight: number;
    isAvailable: boolean;
}

export interface Product {
    productId: string;
    name: string;
    description: string;
    highlight: string;
    category: string;
    badge: string | null;
    images: string[];
    slug: string;
    status: string;
    variant: ProductVariant;
}

/**
 * Get all products with their 6ml variants
 * @param category - Optional category filter ("For Her" or "For Him")
 */
export async function getAllProductsWithVariants(category?: string): Promise<Product[]> {
    try {
        const scanCommand = new ScanCommand({
            TableName: 'products-enhanced',
        });

        const response = await docClient.send(scanCommand);
        const items = response.Items || [];

        // Group items by product
        const productsMap = new Map<string, any>();

        for (const item of items) {
            const productId = item.productId;

            if (!productsMap.has(productId)) {
                productsMap.set(productId, {
                    metadata: null,
                    variant: null,
                });
            }

            const product = productsMap.get(productId);

            if (item.SK === 'METADATA') {
                product.metadata = item;
            } else if (item.SK.startsWith('VARIANT#')) {
                product.variant = item;
            }
        }

        // Combine metadata and variant into Product objects
        const products: Product[] = [];

        for (const [productId, data] of productsMap.entries()) {
            if (!data.metadata || !data.variant) continue;

            // Filter by category if provided
            if (category && data.metadata.category !== category) continue;

            products.push({
                productId: data.metadata.productId,
                name: data.metadata.name,
                description: data.metadata.description,
                highlight: data.metadata.highlight,
                category: data.metadata.category,
                badge: data.metadata.badge,
                images: data.metadata.images,
                slug: data.metadata.slug,
                status: data.metadata.status,
                variant: {
                    sku: data.variant.sku,
                    size: data.variant.size,
                    price: data.variant.price,
                    stockQuantity: data.variant.stockQuantity,
                    stockStatus: data.variant.stockStatus,
                    weight: data.variant.weight,
                    isAvailable: data.variant.isAvailable,
                },
            });
        }

        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
    }
}

/**
 * Get a single product with its 6ml variant
 * @param productId - Product ID (e.g., "001")
 */
export async function getProductWithVariant(productId: string): Promise<Product | null> {
    try {
        const queryCommand = new QueryCommand({
            TableName: 'products-enhanced',
            KeyConditionExpression: 'PK = :pk',
            ExpressionAttributeValues: {
                ':pk': `PRODUCT#${productId}`,
            },
        });

        const response = await docClient.send(queryCommand);
        const items = response.Items || [];

        if (items.length === 0) return null;

        let metadata: any = null;
        let variant: any = null;

        for (const item of items) {
            if (item.SK === 'METADATA') {
                metadata = item;
            } else if (item.SK.startsWith('VARIANT#')) {
                variant = item;
            }
        }

        if (!metadata || !variant) return null;

        return {
            productId: metadata.productId,
            name: metadata.name,
            description: metadata.description,
            highlight: metadata.highlight,
            category: metadata.category,
            badge: metadata.badge,
            images: metadata.images,
            slug: metadata.slug,
            status: metadata.status,
            variant: {
                sku: variant.sku,
                size: variant.size,
                price: variant.price,
                stockQuantity: variant.stockQuantity,
                stockStatus: variant.stockStatus,
                weight: variant.weight,
                isAvailable: variant.isAvailable,
            },
        };
    } catch (error) {
        console.error('Error fetching product:', error);
        throw new Error('Failed to fetch product');
    }
}
