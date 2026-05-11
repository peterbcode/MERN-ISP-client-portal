import { sendPasswordResetEmail, sendWelcomeEmail } from "@/lib/email";

export const runtime = "nodejs";

const isDebugEnabled = () =>
  process.env.NODE_ENV !== "production" && process.env.DEBUG_API_ERRORS === "true";

export async function POST(request) {
  if (!isDebugEnabled()) {
    return Response.json({ success: false, message: "Not found" }, { status: 404 });
  }

  try {
    const { email, type, firstName } = await request.json();

    if (!email) {
      return Response.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const result =
      type === "welcome"
        ? await sendWelcomeEmail(email, firstName)
        : await sendPasswordResetEmail(email, `debug-reset-token-${Date.now()}`);

    if (result.success) {
      return Response.json({
        success: true,
        message: `Test ${type === "welcome" ? "welcome" : "password reset"} email sent successfully`,
      });
    }

    return Response.json({
      success: false,
      message: "Failed to send test email",
    }, { status: 500 });
  } catch (error) {
    console.error("Test email error:", error);
    return Response.json(
      {
        success: false,
        message: "Server error sending test email",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (!isDebugEnabled()) {
    return Response.json({ success: false, message: "Not found" }, { status: 404 });
  }

  return Response.json({
    message: "Email configuration status",
    config: {
      resendApiKeyConfigured: !!process.env.RESEND_API_KEY,
      fromEmailConfigured: !!process.env.RESEND_FROM_EMAIL,
      appUrlConfigured: !!process.env.NEXT_PUBLIC_APP_URL,
    },
  });
}
