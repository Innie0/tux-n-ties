import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingNotificationSMS } from "@/lib/sms";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, date, time, notes } = body;

    // For demo purposes, create a user if they don't exist
    // In production, you'd have proper authentication
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          password: "demo", // In production, hash this properly
          role: "customer",
        },
      });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        date: new Date(date),
        time,
        notes,
        status: "pending",
      },
    });

    // Send SMS notification (non-blocking)
    sendBookingNotificationSMS({
      name,
      email,
      phone,
      date,
      time,
      notes: notes || undefined,
    }).catch((error) => {
      console.error("Failed to send SMS notification:", error);
      // Don't fail the booking if SMS fails
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

