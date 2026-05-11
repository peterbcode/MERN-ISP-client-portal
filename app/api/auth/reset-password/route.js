import crypto from "crypto";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { validatePassword } from "@/lib/security";

export const runtime = "nodejs";

const hashResetToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export async function POST(request) {
  try {
    await connectDB();
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return Response.json(
        { success: false, message: "Please provide reset token and new password" },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return Response.json(
        {
          success: false,
          message: "Password does not meet security requirements",
          errors: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      passwordResetToken: hashResetToken(token),
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return Response.json(
        { success: false, message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return Response.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return Response.json(
      {
        success: false,
        message: "Server error resetting password",
        ...(process.env.NODE_ENV !== "production" && process.env.DEBUG_API_ERRORS === "true"
          ? { error: error?.message }
          : null),
      },
      { status: 500 }
    );
  }
}
