"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

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
  stockCount: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [purchaseType, setPurchaseType] = useState<"rent" | "buy">("buy");
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
      if (data.sizes.length > 0) setSelectedSize(data.sizes[0]);
      if (data.colors.length > 0) setSelectedColor(data.colors[0]);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!product || !selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: purchaseType === "buy" ? product.price : product.rentPrice,
      type: purchaseType,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0],
    };

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
    router.push("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-2xl">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Images */}
          <div className="flex flex-col">
            <div className="w-full mb-6 flex items-center justify-center bg-gray-50" style={{ minHeight: '500px', maxHeight: '700px' }}>
              <img
                src={product.images[selectedImage] || product.images[0] || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-full object-contain"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between cursor-pointer">
                  <h3 className="text-sm font-semibold tracking-wide uppercase">SHOWN WITH</h3>
                  <span className="text-sm">↑</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {product.images.slice(0, 3).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative aspect-square border-2 transition-colors overflow-hidden ${
                        selectedImage === idx ? "border-primary" : "border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl mb-2 tracking-normal font-bold">{product.name}</h1>
            {product.category && (
              <p className="text-sm text-gray-600 mb-6">{product.category}</p>
            )}

            {/* Pricing Section */}
            <div className="mb-8">
              <p className="text-sm font-medium mb-4">STARTING AT:</p>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-semibold mb-1">
                    RENT: ${product.rentPrice.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600">Rental ensemble includes coat, pant, shirt, tie, vest, and basic jewelry.</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold mb-1">
                    BUY: ${product.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600">Includes coat and pant only.</p>
                </div>
              </div>
            </div>

            {/* Purchase Type Toggle */}
            <div className="mb-8">
              <label className="block text-sm mb-4 tracking-normal font-medium">
                Purchase Type
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setPurchaseType("buy")}
                  className={`px-8 py-3 text-sm tracking-normal transition-colors border-2 ${
                    purchaseType === "buy"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-black border-black hover:border-primary"
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setPurchaseType("rent")}
                  className={`px-8 py-3 text-sm tracking-normal transition-colors border-2 ${
                    purchaseType === "rent"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-black border-black hover:border-primary"
                  }`}
                >
                  Rent
                </button>
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm mb-4 tracking-normal font-medium">Size</label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 text-sm tracking-normal border-2 transition-colors ${
                        selectedSize === size
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-black border-black hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm mb-4 tracking-normal font-medium">Color</label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 text-sm tracking-normal border-2 transition-colors ${
                        selectedColor === color
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-black border-black hover:border-primary"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-8">
              {product.inStock ? (
                <p className="text-primary font-medium text-sm tracking-normal">
                  ✓ In Stock ({product.stockCount} available)
                </p>
              ) : (
                <p className="text-primary font-medium text-sm tracking-normal">Out of Stock</p>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={addToCart}
              disabled={!product.inStock || !selectedSize || !selectedColor}
              className="w-full bg-black hover:bg-primary disabled:bg-black/30 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 tracking-normal text-sm transition-colors border-2 border-black disabled:border-black/30"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

