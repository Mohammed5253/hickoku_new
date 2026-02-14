import { NextResponse } from 'next/server';
import { getSessionId } from '../../../lib/session';
import { getCart } from '../../../repositories/cart.repository';
import { validateCartStock, getInvalidCartItems, getQuantityAdjustments } from '../../../lib/stock-validation';

/**
 * GET /api/cart/validate
 * Validate cart items against current stock levels
 */
export async function GET() {
    try {
        const sessionId = await getSessionId();

        if (!sessionId) {
            return NextResponse.json({
                valid: true,
                invalidItems: [],
                adjustments: [],
                message: 'No cart to validate',
            });
        }

        const cart = await getCart(sessionId);

        if (cart.items.length === 0) {
            return NextResponse.json({
                valid: true,
                invalidItems: [],
                adjustments: [],
                message: 'Cart is empty',
            });
        }

        // Validate all items
        const validatedItems = await validateCartStock(cart.items);
        const invalidItems = getInvalidCartItems(validatedItems);
        const adjustments = getQuantityAdjustments(validatedItems);

        const isValid = invalidItems.length === 0 && adjustments.length === 0;

        return NextResponse.json({
            valid: isValid,
            invalidItems: invalidItems.map((item) => ({
                sku: item.sku,
                productName: item.productName,
                requestedQuantity: item.quantity,
                availableQuantity: item.stockValidation.availableQuantity,
                inStock: item.stockValidation.inStock,
            })),
            adjustments,
            message: isValid
                ? 'All items are available'
                : 'Some items are out of stock or have limited availability',
        });
    } catch (error: any) {
        console.error('GET /api/cart/validate error:', error);
        return NextResponse.json(
            { error: 'Failed to validate cart', message: error.message },
            { status: 500 }
        );
    }
}
