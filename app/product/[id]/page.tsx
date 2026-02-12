"use client";

import { motion } from "motion/react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Header } from "../../components/Header";
import { useCart } from "../../hooks/useCart";

const productImages = [
  "https://images.unsplash.com/photo-1619007556336-4d99b008471e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmdW1lJTIwaGVybyUyMGJhbm5lciUyMGVsZWdhbnR8ZW58MXx8fHwxNzcwNTQxNTI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1740427326116-61306495584c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGZsb3dlcnMlMjBwZXJmdW1lJTIwZnJlc2h8ZW58MXx8fHwxNzcwNTQxNTI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1761937841527-fac9281e53fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwZmxvcmFsJTIwcGVyZnVtZSUyMGZlbWluaW5lfGVufDF8fHx8MTc3MDU0MTUyOHww&ixlib=rb-4.1.0&q=80&w=1080",
];

const sizes = ["30 ml", "50 ml", "80 ml", "100 ml"];

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("50 ml");
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart } = useCart();

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev - 1 < 0 ? productImages.length - 1 : prev - 1,
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Back button */}
        <div className="py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/collection">
              <motion.button
                whileHover={{ x: -5 }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Collection</span>
              </motion.button>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative aspect-[3/4] bg-white rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={productImages[currentImage]}
                  alt="Product"
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </motion.div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setCurrentImage(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImage === index
                        ? "border-gray-900"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Right - Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Title & Price */}
              <div>
                <h1 className="text-3xl mb-2">
                  Hicksoku Velour - The Warmth of Pure Indulgence
                </h1>
                <p className="text-2xl text-gray-900">Rs. 3690</p>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-sm mb-3">Size</h3>
                <div className="grid grid-cols-4 gap-3">
                  {sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded-lg border-2 transition-all text-sm ${
                        selectedSize === size
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-2 text-sm text-gray-600">
                <p>Tax Included</p>
                <p>100% Authentic Products</p>
                <p>Free Delivery or 7 to 8 Days</p>
                <p>Earn reward points on every purchase</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const productName =
                      "Hicksoku Velour - The Warmth of Pure Indulgence";
                    const productPrice = "3690";
                    const productImage = productImages[currentImage];
                    const sku = `HICK-${String(id).padStart(3, "0")}-${selectedSize.split(" ")[0]}`;

                    addToCart({
                      id: Number(id),
                      name: `${productName} (${selectedSize})`,
                      price: productPrice,
                      image: productImage,
                      sku: sku,
                    });

                    toast.success("Added to cart!", {
                      description: `${selectedSize} size selected`,
                    });
                  }}
                  className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ADD TO CART
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    toast.success("Opening WhatsApp...", {
                      description:
                        "Connect with us for personalized assistance",
                    });
                  }}
                  className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  CONNECT TO WHATSAPP
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="pt-6">
                <div className="flex gap-8 border-b border-gray-200 mb-6">
                  {["DESCRIPTION", "DELIVERY & RETURNS", "CONTACTS"].map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`pb-3 text-sm tracking-wider relative ${
                          activeTab === tab.toLowerCase()
                            ? "text-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab}
                        {activeTab === tab.toLowerCase() && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                          />
                        )}
                      </button>
                    ),
                  )}
                </div>

                <div className="text-sm text-gray-600 space-y-3">
                  {activeTab === "description" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2"
                    >
                      <p className="tracking-wide">
                        <span className="text-gray-900">
                          Catalog Article Number:{" "}
                        </span>
                        Medium Size
                      </p>
                      <p className="tracking-wide">
                        <span className="text-gray-900">
                          Soft letting style
                        </span>
                      </p>
                      <p>Carry in the hand or over on the shoulder</p>
                      <p>Golden colored metal details</p>
                      <p>Leather belt and belt clasp</p>
                      <p>Metal HK engraved buckle</p>
                      <p>Lining: 100% cotton canvas</p>
                      <p>Upper: 100% leather</p>
                      <p>Luxurious with velour card pocket</p>
                      <p className="mt-2">
                        <span className="text-gray-900">Gold hardware</span>
                      </p>
                      <p>
                        <span className="text-gray-900">Dimensions: </span>45 x
                        39 x 16 cm
                      </p>
                      <p>Volume: Accommodates 50 A4 paper sheets</p>
                      <p>
                        <span className="text-gray-900">Item: </span>
                        8809636HWLINE
                      </p>
                    </motion.div>
                  )}
                  {activeTab === "delivery & returns" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p>Free delivery on orders over Rs. 5000</p>
                      <p className="mt-2">
                        Standard delivery takes 7-8 business days
                      </p>
                      <p className="mt-2">Easy returns within 30 days</p>
                    </motion.div>
                  )}
                  {activeTab === "contacts" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p>For any queries, please contact us at:</p>
                      <p className="mt-2">Email: support@hkperfumes.com</p>
                      <p>Phone: +92 300 1234567</p>
                      <p>WhatsApp: +92 300 1234567</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
