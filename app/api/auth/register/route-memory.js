import jwt from "jsonwebtoken";

export const runtime = "nodejs";

// In-memory user storage for testing (replace with real database)
const users = new Map();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

const createUserResponse = (user, token) => ({
  success: true,
  token,
  user: {
    id: user.id,
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
    
    // Check environment variables
    if (!process.env.JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET");
      throw new Error("Missing environment variable: JWT_SECRET");
    }

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

    // Check if user already exists in memory
    for (const [id, user] of users.entries()) {
      if (user.email === email || user.username === username) {
        const field = user.email === email ? "email" : "username";
        console.log(`❌ ${field} already exists`);
        return Response.json({ success: false, message: `${field} already exists` }, { status: 400 });
      }
    }

    console.log("👤 Creating new user...");
    
    // Create mock user (in production, this would be saved to database)
    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const user = {
      id: userId,
      username,
      email,
      password, // In production, this would be hashed
      role: 'user',
      profile: { 
        firstName, 
        lastName,
        preferences: {
          theme: 'auto',
          notifications: { email: true, push: true, marketing: false },
          privacy: { showEmail: false, showProfile: true }
        }
      },
      createdAt: new Date().toISOString()
    };

    // Store in memory (replace with database save)
    users.set(userId, user);
    console.log("✅ User saved successfully (in-memory)");

    const token = generateToken(userId);
    console.log("🔑 Token generated");
    
    return Response.json(createUserResponse(user, token), { status: 201 });
  } catch (error) {
    console.error("❌ Registration error:", error);

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
