import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Parse JSON strings to arrays
    const formattedProduct = {
      ...product,
      images: JSON.parse(product.images || "[]"),
      sizes: JSON.parse(product.sizes || "[]"),
      colors: JSON.parse(product.colors || "[]"),
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      rentPrice,
      images,
      sizes,
      colors,
      category,
      barcode,
      inStock,
      stockCount,
    } = body;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        rentPrice: rentPrice ? parseFloat(rentPrice) : undefined,
        images: images ? JSON.stringify(images) : undefined,
        sizes: sizes ? JSON.stringify(sizes) : undefined,
        colors: colors ? JSON.stringify(colors) : undefined,
        category,
        barcode: barcode !== undefined ? (barcode || null) : undefined,
        inStock,
        stockCount,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

