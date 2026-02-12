"use client";

import { motion } from "motion/react";
import {
  CheckCircle,
  Download,
  Home,
  Package,
  Truck,
  Clock,
  Star,
} from "lucide-react";
import { useLocale } from "../../context/LocaleContext";

export function OrderConfirmation() {
  const { t } = useLocale();
  const orderNumber = `#HK${Date.now().toString().slice(-8)}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="text-center mb-12"
        >
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl relative">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-green-400/20"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <CheckCircle className="w-20 h-20 text-white" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              {t("orderConfirmation.confirmed")}
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              {t("orderConfirmation.thank_you")}
            </p>
            <p className="text-gray-500 text-lg">
              {t("orderConfirmation.orderReceived")}
            </p>
          </motion.div>
        </motion.div>

        {/* Order Number Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-8 bg-white border-2 border-green-200 rounded-2xl mb-8 text-center shadow-lg"
        >
          <p className="text-sm text-gray-600 font-semibold mb-2 uppercase tracking-wide">
            {t("orderConfirmation.orderNumber")}
          </p>
          <p className="text-4xl font-bold text-gray-900 font-mono mb-4">
            {orderNumber}
          </p>
          <p className="text-gray-600">{t("orderConfirmation.checkEmail")}</p>
        </motion.div>

        {/* Timeline / Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              icon: Package,
              title: "Order Placed",
              description: "We're preparing your order",
              status: "complete",
              color: "green",
            },
            {
              icon: Truck,
              title: "In Transit",
              description: "Tracking info sent to email",
              status: "pending",
              color: "blue",
            },
            {
              icon: Home,
              title: "Delivered",
              description: "Arriving at your doorstep",
              status: "pending",
              color: "gray",
            },
          ].map((step, i) => {
            const isComplete = step.status === "complete";
            const colorClass =
              step.color === "green"
                ? "bg-green-100 text-green-600"
                : step.color === "blue"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  isComplete
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200 opacity-75"
                }`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${colorClass}`}
                >
                  <step.icon className="w-7 h-7" />
                </motion.div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* What's Next Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-8 bg-white border border-gray-200 rounded-2xl mb-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-600" />
            What's Next?
          </h2>
          <ul className="space-y-4">
            {[
              {
                step: 1,
                title: "Order Confirmation",
                description:
                  "Check your email for order details and confirmation number",
              },
              {
                step: 2,
                title: "Preparation",
                description:
                  "We're carefully packing your order with care and attention to detail",
              },
              {
                step: 3,
                title: "Dispatch",
                description:
                  "Your order will be dispatched with a tracking number",
              },
              {
                step: 4,
                title: "Delivery",
                description:
                  "Track your package and receive it at your doorstep",
              },
            ].map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Estimated Delivery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-600 font-semibold mb-2 uppercase">
              Estimated Delivery
            </p>
            <p className="text-3xl font-bold text-blue-900 mb-1">2-3 Days</p>
            <p className="text-sm text-blue-700">From dispatch date</p>
          </div>
          <div className="p-6 bg-purple-50 border border-purple-200 rounded-xl">
            <p className="text-sm text-purple-600 font-semibold mb-2 uppercase">
              Secure Packaging
            </p>
            <p className="text-lg text-purple-900">
              Your perfume is carefully packaged to ensure freshness
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all font-semibold flex items-center justify-center gap-2 text-gray-900"
          >
            <Download className="w-5 h-5" />
            Download Invoice
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/")}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg"
          >
            <Home className="w-5 h-5" />
            Continue Shopping
          </motion.button>
        </motion.div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="w-5 h-5 text-yellow-500" />
            <p className="font-semibold text-gray-900">Need Help?</p>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-gray-700">
            Contact us at{" "}
            <a
              href="mailto:support@hicksoku.com"
              className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
            >
              support@hicksoku.com
            </a>{" "}
            or call{" "}
            <a
              href="tel:+919876543210"
              className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
            >
              +91 98765 43210
            </a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
