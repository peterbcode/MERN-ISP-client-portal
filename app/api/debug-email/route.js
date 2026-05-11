export const runtime = "nodejs";

export async function POST() {
  if (process.env.NODE_ENV === "production" || process.env.DEBUG_API_ERRORS !== "true") {
    return Response.json({ success: false, message: "Not found" }, { status: 404 });
  }

  try {
    const envVars = {
      resendApiKeyConfigured: !!process.env.RESEND_API_KEY,
      fromEmailConfigured: !!process.env.RESEND_FROM_EMAIL,
      appUrlConfigured: !!process.env.NEXT_PUBLIC_APP_URL,
      nodeEnv: process.env.NODE_ENV,
    };

    const { sendWelcomeEmail } = await import("@/lib/email");
    const result = await sendWelcomeEmail("test@example.com", "Test User");

    return Response.json({
      success: true,
      message: "Debug test completed",
      envVars,
      result: { success: result.success },
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return Response.json({
      success: false,
      message: "Debug endpoint failed",
      error: error.message,
    }, { status: 500 });
  }
}
