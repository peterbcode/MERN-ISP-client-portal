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
    if (!process.env.MONGODB_URI) throw new Error("Missing environment variable: MONGODB_URI");
    if (!process.env.JWT_SECRET) throw new Error("Missing environment variable: JWT_SECRET");

    await connectDB();

    const { username, email, password, firstName, lastName } = await request.json();

    if (!username || !email || !password || !firstName || !lastName) {
      return Response.json(
        { success: false, message: "Please provide username, email, password, first name, and last name" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return Response.json(
        { success: false, message: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? "email" : "username";
      return Response.json({ success: false, message: `${field} already exists` }, { status: 400 });
    }

    const user = new User({
      username,
      email,
      password,
      profile: { firstName, lastName },
    });

    await user.save();

    const token = generateToken(user._id);
    return Response.json(createUserResponse(user, token), { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);

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
