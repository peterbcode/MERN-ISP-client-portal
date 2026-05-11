import { connectDB } from "@/lib/mongoose";
import { sendContactEmail } from "@/lib/email";
import { validateInput, contactRateLimiter } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // Rate limiting check
    if (!contactRateLimiter.isAllowed(clientIP)) {
      const resetTime = contactRateLimiter.getResetTime(clientIP);
      const remainingTime = Math.ceil((resetTime - Date.now()) / 1000);
      
      return Response.json(
        { 
          success: false, 
          message: `Too many contact attempts. Please try again in ${remainingTime} seconds.` 
        },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { name, email, phone, message, service } = body;

    // Validate all inputs with security checks
    const nameValidation = validateInput(name, {
      minLength: 2,
      maxLength: 100,
      allowEmpty: false
    });
    
    const emailValidation = validateInput(email, {
      maxLength: 255,
      allowEmpty: false
    });
    
    const phoneValidation = validateInput(phone, {
      maxLength: 20,
      allowEmpty: true
    });
    
    const messageValidation = validateInput(message, {
      minLength: 10,
      maxLength: 2000,
      allowEmpty: false
    });
    
    const serviceValidation = validateInput(service, {
      maxLength: 100,
      allowEmpty: true
    });
    
    // Return validation errors
    if (!nameValidation.valid) {
      return Response.json(
        { success: false, message: nameValidation.error },
        { status: 400 }
      );
    }
    
    if (!emailValidation.valid) {
      return Response.json(
        { success: false, message: emailValidation.error },
        { status: 400 }
      );
    }
    
    if (!phoneValidation.valid) {
      return Response.json(
        { success: false, message: phoneValidation.error },
        { status: 400 }
      );
    }
    
    if (!messageValidation.valid) {
      return Response.json(
        { success: false, message: messageValidation.error },
        { status: 400 }
      );
    }
    
    if (!serviceValidation.valid) {
      return Response.json(
        { success: false, message: serviceValidation.error },
        { status: 400 }
      );
    }
    
    // Enhanced email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }
    
    // Name validation - no special characters except basic punctuation
    const nameRegex = /^[a-zA-Z\s\-\.']+$/;
    if (!nameRegex.test(name)) {
      return Response.json(
        { success: false, message: "Name can only contain letters, spaces, and basic punctuation" },
        { status: 400 }
      );
    }
    
    // Phone validation - if provided
    if (phone) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(phone)) {
        return Response.json(
          { success: false, message: "Please provide a valid phone number" },
          { status: 400 }
        );
      }
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
