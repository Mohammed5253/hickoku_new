"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { useContext } from "react";
import { CheckoutContext } from "../../context/CheckoutContext";
import { Mail, Lock, UserPlus } from "lucide-react";

export function AuthSelection() {
  const context = useContext(CheckoutContext);
  if (!context) return null;

  const { state, dispatch } = context;
  const [guestEmail, setGuestEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleLogin = () => {
    dispatch({ type: "SET_USER_TYPE", payload: "login" });
    dispatch({ type: "SET_STEP", payload: "address" });
  };

  const handleRegister = () => {
    dispatch({ type: "SET_USER_TYPE", payload: "register" });
    dispatch({ type: "SET_STEP", payload: "address" });
  };

  const handleGuestContinue = () => {
    if (!guestEmail || !guestEmail.includes("@")) {
      setEmailError("Please enter a valid email address");
      return;
    }
    dispatch({
      type: "UPDATE_ADDRESS",
      payload: { email: guestEmail },
    });
    dispatch({ type: "SET_USER_TYPE", payload: "guest" });
    dispatch({ type: "SET_STEP", payload: "address" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Welcome to Checkout</h1>
        <p className="text-gray-600">Choose how you'd like to continue</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Login Option */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          className="group p-8 border-2 border-gray-200 rounded-xl hover:border-gray-900 hover:bg-gray-50 transition-all text-left"
        >
          <div className="mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Login</h3>
          <p className="text-sm text-gray-600">
            Sign in to your account to access saved addresses and faster
            checkout
          </p>
        </motion.button>

        {/* Register Option */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRegister}
          className="group p-8 border-2 border-gray-200 rounded-xl hover:border-gray-900 hover:bg-gray-50 transition-all text-left"
        >
          <div className="mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
              <UserPlus className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Create Account</h3>
          <p className="text-sm text-gray-600">
            New to us? Create an account for a personalized shopping experience
          </p>
        </motion.button>

        {/* Guest Option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-8 border-2 border-gray-200 rounded-xl bg-gray-50"
        >
          <div className="mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-4">Guest Checkout</h3>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={guestEmail}
              onChange={(e) => {
                setGuestEmail(e.target.value);
                setEmailError("");
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
            />
            {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGuestContinue}
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Continue as Guest
            </motion.button>
          </div>
        </motion.div>
      </div>

      <p className="text-center text-sm text-gray-600 mt-8">
        By proceeding, you agree to our Terms of Service and Privacy Policy
      </p>
    </motion.div>
  );
}
