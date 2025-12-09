"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  type: "rent" | "buy";
  size: string;
  color: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cartData.length === 0) {
      router.push("/cart");
      return;
    }
    setCart(cartData);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
        }),
      });

      if (response.ok) {
        localStorage.removeItem("cart");
        router.push("/checkout/success");
      } else {
        alert("Order failed. Please try again.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Order failed. Please try again.");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h1 className="text-5xl md:text-6xl mb-12 tracking-normal">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Shipping Information */}
          <div className="lg:col-span-2 space-y-8">
            <div className="border-2 border-black p-6 md:p-8 bg-white">
              <h2 className="text-2xl mb-6 tracking-normal">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) =>
                      setFormData({ ...formData, zip: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="border-2 border-black p-6 md:p-8 bg-white">
              <h2 className="text-2xl mb-6 tracking-normal">Payment Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, cardNumber: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expiryDate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) =>
                        setFormData({ ...formData, cvv: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border-2 border-black p-6 sticky top-4 bg-white">
              <h2 className="text-2xl mb-6 tracking-normal">Order Summary</h2>
              <div className="space-y-2 mb-6">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-xs md:text-sm">
                    <span className="truncate">{item.name}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-black pt-4 space-y-4 mb-8 pb-8">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${(total * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl pt-4 border-t-2 border-black">
                  <span>Total</span>
                  <span className="text-primary">${(total * 1.08).toFixed(2)}</span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-black hover:bg-primary text-white font-semibold py-4 px-6 tracking-normal text-sm transition-colors border-2 border-black"
              >
                Place Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

