"use client";

import { motion } from "motion/react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  Package,
  MapPin,
  Truck,
  CreditCard,
  ArrowRight,
  Home,
} from "lucide-react";
import { useContext, useEffect } from "react";
import { CheckoutContext } from "../../context/CheckoutContext";
import { Header } from "../../components/Header";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const context = useContext(CheckoutContext);
  const orderId = searchParams.get("orderId");

  const state = context?.state || {
    address: {
      firstName: "Guest",
      lastName: "User",
      email: "guest@example.com",
      phone: "+91-9876543210",
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India",
    },
    shippingMethod: "express",
    shippingCost: 300,
  };

  useEffect(() => {
    if (!orderId) {
      router.push("/");
    }
  }, [orderId, router]);

  if (!orderId) {
    return null;
  }

  const subtotal = state.shippingCost ? 100 : 100; // Mock calculation
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + tax;

  return (
    <>
      <Header />
      <div className="pt-20 bg-gradient-to-b from-green-50 to-gray-50 min-h-screen pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"
              >
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-bold text-gray-900 mb-3"
            >
              Order Confirmed! 🎉
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-gray-600"
            >
              Thank you for your purchase. Your order has been successfully
              placed.
            </motion.p>
          </motion.div>

          {/* Order ID Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border-2 border-green-200 p-8 mb-8"
          >
            <div className="text-center mb-8">
              <p className="text-gray-600 text-sm mb-2">ORDER ID</p>
              <p className="text-3xl font-bold text-gray-900 font-mono">
                {orderId}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Estimated Delivery */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3"
                >
                  <Truck className="w-6 h-6 text-blue-600" />
                </motion.div>
                <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                <p className="font-semibold text-gray-900">2-3 Days</p>
              </div>

              {/* Tracking Status */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3"
                >
                  <Package className="w-6 h-6 text-purple-600" />
                </motion.div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="font-semibold text-gray-900">Processing</p>
              </div>

              {/* Notification */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-orange-600" />
                </motion.div>
                <p className="text-sm text-gray-600 mb-1">Updates</p>
                <p className="font-semibold text-gray-900">Via Email</p>
              </div>
            </div>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Order Details
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
              {/* Shipping Address */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">
                    Shipping Address
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="font-medium text-gray-900">
                    {state.address.firstName} {state.address.lastName}
                  </p>
                  <p>{state.address.street}</p>
                  <p>
                    {state.address.city}, {state.address.state}{" "}
                    {state.address.zipCode}
                  </p>
                  <p>{state.address.country}</p>
                  <p className="text-blue-600 mt-2">{state.address.email}</p>
                  <p className="text-gray-600">{state.address.phone}</p>
                </div>
              </div>

              {/* Shipping Method */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">
                    Shipping Method
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Method</p>
                    <p className="font-medium text-gray-900">
                      {state.shippingMethod === "standard"
                        ? "Standard Delivery (₹100)"
                        : state.shippingMethod === "express"
                          ? "Express Delivery (₹300)"
                          : "Overnight Delivery (₹500)"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estimated Time</p>
                    <p className="font-medium text-gray-900">
                      {state.shippingMethod === "standard"
                        ? "3-5 Business Days"
                        : state.shippingMethod === "express"
                          ? "1-2 Business Days"
                          : "Next Day"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 mb-4">
                Price Breakdown
              </h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-medium">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">₹{state.shippingCost}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-600">
                  ₹{(total + state.shippingCost).toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/")}
              className="px-8 py-3 border-2 border-gray-300 text-gray-900 rounded-lg hover:border-gray-400 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Continue Shopping
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/order-tracking/${orderId}`)}
              className="ml-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              Track Order
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Support Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center text-sm text-gray-600"
          >
            <p>
              Need help? Contact us at{" "}
              <span className="font-semibold text-blue-600">
                support@perfume.com
              </span>{" "}
              or call{" "}
              <span className="font-semibold text-blue-600">
                +91 98765 43210
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
