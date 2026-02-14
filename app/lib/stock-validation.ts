import { getProductWithVariant } from '../repositories/products.repository';
import { CartItem } from '../repositories/cart.repository';

export interface StockValidationResult {
    isValid: boolean;
    availableQuantity: number;
    requestedQuantity: number;
    inStock: boolean;
}

/**
 * Validate if cart item has sufficient stock
 */
export async function validateCartItemStock(
    item: CartItem
): Promise<StockValidationResult> {
    try {
        const product = await getProductWithVariant(item.productId);

        if (!product) {
            return {
                isValid: false,
                availableQuantity: 0,
                requestedQuantity: item.quantity,
                inStock: false,
            };
        }

        const inStock = product.variant.stockStatus === 'in_stock';
        const availableQuantity = product.variant.stockQuantity;
        const requestedQuantity = item.quantity;

        return {
            isValid: inStock && availableQuantity >= requestedQuantity,
            availableQuantity,
            requestedQuantity,
            inStock,
        };
    } catch (error) {
        console.error('Error validating stock:', error);
        return {
            isValid: false,
            availableQuantity: 0,
            requestedQuantity: item.quantity,
            inStock: false,
        };
    }
}

/**
 * Validate all cart items and return items with stock info
 */
export async function validateCartStock(
    items: CartItem[]
): Promise<Array<CartItem & { stockValidation: StockValidationResult }>> {
    const validatedItems = await Promise.all(
        items.map(async (item) => {
            const stockValidation = await validateCartItemStock(item);
            return {
                ...item,
                stockValidation,
            };
        })
    );

    return validatedItems;
}

/**
 * Get cart items that are out of stock or have insufficient quantity
 */
export function getInvalidCartItems(
    validatedItems: Array<CartItem & { stockValidation: StockValidationResult }>
) {
    return validatedItems.filter((item) => !item.stockValidation.isValid);
}

/**
 * Get suggested quantity adjustments for cart items
 */
export function getQuantityAdjustments(
    validatedItems: Array<CartItem & { stockValidation: StockValidationResult }>
): Array<{ sku: string; currentQuantity: number; suggestedQuantity: number }> {
    return validatedItems
        .filter((item) => {
            const { availableQuantity, requestedQuantity, inStock } = item.stockValidation;
            return inStock && availableQuantity < requestedQuantity;
        })
        .map((item) => ({
            sku: item.sku,
            currentQuantity: item.quantity,
            suggestedQuantity: item.stockValidation.availableQuantity,
        }));
}
