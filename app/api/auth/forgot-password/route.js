import crypto from "crypto";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/email";

export const runtime = "nodejs";

const genericResetResponse = () =>
  Response.json({
    success: true,
    message: "If an account exists for that email, a password reset link has been sent.",
  });

const hashResetToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const getAppUrl = (request) => {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const host = forwardedHost || request.headers.get("host");
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (configuredUrl && !configuredUrl.includes("localhost")) {
    return configuredUrl;
  }

  if (!host) {
    return configuredUrl || "http://localhost:3000";
  }

  const protocol = forwardedProto || (host.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
};

export async function POST(request) {
  try {
    await connectDB();
    const { email } = await request.json();

    if (!email) {
      return Response.json(
        { success: false, message: "Please provide your email" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return genericResetResponse();
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = hashResetToken(resetToken);
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
      if (process.env.NODE_ENV !== "production" && process.env.DEBUG_API_ERRORS === "true") {
        console.log(`Password reset token for ${normalizedEmail}: ${resetToken}`);
      }
      return genericResetResponse();
    }

    const emailResult = await sendPasswordResetEmail(normalizedEmail, resetToken, getAppUrl(request));
    if (!emailResult.success) {
      console.error("Failed to send password reset email:", emailResult.error);
    }

    return genericResetResponse();
  } catch (error) {
    console.error("Forgot password error:", error);
    return Response.json(
      {
        success: false,
        message: "Server error processing forgot password",
        ...(process.env.NODE_ENV !== "production" && process.env.DEBUG_API_ERRORS === "true"
          ? { error: error?.message }
          : null),
      },
      { status: 500 }
    );
  }
}
