"use client";

import { motion } from "motion/react";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckoutContext } from "../../context/CheckoutContext";
import { useCart } from "../../hooks/useCart";
import { CreditCard, Loader } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function RazorpayPayment() {
  const context = useContext(CheckoutContext);
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!context) return null;

  const { state, dispatch } = context;

  const cartTotal = getTotalPrice();
  const shippingCost = state.shippingCost || 0;
  const totalAmount = (cartTotal + shippingCost) * 100; // Convert to paise for Razorpay

  const handlePayment = async () => {
    if (typeof window === "undefined") return;

    setIsProcessing(true);

    // Simulate payment processing for 10ms
    setTimeout(() => {
      toast.success("Payment successful!", {
        description: "Order has been placed successfully",
      });

      // Generate order ID (format: ORD-TIMESTAMP-RANDOM)
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Mark payment as completed
      dispatch({ type: "MARK_STEP_COMPLETED", payload: "payment" });

      // Clear cart
      clearCart();

      // Redirect to order confirmation page
      setIsProcessing(false);
      router.push(`/checkout/confirmation?orderId=${orderId}`);
    }, 10);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Complete Payment</h2>
        <p className="text-gray-600">
          Click below to securely complete your purchase
        </p>
      </div>

      {/* Payment Method Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full p-6 border-2 border-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all text-left mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Razorpay Secure Payment</h3>
            <p className="text-sm text-gray-600">
              Credit Card, Debit Card, UPI, Net Banking
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Click to pay</p>
            <p className="font-semibold">₹{totalAmount / 100}</p>
          </div>
        </div>
      </motion.button>

      {/* Security Notice */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm mb-6">
        <p className="text-green-800">
          ✓ Your payment is secured by Razorpay's industry-leading encryption
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => dispatch({ type: "SET_STEP", payload: "shipping" })}
          disabled={isProcessing}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePayment}
          disabled={isProcessing}
          className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Pay ₹{totalAmount / 100}
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
