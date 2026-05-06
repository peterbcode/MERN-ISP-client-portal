import { connectDB } from "@/lib/mongoose";
import { sendContactEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, service } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return Response.json(
        { 
          success: false, 
          message: "Name, email, and message are required" 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { 
          success: false, 
          message: "Please provide a valid email address" 
        },
        { status: 400 }
      );
    }

    // Send email
    const emailResult = await sendContactEmail({
      name,
      email,
      phone: phone || 'Not provided',
      message,
      service: service || 'General Inquiry'
    });

    if (!emailResult.success) {
      console.error("Contact email failed:", emailResult.error);
      return Response.json(
        { 
          success: false, 
          message: "Failed to send message. Please try again or call us directly." 
        },
        { status: 500 }
      );
    }

    console.log("✅ Contact form submission sent successfully:", { name, email, service });

    return Response.json({
      success: true,
      message: "Message sent successfully! We'll get back to you within 24 hours."
    });

  } catch (error) {
    console.error("Contact API error:", error);
    return Response.json(
      { 
        success: false, 
        message: "Server error. Please try again later." 
      },
      { status: 500 }
    );
  }
}
