import { NextResponse } from 'next/server';
import { getAllProducts } from '../../models/product-dynamo';

// GET /api/products - fetch all or filter
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const name = searchParams.get('name') || undefined;
    const products = await getAllProducts({ category, name });
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', message: error.message },
      { status: 500 }
    );
  }
}