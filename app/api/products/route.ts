import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Parse JSON strings to arrays
    const formattedProducts = products.map((product) => ({
      ...product,
      images: JSON.parse(product.images || "[]"),
      sizes: JSON.parse(product.sizes || "[]"),
      colors: JSON.parse(product.colors || "[]"),
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("=== RECEIVED DATA ===");
    console.log(JSON.stringify(body, null, 2));
    
    // Extract fields
    let { name, description, price, rentPrice, images, sizes, colors, category, barcode, inStock, stockCount } = body;
    
    // Convert images/sizes/colors to arrays if they're strings
    let imagesArray = [];
    if (Array.isArray(images)) {
      imagesArray = images;
    } else if (typeof images === 'string') {
      imagesArray = images.split(',').map(s => s.trim()).filter(Boolean);
    }
    
    let sizesArray = [];
    if (Array.isArray(sizes)) {
      sizesArray = sizes;
    } else if (typeof sizes === 'string') {
      sizesArray = sizes.split(',').map(s => s.trim()).filter(Boolean);
    }
    
    let colorsArray = [];
    if (Array.isArray(colors)) {
      colorsArray = colors;
    } else if (typeof colors === 'string') {
      colorsArray = colors.split(',').map(s => s.trim()).filter(Boolean);
    }
    
    console.log("=== PROCESSED ARRAYS ===");
    console.log("Images:", imagesArray);
    console.log("Sizes:", sizesArray);
    console.log("Colors:", colorsArray);
    
    // Create product
    const product = await prisma.product.create({
      data: {
        name: String(name || "").trim(),
        description: String(description || "").trim(),
        price: Number(price) || 0,
        rentPrice: Number(rentPrice) || 0,
        images: JSON.stringify(imagesArray),
        sizes: JSON.stringify(sizesArray),
        colors: JSON.stringify(colorsArray),
        category: String(category || "Classic").trim(),
        barcode: barcode && String(barcode).trim() ? String(barcode).trim() : null,
        inStock: Boolean(inStock !== false),
        stockCount: Number(stockCount) || 1,
      },
    });
    
    console.log("=== PRODUCT CREATED ===");
    console.log(product);

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("=== ERROR CREATING PRODUCT ===");
    console.error(error);
    
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
