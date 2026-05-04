import { sendPasswordResetEmail, sendWelcomeEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { email, type, firstName } = await request.json();

    if (!email) {
      return Response.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    let result;
    
    if (type === 'welcome') {
      result = await sendWelcomeEmail(email, firstName);
    } else {
      // Generate a test token for password reset
      const testToken = 'test-reset-token-' + Date.now();
      result = await sendPasswordResetEmail(email, testToken);
    }

    if (result.success) {
      return Response.json({
        success: true,
        message: `Test ${type === 'welcome' ? 'welcome' : 'password reset'} email sent successfully to ${email}`,
        data: result.data
      });
    } else {
      return Response.json({
        success: false,
        message: `Failed to send test email: ${result.error}`,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Test email error:", error);
    return Response.json(
      {
        success: false,
        message: "Server error sending test email",
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const emailConfig = {
    resendApiKey: !!process.env.RESEND_API_KEY,
    fromEmail: process.env.RESEND_FROM_EMAIL || 'not configured',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'not configured'
  };

  return Response.json({
    message: "Email configuration status",
    config: emailConfig,
    instructions: {
      setup: [
        "1. Sign up at https://resend.com",
        "2. Get your API key from https://resend.com/api-keys",
        "3. Add RESEND_API_KEY to your environment variables",
        "4. Add RESEND_FROM_EMAIL (must be a verified domain in Resend)",
        "5. Set NEXT_PUBLIC_APP_URL to your app's URL"
      ],
      test: "Send a POST request to this endpoint with { email: 'test@example.com', type: 'welcome' }"
    }
  });
}
