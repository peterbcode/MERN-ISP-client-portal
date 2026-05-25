import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { validateInput, validatePassword, authRateLimiter } from "@/lib/security";
import { sendWelcomeEmail } from "@/lib/email";

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
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // Rate limiting check
    if (!authRateLimiter.isAllowed(clientIP)) {
      const resetTime = authRateLimiter.getResetTime(clientIP);
      const remainingTime = Math.ceil((resetTime - Date.now()) / 60000);
      
      return Response.json(
        { 
          success: false, 
          message: `Too many registration attempts. Please try again in ${remainingTime} minutes.` 
        },
        { status: 429 }
      );
    }

    // Check environment variables
    if (!process.env.MONGODB_URI) {
      console.error("❌ Missing MONGODB_URI");
      throw new Error("Missing environment variable: MONGODB_URI");
    }
    if (!process.env.JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET");
      throw new Error("Missing environment variable: JWT_SECRET");
    }

    await connectDB();

    const body = await request.json();
    const username = typeof body.username === "string" ? body.username.trim() : body.username;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : body.email;
    const password = body.password;
    const firstName = typeof body.firstName === "string" ? body.firstName.trim() : body.firstName;
    const lastName = typeof body.lastName === "string" ? body.lastName.trim() : body.lastName;

    // Validate all inputs
    const usernameValidation = validateInput(username, {
      minLength: 3,
      maxLength: 30,
      allowEmpty: false
    });
    
    const emailValidation = validateInput(email, {
      maxLength: 255,
      allowEmpty: false
    });
    
    const firstNameValidation = validateInput(firstName, {
      maxLength: 50,
      allowEmpty: false
    });
    
    const lastNameValidation = validateInput(lastName, {
      maxLength: 50,
      allowEmpty: false
    });
    
    if (!usernameValidation.valid) {
      console.log("❌ Invalid username:", usernameValidation.error);
      return Response.json(
        { success: false, message: usernameValidation.error },
        { status: 400 },
      );
    }
    
    if (!emailValidation.valid) {
      console.log("❌ Invalid email:", emailValidation.error);
      return Response.json(
        { success: false, message: emailValidation.error },
        { status: 400 },
      );
    }
    
    if (!firstNameValidation.valid) {
      console.log("❌ Invalid first name:", firstNameValidation.error);
      return Response.json(
        { success: false, message: firstNameValidation.error },
        { status: 400 },
      );
    }
    
    if (!lastNameValidation.valid) {
      console.log("❌ Invalid last name:", lastNameValidation.error);
      return Response.json(
        { success: false, message: lastNameValidation.error },
        { status: 400 },
      );
    }

    // Enhanced password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      console.log("❌ Weak password:", passwordValidation.errors);
      return Response.json(
        { 
          success: false, 
          message: "Password does not meet security requirements",
          errors: passwordValidation.errors 
        },
        { status: 400 },
      );
    }
    
    // Username format validation
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      console.log("❌ Invalid username format");
      return Response.json(
        { success: false, message: "Username can only contain letters, numbers, and underscores" },
        { status: 400 },
      );
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format");
      return Response.json(
        { success: false, message: "Please provide a valid email address" },
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
    
    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.profile?.firstName);
      console.log("📧 Welcome email sent successfully");
    } catch (emailError) {
      console.error("❌ Failed to send welcome email:", emailError);
      // Don't fail registration if email fails
    }
    
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
        ...(process.env.NODE_ENV !== "production" && process.env.DEBUG_API_ERRORS === "true"
          ? { error: error?.message }
          : null),
      },
      { status: 500 },
    );
  }
}
