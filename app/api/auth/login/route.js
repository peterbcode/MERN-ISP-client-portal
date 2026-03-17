import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
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
    if (!process.env.MONGODB_URI) throw new Error("Missing environment variable: MONGODB_URI");
    if (!process.env.JWT_SECRET) throw new Error("Missing environment variable: JWT_SECRET");

    await connectDB();

    const { email, password } = await request.json();
    if (!email || !password) {
      return Response.json({ success: false, message: "Please provide email and password" }, { status: 400 });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return Response.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const token = generateToken(user._id);
    return Response.json(createUserResponse(user, token), { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      {
        success: false,
        message: "Login failed. Please try again.",
        ...(process.env.DEBUG_API_ERRORS === "true" ? { error: error?.message } : null),
      },
      { status: 500 },
    );
  }
}
