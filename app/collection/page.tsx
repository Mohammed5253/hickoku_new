"use client";

import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Header } from "../components/Header";

interface Product {
  productId: string;
  name: string;
  description: string;
  highlight: string;
  category: string;
  badge: string | null;
  images: string[];
  variant: {
    sku: string;
    size: string;
    price: number;
    stockQuantity: number;
    stockStatus: string;
  };
}

// Color schemes for products (based on category and index)
const colorSchemes = [
  { bgColor: "#f5e6e8", textColor: "#8b4f5e" }, // Pink/Rose
  { bgColor: "#1a1a1a", textColor: "#D4AF37" }, // Dark/Gold
  { bgColor: "#e8d5cf", textColor: "#6b4e42" }, // Beige/Brown
  { bgColor: "#d4752e", textColor: "#ffffff" }, // Orange/White
  { bgColor: "#5a1a1a", textColor: "#D4AF37" }, // Burgundy/Gold
  { bgColor: "#1a3a2e", textColor: "#D4AF37" }, // Dark Green/Gold
];

export default function CollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products-enhanced');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <Link href="/">
                <motion.button
                  whileHover={{ x: -5 }}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm">Back</span>
                </motion.button>
              </Link>
              {/* <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm hover:border-gray-900 transition-colors"
                >
                  <span>Filters</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm hover:border-gray-900 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Sort By</span>
                </motion.button>
              </div> */}
            </div>

            <div className="flex items-start justify-between">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl mb-2"
                >
                  COLLECTION
                </motion.h1>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading products...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">Error: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {products.map((product, index) => {
                const colorScheme = colorSchemes[index % colorSchemes.length];
                const priceInRupees = (product.variant.price / 100).toFixed(0);

                return (
                  <Link key={product.productId} href={`/product/${product.productId}`}>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                      className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                      {/* Split layout: Image on left, Color on right */}
                      <div className="flex h-72">
                        {/* Left - Background Image */}
                        <div className="w-1/2 relative overflow-hidden">
                          <motion.img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          />
                          <div className="absolute inset-0 bg-black/20" />
                        </div>

                        {/* Right - Solid Color with Text */}
                        <div
                          className="w-1/2 p-6 flex flex-col justify-between"
                          style={{ backgroundColor: colorScheme.bgColor }}
                        >
                          <div className="space-y-2">
                            <motion.h3
                              initial={{ opacity: 0, y: -10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4 }}
                              className="text-2xl tracking-wide"
                              style={{ color: colorScheme.textColor }}
                            >
                              {product.name}
                            </motion.h3>

                            <motion.p
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                              className="text-base font-semibold line-clamp-4 leading-relaxed italic"
                              style={{ color: colorScheme.textColor }}
                            >
                              {product.highlight}
                            </motion.p>
                          </div>

                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="text-2xl font-bold whitespace-nowrap"
                            style={{ color: colorScheme.textColor }}
                          >
                            Rs. {priceInRupees}
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
