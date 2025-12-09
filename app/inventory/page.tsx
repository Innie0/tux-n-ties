"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rentPrice: number;
  images: string[];
  sizes: string[];
  colors: string[];
  category: string;
  inStock: boolean;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setProducts(data);
        setFilteredProducts(data);
      } else {
        console.error("Invalid data format:", data);
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    // Ensure products is an array before filtering
    if (!Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const categories = ["all", "Classic", "Modern", "Vintage"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h1 className="text-4xl md:text-5xl mb-12 tracking-normal font-semibold">SUITS & TUXEDOS</h1>

        {/* Search and Filter */}
        <div className="mb-12 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search tuxedos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-6 py-4 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-6 py-4 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm tracking-normal bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        {!Array.isArray(filteredProducts) || filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group bg-white hover:opacity-90 transition-opacity"
              >
                <div className="w-full bg-gray-100 mb-4 flex items-center justify-center border-2 border-black" style={{ minHeight: '500px', maxHeight: '700px' }}>
                  <img
                    src={product.images[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg md:text-xl mb-3 tracking-normal font-medium">
                    {product.name}
                  </h3>
                  <div className="text-sm md:text-base space-y-1">
                    <p className="text-gray-700">
                      <span className="font-medium">STARTING AT:</span>{" "}
                      <span className="font-semibold">RENT: ${product.rentPrice.toFixed(2)}</span>{" "}
                      <span className="font-semibold">BUY: ${product.price.toFixed(2)}</span>
                    </p>
                  </div>
                  {!product.inStock && (
                    <p className="text-primary font-medium text-sm mt-2">Out of Stock</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

