"use client";

import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  const { state, dispatch } = context;

  const addToCart = (item: {
    id: number;
    name: string;
    price: string;
    image: string;
    sku: string;
  }) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
  };

  const removeFromCart = (sku: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: sku });
  };

  const updateQuantity = (sku: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { sku, quantity } });
  };

  const openCart = () => {
    dispatch({ type: "OPEN_CART" });
  };

  const closeCart = () => {
    dispatch({ type: "CLOSE_CART" });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      const price = parseFloat(item.price);
      return total + price * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    items: state.items,
    isOpen: state.isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    openCart,
    closeCart,
    clearCart,
    getTotalPrice,
    getCartItemCount,
  };
}
