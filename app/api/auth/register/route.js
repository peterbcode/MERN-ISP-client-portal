import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

const createUserResponse = (user, token) => ({
  success: true,
  token,
  user: {
    id: user._id,
    username: user.username,
    email: user.email,
    firstName: user.profile?.firstName,
    lastName: user.profile?.lastName,
    role: user.role,
    profile: user.profile,
    createdAt: user.createdAt,
  },
});

export async function POST(request) {
  try {
    console.log("🔍 Registration request received");
    console.log("🔧 Environment check:", {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV,
      mongoUriPrefix: process.env.MONGODB_URI?.substring(0, 20) + "..."
    });
    
    // Check environment variables
    if (!process.env.MONGODB_URI) {
      console.error("❌ Missing MONGODB_URI");
      throw new Error("Missing environment variable: MONGODB_URI");
    }
    if (!process.env.JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET");
      throw new Error("Missing environment variable: JWT_SECRET");
    }

    console.log("🔗 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected");

    const { username, email, password, firstName, lastName } = await request.json();
    console.log("📝 Registration data:", { username, email, firstName, lastName, passwordLength: password?.length });

    if (!username || !email || !password || !firstName || !lastName) {
      console.log("❌ Missing required fields");
      return Response.json(
        { success: false, message: "Please provide username, email, password, first name, and last name" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      console.log("❌ Password too short");
      return Response.json(
        { success: false, message: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    console.log("🔍 Checking for existing user...");
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? "email" : "username";
      console.log(`❌ ${field} already exists`);
      return Response.json({ success: false, message: `${field} already exists` }, { status: 400 });
    }

    console.log("👤 Creating new user...");
    const user = new User({
      username,
      email,
      password,
      profile: { firstName, lastName },
    });

    console.log("💾 Saving user to database...");
    await user.save();
    console.log("✅ User saved successfully");

    const token = generateToken(user._id);
    console.log("🔑 Token generated");
    
    return Response.json(createUserResponse(user, token), { status: 201 });
  } catch (error) {
    console.error("❌ Registration error:", error);

    if (error?.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || "field";
      return Response.json({ success: false, message: `${field} already exists` }, { status: 400 });
    }

    if (error?.name === "ValidationError") {
      const message = Object.values(error.errors || {})
        .map((val) => val.message)
        .join(", ");
      return Response.json({ success: false, message }, { status: 400 });
    }

    // Database connection errors
    if (error?.name === "MongooseServerSelectionError") {
      return Response.json(
        { success: false, message: "Database connection failed. Please try again later." },
        { status: 503 },
      );
    }

    return Response.json(
      {
        success: false,
        message: "Registration failed. Please try again.",
        ...(process.env.DEBUG_API_ERRORS === "true" ? { error: error?.message } : null),
      },
      { status: 500 },
    );
  }
}
