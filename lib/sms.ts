import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER; // Your phone number to receive notifications

// Initialize Twilio client only if credentials are provided
const client = accountSid && authToken 
  ? twilio(accountSid, authToken)
  : null;

export async function sendBookingNotificationSMS(bookingData: {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes?: string;
}) {
  // Only send SMS if Twilio is configured
  if (!client || !twilioPhoneNumber || !adminPhoneNumber) {
    console.log("SMS not configured. Skipping SMS notification.");
    return;
  }

  try {
    const formattedDate = new Date(bookingData.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const message = `New Booking Alert!\n\nCustomer: ${bookingData.name}\nPhone: ${bookingData.phone}\nEmail: ${bookingData.email}\nDate: ${formattedDate}\nTime: ${bookingData.time}${bookingData.notes ? `\nNotes: ${bookingData.notes}` : ""}\n\nPlease check your admin dashboard for details.`;

    await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: adminPhoneNumber,
    });

    console.log("SMS notification sent successfully");
  } catch (error) {
    console.error("Error sending SMS notification:", error);
    // Don't throw error - we don't want SMS failures to break booking creation
  }
}





