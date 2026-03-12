import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Helper function to create user response
const createUserResponse = (user, token) => {
  return {
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      profile: user.profile,
      createdAt: user.createdAt
    }
  };
};

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return Response.json({
        success: false,
        message: 'Please provide email and password'
      }, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return Response.json({
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json({
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return response
    return Response.json(
      createUserResponse(user, token),
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return Response.json({
      success: false,
      message: 'Login failed. Please try again.'
    }, { status: 500 });
  }
}
