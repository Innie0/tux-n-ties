"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  type: "rent" | "buy";
  size: string;
  color: string;
  image: string;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(cartData);
  }, []);

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center py-20">
            <h1 className="text-4xl md:text-5xl mb-6 tracking-normal">Your Cart is Empty</h1>
            <p className="text-sm font-normal mb-12 text-black/70 leading-relaxed">
              Start shopping to add items to your cart
            </p>
            <button
              onClick={() => router.push("/inventory")}
              className="bg-black hover:bg-primary text-white font-semibold py-4 px-10 tracking-normal text-sm transition-colors border-2 border-black"
            >
              Browse Inventory
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h1 className="text-5xl md:text-6xl mb-12 tracking-normal">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="border-2 border-black p-6 flex flex-col md:flex-row gap-6 bg-white"
              >
                <div className="relative w-full md:w-32 h-32 flex-shrink-0 bg-black">
                  <Image
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-2 tracking-normal">{item.name}</h3>
                  <p className="text-sm font-medium mb-2 tracking-normal text-black/60">
                    {item.type === "buy" ? "Purchase" : "Rental"}
                  </p>
                  <p className="text-xs font-normal text-black/60 tracking-normal mb-4">
                    Size: {item.size} | Color: {item.color}
                  </p>
                  <p className="text-2xl text-primary">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col justify-between">
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-primary font-medium text-sm tracking-normal hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border-2 border-black p-6 sticky top-4 bg-white">
              <h2 className="text-2xl mb-6 tracking-normal">Order Summary</h2>
              <div className="space-y-4 mb-8 pb-8 border-b-2 border-black">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${(total * 0.08).toFixed(2)}</span>
                </div>
                <div className="pt-4 flex justify-between text-2xl font-black">
                  <span>Total</span>
                  <span className="text-primary">${(total * 1.08).toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-black hover:bg-primary text-white font-semibold py-4 px-6 tracking-normal text-sm transition-colors border-2 border-black"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

