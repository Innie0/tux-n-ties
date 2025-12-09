import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parse } from "csv-parse/sync";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Read the file content
    const text = await file.text();

    // Parse CSV
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (records.length === 0) {
      return NextResponse.json(
        { error: "CSV file is empty or has no valid data" },
        { status: 400 }
      );
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Process each row
    for (let i = 0; i < records.length; i++) {
      const row = records[i] as Record<string, string>;
      const rowNumber = i + 2; // +2 because row 1 is header, and arrays are 0-indexed

      try {
        // Validate required fields
        if (!row.name || !row.price || !row.rentPrice) {
          results.failed++;
          results.errors.push(
            `Row ${rowNumber}: Missing required fields (name, price, or rentPrice)`
          );
          continue;
        }

        // Parse arrays (images, sizes, colors)
        const images = row.images
          ? row.images.split(",").map((img: string) => img.trim()).filter(Boolean)
          : [];
        const sizes = row.sizes
          ? row.sizes.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [];
        const colors = row.colors
          ? row.colors.split(",").map((c: string) => c.trim()).filter(Boolean)
          : [];

        // Create product
        await prisma.product.create({
          data: {
            name: row.name.trim(),
            description: row.description?.trim() || "",
            price: parseFloat(row.price),
            rentPrice: parseFloat(row.rentPrice),
            images: JSON.stringify(images),
            sizes: JSON.stringify(sizes),
            colors: JSON.stringify(colors),
            category: row.category?.trim() || "Classic",
            barcode: row.barcode?.trim() || null,
            inStock: row.inStock === "false" ? false : true,
            stockCount: parseInt(row.stockCount) || 1,
          },
        });

        results.success++;
      } catch (error: any) {
        results.failed++;
        const errorMessage =
          error.code === "P2002"
            ? `Row ${rowNumber}: Duplicate barcode or product name`
            : `Row ${rowNumber}: ${error.message || "Unknown error"}`;
        results.errors.push(errorMessage);
      }
    }

    return NextResponse.json({
      message: `Import completed: ${results.success} successful, ${results.failed} failed`,
      results,
    });
  } catch (error: any) {
    console.error("Error processing CSV import:", error);
    return NextResponse.json(
      { error: `Failed to process CSV: ${error.message}` },
      { status: 500 }
    );
  }
}



