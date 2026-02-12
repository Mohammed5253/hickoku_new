"use client";

import { Search, ShoppingBag, Heart, User, Menu } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "../hooks/useCart";
import { useLocale } from "../context/LocaleContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { openCart, getCartItemCount } = useCart();
  const { t } = useLocale();
  const cartCount = getCartItemCount();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20">
        <div className="flex items-center justify-between h-full">
          {/* Left - Menu */}
          <div className="flex items-center gap-6 flex-1">
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                {t("navigation.new")}
              </Link>
              <Link
                href="/collection"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                {t("navigation.forHer")}
              </Link>
              <Link
                href="/collection"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                {t("navigation.forHim")}
              </Link>
              <Link
                href="/collection"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                {t("navigation.collections")}
              </Link>
            </nav>
          </div>

          {/* Center - Logo */}
          <Link href="/" className="flex-shrink-0 mx-auto">
            <motion.div
              // whileHover={{ scale: 1.08 }}
              className="flex items-center justify-center px-6 rounded-lg bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors"
            >
              <img
                src={"/images/logo.png"}
                alt="HK Logo"
                className="h-20 object-contain"
              />
            </motion.div>
          </Link>

          {/* Right - Actions */}
          <div className="flex items-center justify-end gap-4 flex-1">
            {isSearchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="hidden sm:block"
              >
                <input
                  type="text"
                  placeholder={t("navigation.search")}
                  className="w-full px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
              </motion.div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <Heart className="w-5 h-5" />
            </button>
            <LanguageSwitcher />
            <motion.button
              onClick={openCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
