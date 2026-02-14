import { NextResponse } from 'next/server';
import { getAllProductsWithVariants } from '../../repositories/products.repository';

/**
 * GET /api/products-enhanced
 * GET /api/products-enhanced?category=For%20Her
 * 
 * Fetch all products with their 6ml variants
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        const products = await getAllProductsWithVariants(category || undefined);

        return NextResponse.json(products, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products', message: error.message },
            { status: 500 }
        );
    }
}
