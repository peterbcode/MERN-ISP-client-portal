import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    console.log("🔍 Reset password request received");
    
    await connectDB();
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      console.log("❌ Missing token or new password");
      return Response.json(
        { success: false, message: "Please provide reset token and new password" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      console.log("❌ Password too short");
      return Response.json(
        { success: false, message: "New password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    console.log("🔍 Looking for user with reset token");
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log("❌ Invalid or expired reset token");
      return Response.json(
        { success: false, message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Update password and clear reset fields
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    console.log("✅ Password reset successful for user:", user.email);
    
    return Response.json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    return Response.json(
      {
        success: false,
        message: "Server error resetting password",
        ...(process.env.DEBUG_API_ERRORS === "true" ? { error: error?.message } : null),
      },
      { status: 500 }
    );
  }
}
