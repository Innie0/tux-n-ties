"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/inventory", label: "Inventory" },
    { href: "/bookings", label: "Book Fitting" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <nav className="bg-white border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center h-12">
            <Image
              src="/Tux.png"
              alt="Tux N Ties Logo"
              width={150}
              height={48}
              className="h-auto w-auto object-contain"
              priority
            />
          </Link>
          <div className="hidden md:flex space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-normal transition-colors ${
                  pathname === link.href 
                    ? "text-primary border-b-2 border-primary pb-1" 
                    : "text-black hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-11 h-11 border-2 border-black rounded-full text-black hover:bg-black hover:text-white transition-colors"
              aria-label="Cart"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                {/* Handle */}
                <path
                  d="M3.5 5h2.2l1.2 9.5h9.4L18.5 9H9"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Basket outline */}
                <path
                  d="M8.5 9h10l-1.1 5.5H9.6L8.5 9Z"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Wheels */}
                <circle cx="10" cy="18.5" r="1.1" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="16" cy="18.5" r="1.1" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden"
              aria-label="Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden py-6 space-y-4 border-t-2 border-black">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block text-sm font-medium tracking-normal ${
                  pathname === link.href ? "text-primary" : "text-black hover:text-primary"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

