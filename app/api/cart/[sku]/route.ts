import { NextResponse } from 'next/server';
import { getSessionId } from '../../../lib/session';
import { updateQuantity, removeFromCart } from '../../../repositories/cart.repository';

/**
 * PUT /api/cart/[sku]
 * Update item quantity
 */
export async function PUT(
    request: Request,
    context: { params: Promise<{ sku: string }> }
) {
    try {
        const { sku } = await context.params;
        const body = await request.json();
        const { quantity } = body;

        // Validate quantity
        if (typeof quantity !== 'number' || quantity < 1 || quantity > 10) {
            return NextResponse.json(
                { error: 'Quantity must be between 1 and 10' },
                { status: 400 }
            );
        }

        const sessionId = await getSessionId();

        if (!sessionId) {
            return NextResponse.json(
                { error: 'No active cart session' },
                { status: 404 }
            );
        }

        const cart = await updateQuantity(sessionId, sku, quantity);

        return NextResponse.json({
            success: true,
            cart,
        });
    } catch (error: any) {
        console.error('PUT /api/cart/[sku] error:', error);

        if (error.message.includes('not found')) {
            return NextResponse.json(
                { error: error.message },
                { status: 404 }
            );
        }

        if (error.message.includes('Quantity') || error.message.includes('stock')) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update quantity', message: error.message },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/cart/[sku]
 * Remove item from cart
 */
export async function DELETE(
    request: Request,
    context: { params: Promise<{ sku: string }> }
) {
    try {
        const { sku } = await context.params;
        const sessionId = await getSessionId();

        if (!sessionId) {
            return NextResponse.json(
                { error: 'No active cart session' },
                { status: 404 }
            );
        }

        const cart = await removeFromCart(sessionId, sku);

        return NextResponse.json({
            success: true,
            cart,
        });
    } catch (error: any) {
        console.error('DELETE /api/cart/[sku] error:', error);
        return NextResponse.json(
            { error: 'Failed to remove item', message: error.message },
            { status: 500 }
        );
    }
}
