import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    console.log("🔍 Forgot password request received");
    
    await connectDB();
    const { email } = await request.json();

    if (!email) {
      console.log("❌ No email provided");
      return Response.json(
        { success: false, message: "Please provide your email" },
        { status: 400 }
      );
    }

    console.log("📧 Looking for user with email:", email);
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ No user found with email:", email);
      return Response.json(
        { success: false, message: "No user found with that email" },
        { status: 404 }
      );
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    console.log("✅ Password reset token generated for:", email);
    
    // In a real app, you would send an email here
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return Response.json({
      success: true,
      message: "Password reset token generated. Check console for development.",
      // In production, remove this token from response
      resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined
    });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    return Response.json(
      {
        success: false,
        message: "Server error processing forgot password",
        ...(process.env.DEBUG_API_ERRORS === "true" ? { error: error?.message } : null),
      },
      { status: 500 }
    );
  }
}
