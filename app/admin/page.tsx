"use client";

import { useState, useEffect } from "react";
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
  barcode: string | null;
  inStock: boolean;
  stockCount: number;
}

interface Booking {
  id: string;
  date: string;
  time: string;
  status: string;
  notes: string | null;
  user: {
    name: string | null;
    email: string;
  };
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"products" | "bookings" | "scanout">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCsvUpload, setShowCsvUpload] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  
  // Scan out state
  const [scanBarcode, setScanBarcode] = useState("");
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    rentPrice: "",
    images: "",
    sizes: "",
    colors: "",
    category: "Classic",
    barcode: "",
    inStock: true,
    stockCount: "1",
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "products") {
        const res = await fetch("/api/products");
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Invalid products data format in admin:", data);
          setProducts([]);
        }
      } else {
        const res = await fetch("/api/bookings");
        const data = await res.json();

        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          console.error("Invalid bookings data format in admin:", data);
          setBookings([]);
        }
      }
    } catch (error) {
      console.error("Error fetching data in admin:", error);
      if (activeTab === "products") {
        setProducts([]);
      } else {
        setBookings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Basic validation
      if (!productForm.name) {
        alert("Please enter a product name");
        return;
      }
      if (!productForm.price) {
        alert("Please enter a price");
        return;
      }
      if (!productForm.rentPrice) {
        alert("Please enter a rent price");
        return;
      }

      // Create clean product data
      const productData = {
        name: productForm.name,
        description: productForm.description || "",
        price: productForm.price,
        rentPrice: productForm.rentPrice,
        images: productForm.images || "",
        sizes: productForm.sizes || "",
        colors: productForm.colors || "",
        category: productForm.category || "Classic",
        barcode: productForm.barcode || "",
        inStock: productForm.inStock,
        stockCount: productForm.stockCount || "1",
      };

      console.log("=== SENDING TO API ===", productData);

      let response;
      if (editingProduct) {
        response = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      } else {
        response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error occurred" }));
        alert(`Failed to save product: ${errorData.error || "Unknown error"}`);
        console.error("API Error:", errorData);
        return;
      }

      // Success - close form and refresh
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({
        name: "",
        description: "",
        price: "",
        rentPrice: "",
        images: "",
        sizes: "",
        colors: "",
        category: "Classic",
        barcode: "",
        inStock: true,
        stockCount: "1",
      });
      fetchData();
      alert(editingProduct ? "Product updated successfully!" : "Product added successfully!");
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please check the console for details.");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      rentPrice: product.rentPrice.toString(),
      images: product.images.join(", "),
      sizes: product.sizes.join(", "),
      colors: product.colors.join(", "),
      category: product.category,
      barcode: product.barcode || "",
      inStock: product.inStock,
      stockCount: product.stockCount.toString(),
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchData();
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking");
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking");
    }
  };

  const handleCsvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      alert("Please select a CSV file");
      return;
    }

    setUploading(true);
    setImportResults(null);

    try {
      const formData = new FormData();
      formData.append("file", csvFile);

      const response = await fetch("/api/products/bulk-import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setImportResults(data.results);
        if (data.results.success > 0) {
          fetchData(); // Refresh products list
        }
      } else {
        alert(`Import failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Error uploading CSV:", error);
      alert("Failed to upload CSV file");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        alert("Please select a CSV file");
        return;
      }
      setCsvFile(file);
      setImportResults(null);
    }
  };

  const handleScanOut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanBarcode || scanBarcode.trim() === "") {
      alert("Please enter or scan a barcode");
      return;
    }

    setScanLoading(true);
    setScanError(null);

    try {
      const response = await fetch("/api/products/scan-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: scanBarcode.trim(), quantity: 1 }),
      });

      const data = await response.json();

      if (response.ok) {
        setScanResult(data);
        setScanBarcode("");
        // Refresh products list if on products tab
        if (activeTab === "products") {
          fetchData();
        }
      } else {
        setScanError(data.error || "Failed to scan out product");
      }
    } catch (error) {
      console.error("Error scanning out:", error);
      setScanError("Failed to scan out product. Please try again.");
    } finally {
      setScanLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h1 className="text-5xl md:text-6xl mb-12 tracking-normal">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("products")}
                className={`py-4 px-1 border-b-2 font-semibold text-sm tracking-normal ${
                  activeTab === "products"
                    ? "border-primary text-primary"
                    : "border-transparent text-black/60 hover:text-black"
                }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`py-4 px-1 border-b-2 font-medium text-sm md:text-base ${
                activeTab === "bookings"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab("scanout")}
              className={`py-4 px-1 border-b-2 font-semibold text-sm tracking-normal ${
                activeTab === "scanout"
                  ? "border-primary text-primary"
                  : "border-transparent text-black/60 hover:text-black"
              }`}
            >
              Scan Out
            </button>
          </div>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <div className="mb-6 flex gap-4">
              <button
                onClick={() => {
                  setShowProductForm(true);
                  setEditingProduct(null);
                  setProductForm({
                    name: "",
                    description: "",
                    price: "",
                    rentPrice: "",
                    images: "",
                    sizes: "",
                    colors: "",
                    category: "Classic",
                    barcode: "",
                    inStock: true,
                    stockCount: "1",
                  });
                }}
                className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm md:text-base"
              >
                Add New Product
              </button>
              <button
                onClick={() => {
                  setShowCsvUpload(true);
                  setCsvFile(null);
                  setImportResults(null);
                }}
                className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm md:text-base"
              >
                Bulk Import CSV
              </button>
            </div>

            {/* CSV Upload Modal */}
            {showCsvUpload && (
              <div className="border-2 border-black p-8 mb-8 bg-white">
                <h2 className="text-xl md:text-2xl mb-4">Bulk Import Products from CSV</h2>
                <div className="mb-4 p-4 bg-gray-50 border border-gray-300">
                  <p className="text-sm font-medium mb-2">CSV Format:</p>
                  <p className="text-xs text-gray-600 mb-2">
                    Required columns: <strong>name, price, rentPrice</strong>
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    Optional columns: <strong>description, images, sizes, colors, category, barcode, inStock, stockCount</strong>
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    Separate multiple values with commas (e.g., images: "url1, url2" or sizes: "38, 40, 42")
                  </p>
                  <a
                    href="/products-template.csv"
                    download
                    className="text-primary hover:underline text-xs font-medium"
                  >
                    📥 Download CSV Template
                  </a>
                </div>
                <form onSubmit={handleCsvUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select CSV File</label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                      required
                    />
                    {csvFile && (
                      <p className="text-sm text-gray-600 mt-2">Selected: {csvFile.name}</p>
                    )}
                  </div>
                  {importResults && (
                    <div className={`p-4 border-2 ${
                      importResults.failed > 0 ? "border-yellow-500 bg-yellow-50" : "border-green-500 bg-green-50"
                    }`}>
                      <p className="font-medium mb-2">
                        Import Results: {importResults.success} successful, {importResults.failed} failed
                      </p>
                      {importResults.errors.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-1">Errors:</p>
                          <ul className="text-xs list-disc list-inside space-y-1 max-h-40 overflow-y-auto">
                            {importResults.errors.map((error, idx) => (
                              <li key={idx} className="text-red-600">{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={!csvFile || uploading}
                      className="bg-black hover:bg-primary text-white font-semibold py-3 px-6 tracking-normal text-sm transition-colors border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? "Uploading..." : "Import Products"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCsvUpload(false);
                        setCsvFile(null);
                        setImportResults(null);
                      }}
                      className="bg-white hover:bg-black hover:text-white text-black font-semibold py-3 px-6 tracking-normal text-sm transition-colors border-2 border-black"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {showProductForm && (
              <div className="border-2 border-black p-8 mb-8 bg-white">
                <h2 className="text-xl md:text-2xl mb-4">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) =>
                          setProductForm({ ...productForm, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        value={productForm.category}
                        onChange={(e) =>
                          setProductForm({ ...productForm, category: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                      >
                        <option value="Classic">Classic</option>
                        <option value="Modern">Modern</option>
                        <option value="Vintage">Vintage</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm({ ...productForm, price: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Rent Price</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={productForm.rentPrice}
                        onChange={(e) =>
                          setProductForm({ ...productForm, rentPrice: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Images (comma-separated URLs)
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.images}
                        onChange={(e) =>
                          setProductForm({ ...productForm, images: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Sizes (comma-separated)
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.sizes}
                        onChange={(e) =>
                          setProductForm({ ...productForm, sizes: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Colors (comma-separated)
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.colors}
                        onChange={(e) =>
                          setProductForm({ ...productForm, colors: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Stock Count</label>
                      <input
                        type="number"
                        required
                        value={productForm.stockCount}
                        onChange={(e) =>
                          setProductForm({ ...productForm, stockCount: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Barcode</label>
                      <input
                        type="text"
                        value={productForm.barcode}
                        onChange={(e) =>
                          setProductForm({ ...productForm, barcode: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                        placeholder="Enter barcode (e.g., 1234567890123)"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      required
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({ ...productForm, description: e.target.value })
                      }
                      rows={4}
                        className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm tracking-normal bg-white"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) =>
                        setProductForm({ ...productForm, inStock: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <label className="text-sm font-medium">In Stock</label>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-black hover:bg-primary text-white font-semibold py-3 px-6 tracking-normal text-sm transition-colors border-2 border-black"
                    >
                      {editingProduct ? "Update" : "Create"} Product
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                      }}
                      className="bg-white hover:bg-black hover:text-white text-black font-semibold py-3 px-6 tracking-normal text-sm transition-colors border-2 border-black"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : !Array.isArray(products) || products.length === 0 ? (
              <div className="text-center py-12 text-sm text-black/70">
                No products found. Try adding a new product above.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border-2 border-black overflow-hidden bg-white"
                  >
                    <div className="relative h-48 bg-gray-200">
                      {product.images && product.images.length > 0 && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.jpg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      {product.barcode && (
                        <p className="text-xs text-gray-500 mb-2">Barcode: {product.barcode}</p>
                      )}
                      <p className="text-primary mb-4">
                        ${product.price.toFixed(2)} / Rent: ${product.rentPrice.toFixed(2)}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 bg-black hover:bg-primary text-white font-semibold py-3 px-4 tracking-normal text-xs transition-colors border-2 border-black"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : (
              <div className="border-2 border-black overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-normal">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-normal">
                          Date & Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-normal">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-normal">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.user.name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">{booking.user.email}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(booking.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">{booking.time}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : booking.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <select
                              value={booking.status}
                              onChange={(e) =>
                                handleUpdateBookingStatus(booking.id, e.target.value)
                              }
                              className="mr-2 px-2 py-1 border border-gray-300 rounded text-xs md:text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="text-red-600 hover:text-red-900 text-xs md:text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scan Out Tab */}
        {activeTab === "scanout" && (
          <div>
            <div className="max-w-2xl mx-auto">
              <div className="border-2 border-black p-8 mb-8 bg-white">
                <h2 className="text-2xl mb-6 tracking-normal">Scan Out Inventory</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Scan or enter a barcode to mark an item as sold. Stock will be decremented automatically.
                </p>
                
                <form onSubmit={handleScanOut} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Barcode</label>
                    <input
                      type="text"
                      value={scanBarcode}
                      onChange={(e) => setScanBarcode(e.target.value)}
                      placeholder="Scan or enter barcode..."
                      className="w-full px-4 py-4 border-2 border-black focus:border-primary focus:outline-none font-medium text-lg"
                      autoFocus
                      disabled={scanLoading}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Use a USB barcode scanner or manually enter the barcode
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={scanLoading || !scanBarcode}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 tracking-normal text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {scanLoading ? "Processing..." : "Scan Out Item"}
                  </button>
                </form>

                {/* Error Message */}
                {scanError && (
                  <div className="mt-6 p-4 border-2 border-red-500 bg-red-50">
                    <p className="text-red-700 font-medium">{scanError}</p>
                  </div>
                )}

                {/* Success Message */}
                {scanResult && (
                  <div className="mt-6 p-6 border-2 border-green-500 bg-green-50">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">✓ Item Scanned Out Successfully!</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Product:</strong> {scanResult.product.name}</p>
                      <p><strong>Barcode:</strong> {scanResult.product.barcode}</p>
                      <p><strong>Previous Stock:</strong> {scanResult.product.previousStock}</p>
                      <p><strong>Current Stock:</strong> {scanResult.product.currentStock}</p>
                      <p><strong>Status:</strong> {scanResult.product.inStock ? "In Stock" : "Out of Stock"}</p>
                    </div>
                    <button
                      onClick={() => {
                        setScanResult(null);
                        setScanBarcode("");
                      }}
                      className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 text-sm"
                    >
                      Scan Another Item
                    </button>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="border-2 border-gray-300 p-6 bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">How to Use</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Connect a USB barcode scanner to your computer or tablet</li>
                  <li>Click in the barcode field and scan the item</li>
                  <li>The system will automatically find and update the product</li>
                  <li>Stock count will decrease by 1</li>
                  <li>If stock reaches 0, the item will be marked as "Out of Stock" on the website</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

