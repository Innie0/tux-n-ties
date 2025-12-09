import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { barcode, quantity = 1 } = body;

    if (!barcode) {
      return NextResponse.json(
        { error: "Barcode is required" },
        { status: 400 }
      );
    }

    // Find product by barcode
    const product = await prisma.product.findUnique({
      where: { barcode: String(barcode).trim() },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found with this barcode" },
        { status: 404 }
      );
    }

    // Calculate new stock
    const newStockCount = Math.max(0, product.stockCount - quantity);
    const newInStock = newStockCount > 0;

    // Update stock
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        stockCount: newStockCount,
        inStock: newInStock,
      },
    });

    return NextResponse.json({
      success: true,
      message: `${quantity} item(s) scanned out successfully`,
      product: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        barcode: updatedProduct.barcode,
        previousStock: product.stockCount,
        currentStock: newStockCount,
        inStock: newInStock,
      },
    });
  } catch (error: any) {
    console.error("Error scanning out product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to scan out product" },
      { status: 500 }
    );
  }
}



