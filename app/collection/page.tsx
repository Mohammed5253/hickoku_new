"use client";

import { motion } from "motion/react";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Header } from "../components/Header";

interface Collection {
  id: number;
  name: string;
  subtitle: string;
  price: string;
  image: string;
  bgColor: string;
  textColor: string;
}

const collections: Collection[] = [
  {
    id: 1,
    name: "Zafera",
    subtitle: "Hicksoku Luminosa - A Radiant Whisper of Elegance",
    price: "Rs. 2500",
    image: "/hickoku-assets/zafera-product.png",
    bgColor: "#1a3a2e",
    textColor: "#D4AF37",
  },
  {
    id: 3,
    name: "Midnight Agar",
    subtitle: "Hicksoku Pour Répète - The Bloom of Pure Luxury",
    price: "Rs. 3500",
    image: "/hickoku-assets/midnight_agar-product.png",
    bgColor: "#1a1a1a",
    textColor: "#D4AF37",
  },
  {
    id: 4,
    name: "Silk Musk",
    subtitle: "Hicksoku Entroar - A Fiery Expression of Passion",
    price: "Rs. 2800",
    image: "/hickoku-assets/silk_musk-product.png",
    bgColor: "#c7d3be",
    textColor: "#2c4a3e",
  },
  {
    id: 5,
    name: "Raafa",
    subtitle: "Hicksoku Etan - The Essence of Fresh Sophistication",
    price: "Rs. 2600",
    image: "/hickoku-assets/raafa-product.png",
    bgColor: "#d4752e",
    textColor: "#ffffff",
  },
  {
    id: 6,
    name: "Velvira",
    subtitle: "Hicksoku Velour - The Warmth of Pure Indulgence",
    price: "Rs. 3200",
    image: "/hickoku-assets/velvira-product.png",
    bgColor: "#5a2a5a",
    textColor: "#D4AF37",
  },
  {
    id: 7,
    name: "Lumiflora",
    subtitle: "Hicksoku Azone - A Breath of Unrivaled Elegance",
    price: "Rs. 2900",
    image: "/hickoku-assets/lumiflora-product.png",
    bgColor: "#f5e6e8",
    textColor: "#8b4f5e",
  },
  {
    id: 8,
    name: "Nufra",
    subtitle: "Hicksoku Rhoum - A Bold Aura of Passion & Power",
    price: "Rs. 3100",
    image: "/hickoku-assets/nufra-product.png",
    bgColor: "#e8d5cf",
    textColor: "#6b4e42",
  },
  {
    id: 9,
    name: "Roselia",
    subtitle: "Hicksoku Centrale - The Scent of a Midnight Dream",
    price: "Rs. 3300",
    image: "/hickoku-assets/roselia-product.png",
    bgColor: "#5a1a1a",
    textColor: "#D4AF37",
  },
];

export default function CollectionPage() {
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");

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
            {collections.map((collection, index) => (
              <Link key={collection.id} href={`/product/${collection.id}`}>
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
                        src={collection.image}
                        alt={collection.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Right - Solid Color with Text */}
                    <div
                      className="w-1/2 p-6 flex flex-col justify-between"
                      style={{ backgroundColor: collection.bgColor }}
                    >
                      <div className="space-y-2">
                        <motion.h3
                          initial={{ opacity: 0, y: -10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          className="text-2xl tracking-wide"
                          style={{ color: collection.textColor }}
                        >
                          {collection.name}
                        </motion.h3>

                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="text-base font-semibold line-clamp-4 leading-relaxed italic"
                          style={{ color: collection.textColor }}
                        >
                          {collection.subtitle}
                        </motion.p>
                      </div>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="text-2xl font-bold whitespace-nowrap"
                        style={{ color: collection.textColor }}
                      >
                        {collection.price}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
