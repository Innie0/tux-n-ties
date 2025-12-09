import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const barcode = searchParams.get("barcode");

    if (!barcode) {
      return NextResponse.json(
        { error: "Barcode parameter is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { barcode },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
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
    console.error("Error fetching product by barcode:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}



