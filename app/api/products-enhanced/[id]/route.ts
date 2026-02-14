import { NextResponse } from 'next/server';
import { getProductWithVariant } from '../../../repositories/products.repository';

/**
 * GET /api/products-enhanced/[id]
 * 
 * Fetch a single product with its 6ml variant
 */
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        // Pad ID to 3 digits
        const productId = id.padStart(3, '0');

        const product = await getProductWithVariant(productId);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(product, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product', message: error.message },
            { status: 500 }
        );
    }
}
