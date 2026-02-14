/**
 * Cart type definitions
 */

export interface CartItem {
    sessionId: string;
    sku: string;
    productId: string;
    productName: string;
    size: string;
    quantity: number;
    price: number; // in cents
    image: string;
    addedAt: string;
    updatedAt: string;
}

export interface Cart {
    sessionId: string;
    items: CartItem[];
    itemCount: number;
    subtotal: number; // in cents
}

/**
 * DynamoDB item type
 */

export interface CartDynamoDBItem {
    PK: string; // CART#{sessionId}
    SK: string; // ITEM#{sku}
    sessionId: string;
    sku: string;
    productId: string;
    productName: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
    addedAt: string;
    updatedAt: string;
    ttl: number; // Unix timestamp for TTL
}

/**
 * API Request/Response types
 */

export interface AddToCartRequest {
    sessionId: string;
    sku: string;
    productId: string;
    productName: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
}

export interface UpdateCartItemRequest {
    sessionId: string;
    quantity: number;
}

export interface CartResponse {
    cart: Cart;
}

export interface CartItemResponse {
    item: CartItem;
}
