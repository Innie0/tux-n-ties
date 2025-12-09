"use client";

import { useState } from "react";
import Link from "next/link";

export default function ScanPage() {
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode || barcode.trim() === "") {
      alert("Please enter or scan a barcode");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/products/scan-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: barcode.trim(), quantity: 1 }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setBarcode("");
      } else {
        setError(data.error || "Failed to scan out product");
      }
    } catch (error) {
      console.error("Error scanning out:", error);
      setError("Failed to scan out product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-primary hover:underline text-sm mb-4 inline-block">
            ← Back to Admin
          </Link>
          <h1 className="text-4xl font-semibold mb-2">Scan Out</h1>
          <p className="text-gray-600">Scan items sold in-store</p>
        </div>

        {/* Scan Form */}
        <form onSubmit={handleScan} className="space-y-6">
          <div>
            <label className="block text-lg font-medium mb-3">Barcode</label>
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Scan or enter barcode..."
              className="w-full px-6 py-6 border-2 border-black focus:border-primary focus:outline-none font-medium text-2xl text-center"
              autoFocus
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !barcode}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-6 text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Scan Out"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 p-6 border-2 border-red-500 bg-red-50 rounded">
            <p className="text-red-700 font-medium text-lg">{error}</p>
          </div>
        )}

        {/* Success */}
        {result && (
          <div className="mt-6 p-6 border-2 border-green-500 bg-green-50 rounded">
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-3">✓</span>
              <h3 className="text-2xl font-bold text-green-800">Success!</h3>
            </div>
            <div className="space-y-3 text-base mb-6">
              <p className="font-semibold text-xl">{result.product.name}</p>
              <div className="border-t border-green-300 pt-3 space-y-2">
                <p><strong>Barcode:</strong> {result.product.barcode}</p>
                <p><strong>Previous Stock:</strong> {result.product.previousStock}</p>
                <p className="text-xl">
                  <strong>Current Stock:</strong>{" "}
                  <span className={result.product.currentStock === 0 ? "text-red-600" : "text-green-600"}>
                    {result.product.currentStock}
                  </span>
                </p>
                {!result.product.inStock && (
                  <p className="text-red-600 font-semibold">⚠ Now Out of Stock</p>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                setResult(null);
                setBarcode("");
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg"
            >
              Scan Another Item
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-6 bg-gray-50 border border-gray-300 rounded">
          <h3 className="font-semibold mb-3 text-lg">Quick Guide</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Scan barcode with USB scanner</li>
            <li>• Or manually type the barcode</li>
            <li>• Stock updates automatically</li>
            <li>• Website syncs in real-time</li>
          </ul>
        </div>
      </div>
    </div>
  );
}



