"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Mail, LogIn, ArrowRight } from "lucide-react";
import { Header } from "../../components/Header";

export default function AuthPage() {
  const router = useRouter();
  const [guestEmail, setGuestEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Check if user already has userType and skip auth page
  useEffect(() => {
    const userType = sessionStorage.getItem("userType");
    if (userType) {
      router.push("/checkout");
    }
  }, [router]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGuestContinue = () => {
    if (!guestEmail.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!validateEmail(guestEmail)) {
      setEmailError("Please enter a valid email");
      return;
    }

    sessionStorage.setItem("guestEmail", guestEmail);
    sessionStorage.setItem("userType", "guest");
    router.push("/checkout");
  };

  const handleSignIn = () => {
    sessionStorage.setItem("userType", "login");
    router.push("/auth/login");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-20">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
              Checkout
            </h1>
            <p className="text-xl text-gray-600">
              Choose your preferred way to complete your order
            </p>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
            {/* Sign In Option */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={handleSignIn}
                className="group w-full h-full p-8 border-2 border-gray-300 rounded-2xl hover:border-blue-600 hover:bg-blue-50 transition-all"
              >
                <div className="flex flex-col items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:shadow-lg transition-all">
                    <LogIn className="w-10 h-10 text-blue-600" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Sign In
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Use your existing account for faster checkout and order
                      tracking
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-blue-600 group-hover:gap-3 transition-all font-semibold">
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            </motion.div> */}

            {/* Guest Checkout Option */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-8 border-2 border-gray-300 rounded-2xl hover:border-purple-600 hover:bg-purple-50 transition-all"
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-10 h-10 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Guest Checkout
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Quick & easy checkout
                    </p>
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={guestEmail}
                      onChange={(e) => {
                        setGuestEmail(e.target.value);
                        setEmailError("");
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleGuestContinue();
                      }}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                  </div>
                  {emailError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm font-medium"
                    >
                      {emailError}
                    </motion.p>
                  )}
                </div>

                {/* Continue Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGuestContinue}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  Continue to Checkout
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 pt-12 border-t border-gray-200"
          >
            <h3 className="text-center text-gray-700 font-semibold mb-8">
              Why sign in?
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { text: "✓ Save addresses", color: "bg-blue-50" },
                { text: "✓ Order tracking", color: "bg-purple-50" },
                { text: "✓ Order history", color: "bg-pink-50" },
                { text: "✓ Faster checkout", color: "bg-indigo-50" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className={`p-4 ${item.color} rounded-lg text-center`}
                >
                  <p className="text-gray-800 font-medium text-sm">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
