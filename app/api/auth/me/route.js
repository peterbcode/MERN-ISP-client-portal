import { connectDB } from '@/lib/mongoose';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs'

// Authentication middleware for serverless
const protect = async (request) => {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return null;
    }
    
    return user;
  } catch (error) {
    return null;
  }
};

export async function GET(request) {
  try {
    await connectDB();
    
    // Check authentication
    const user = await protect(request);
    
    if (!user) {
      return Response.json({
        success: false,
        message: 'Not authorized'
      }, { status: 401 });
    }

    // Return user data
    return Response.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profile: user.profile,
        stats: user.stats,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    return Response.json({
      success: false,
      message: 'Failed to get user data'
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    
    // Check authentication
    const user = await protect(request);
    
    if (!user) {
      return Response.json({
        success: false,
        message: 'Not authorized'
      }, { status: 401 });
    }

    const { firstName, lastName, profile = {} } = await request.json();
    const currentProfile = user.profile?.toObject?.() || user.profile || {};
    const nextProfile = {
      ...currentProfile,
      ...profile,
      firstName: firstName ?? profile.firstName ?? user.profile?.firstName,
      lastName: lastName ?? profile.lastName ?? user.profile?.lastName,
    };

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { profile: nextProfile },
      { new: true, runValidators: true }
    );

    return Response.json({
      success: true,
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        profile: updatedUser.profile,
        stats: updatedUser.stats,
        createdAt: updatedUser.createdAt
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    return Response.json({
      success: false,
      message: 'Failed to update profile'
    }, { status: 500 });
  }
}
