const { connectDB } = require('../../../../lib/mongodb');
const User = require('../../../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

async function POST(request) {
  try {
    await connectDB();
    const { username, email, password, firstName, lastName } = await request.json();

    // Validation
    if (!username || !email || !password) {
      return Response.json({
        success: false,
        message: 'Please provide username, email, and password'
      }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({
        success: false,
        message: 'Password must be at least 6 characters long'
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return Response.json({
        success: false,
        message: `${field} already exists`
      }, { status: 400 });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 12),
      firstName,
      lastName
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return response
    return Response.json(
      createUserResponse(user, token),
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return Response.json({
        success: false,
        message: `${field} already exists`
      }, { status: 400 });
    }
    
    // Handle validation error
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      return Response.json({
        success: false,
        message
      }, { status: 400 });
    }
    
    return Response.json({
      success: false,
      message: 'Registration failed. Please try again.'
    }, { status: 500 });
  }
}

module.exports = { POST };
