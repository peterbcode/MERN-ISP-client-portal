export const runtime = "nodejs";

export async function POST(request) {
  try {
    console.log("Debug email endpoint called");
    
    // Test environment variables
    const envVars = {
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NODE_ENV: process.env.NODE_ENV
    };
    
    console.log("Environment variables:", envVars);
    
    // Try to import and test the email service
    try {
      const { sendWelcomeEmail } = await import("@/lib/email");
      console.log("Email service imported successfully");
      
      const result = await sendWelcomeEmail("test@example.com", "Test User");
      console.log("Email service result:", result);
      
      return Response.json({
        success: true,
        message: "Debug test completed",
        envVars,
        result
      });
    } catch (importError) {
      console.error("Email service import error:", importError);
      return Response.json({
        success: false,
        message: "Email service import failed",
        error: importError.message,
        envVars
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return Response.json({
      success: false,
      message: "Debug endpoint failed",
      error: error.message
    }, { status: 500 });
  }
}
