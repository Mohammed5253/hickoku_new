"use client";

import { motion } from "motion/react";
import { useContext } from "react";
import { CheckoutContext } from "../../context/CheckoutContext";
import { Truck, Clock, Zap, ArrowRight } from "lucide-react";

interface ShippingOption {
  id: "standard" | "express" | "overnight";
  label: string;
  description: string;
  icon: React.ReactNode;
  cost: number;
  days: string;
}

export function ShippingMethod() {
  const context = useContext(CheckoutContext);
  if (!context) return null;

  const { state, dispatch } = context;

  const shippingOptions: ShippingOption[] = [
    {
      id: "standard",
      label: "Standard Delivery",
      description: "Reliable delivery to your doorstep",
      icon: <Truck className="w-6 h-6" />,
      cost: 100,
      days: "5-7 business days",
    },
    {
      id: "express",
      label: "Express Delivery",
      description: "Fast and dependable service",
      icon: <Clock className="w-6 h-6" />,
      cost: 250,
      days: "2-3 business days",
    },
    {
      id: "overnight",
      label: "Overnight Delivery",
      description: "Get your order the next business day",
      icon: <Zap className="w-6 h-6" />,
      cost: 500,
      days: "Next business day",
    },
  ];

  const handleSelectShipping = (
    method: "standard" | "express" | "overnight",
    cost: number,
  ) => {
    dispatch({
      type: "SET_SHIPPING_METHOD",
      payload: { method, cost },
    });
  };

  const handleContinue = () => {
    if (state.shippingMethod) {
      dispatch({ type: "MARK_STEP_COMPLETED", payload: "shipping" });
      dispatch({ type: "SET_STEP", payload: "payment" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Shipping Method</h2>
        <p className="text-gray-600">
          Choose how you'd like your order to be delivered
        </p>
      </div>

      <div className="space-y-4">
        {shippingOptions.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectShipping(option.id, option.cost)}
            className={`w-full p-6 border-2 rounded-xl transition-all text-left ${
              state.shippingMethod === option.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-6">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  state.shippingMethod === option.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {option.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{option.label}</h3>
                  <span className="text-2xl font-bold">₹{option.cost}</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {option.description}
                </p>
                <p className="text-sm font-medium text-gray-700">
                  Estimated delivery: {option.days}
                </p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  state.shippingMethod === option.id
                    ? "border-blue-600 bg-blue-600"
                    : "border-gray-300"
                }`}
              >
                {state.shippingMethod === option.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Summary */}
      {state.shippingMethod && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200"
        >
          <p className="text-sm text-gray-600 mb-2">Shipping Cost</p>
          <p className="text-2xl font-bold">₹{state.shippingCost}</p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => dispatch({ type: "SET_STEP", payload: "address" })}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          disabled={!state.shippingMethod}
          className="ml-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
        >
          Continue to Payment <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
