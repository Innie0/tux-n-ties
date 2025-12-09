import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shippingAddress } = body;

    // For demo purposes, create a guest user
    // In production, you'd have proper authentication
    const guestEmail = `guest-${Date.now()}@example.com`;
    let user = await prisma.user.create({
      data: {
        email: guestEmail,
        name: "Guest User",
        password: "demo",
        role: "customer",
      },
    });

    const total = items.reduce(
      (sum: number, item: any) => sum + item.price,
      0
    );
    const orderType = items[0]?.type || "buy";

    // Decrement stock for each item
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (product) {
        const quantity = item.quantity || 1;
        const newStockCount = Math.max(0, product.stockCount - quantity);
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stockCount: newStockCount,
            inStock: newStockCount > 0,
          },
        });
      }
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        type: orderType,
        shippingAddress,
        status: "pending",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: 1,
            price: item.price,
            type: item.type,
            size: item.size,
            color: item.color,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

