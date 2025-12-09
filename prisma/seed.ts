import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create sample products
  const products = [
    {
      name: "Classic Black Tuxedo",
      description: "A timeless black tuxedo perfect for formal events, weddings, and galas. Made from premium wool blend fabric.",
      price: 599.99,
      rentPrice: 149.99,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1594938291221-94f18cbb2600?w=800",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      ]),
      sizes: JSON.stringify(["38", "40", "42", "44", "46", "48"]),
      colors: JSON.stringify(["Black"]),
      category: "Classic",
      inStock: true,
      stockCount: 10,
    },
    {
      name: "Modern Navy Tuxedo",
      description: "Contemporary navy blue tuxedo with a modern cut. Perfect for those who want to stand out while maintaining elegance.",
      price: 649.99,
      rentPrice: 169.99,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        "https://images.unsplash.com/photo-1594938291221-94f18cbb2600?w=800",
      ]),
      sizes: JSON.stringify(["38", "40", "42", "44", "46"]),
      colors: JSON.stringify(["Navy Blue"]),
      category: "Modern",
      inStock: true,
      stockCount: 8,
    },
    {
      name: "Vintage Velvet Tuxedo",
      description: "Luxurious velvet tuxedo jacket for special occasions. Rich texture and sophisticated style.",
      price: 799.99,
      rentPrice: 199.99,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800",
        "https://images.unsplash.com/photo-1594938291221-94f18cbb2600?w=800",
      ]),
      sizes: JSON.stringify(["40", "42", "44", "46"]),
      colors: JSON.stringify(["Black Velvet", "Burgundy Velvet"]),
      category: "Vintage",
      inStock: true,
      stockCount: 5,
    },
    {
      name: "White Dinner Jacket",
      description: "Elegant white dinner jacket perfect for summer events and tropical weddings.",
      price: 549.99,
      rentPrice: 139.99,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800",
      ]),
      sizes: JSON.stringify(["38", "40", "42", "44", "46", "48"]),
      colors: JSON.stringify(["White", "Ivory"]),
      category: "Classic",
      inStock: true,
      stockCount: 7,
    },
    {
      name: "Slim Fit Midnight Blue",
      description: "Slim-fit midnight blue tuxedo with modern tailoring. Ideal for contemporary formal events.",
      price: 679.99,
      rentPrice: 179.99,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1594938291221-94f18cbb2600?w=800",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      ]),
      sizes: JSON.stringify(["38", "40", "42", "44"]),
      colors: JSON.stringify(["Midnight Blue"]),
      category: "Modern",
      inStock: true,
      stockCount: 6,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

