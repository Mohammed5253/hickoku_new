import { NextResponse } from 'next/server';
import { getAllProducts } from '../../models/product-dynamo.js';

// GET /api/products - fetch all or filter
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const name = searchParams.get('name') || undefined;
  const products = await getAllProducts({ category, name });
  return NextResponse.json(products);
}


// Optionally, you can remove the POST handler if not needed, or update it to create products in MongoDB.