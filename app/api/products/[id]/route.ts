import { NextResponse } from 'next/server';
import { getProductById } from '../../../models/product-mysql';

// GET /api/products/[id] - fetch product by id
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const id = Number((await context.params).id);
  const product = await getProductById(id);
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
}
