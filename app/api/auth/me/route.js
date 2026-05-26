import { connectDB } from '@/lib/mongoose';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs'

const MAX_AVATAR_LENGTH = 1_200_000;

const isHttpImageUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const isAvatarDataUrl = (value) =>
  /^data:image\/(?:png|jpeg|jpg|webp|gif);base64,[a-z0-9+/=]+$/i.test(value);

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

    const isActive = user.isActive ?? user.stats?.isActive ?? true;
    if (!isActive) {
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

    const { username, firstName, lastName, profile = {} } = await request.json();
    const updates = {};

    if (typeof username === 'string') {
      const nextUsername = username.trim();

      if (nextUsername.length < 3 || nextUsername.length > 30) {
        return Response.json({
          success: false,
          message: 'Username must be between 3 and 30 characters'
        }, { status: 400 });
      }

      if (!/^[a-zA-Z0-9_]+$/.test(nextUsername)) {
        return Response.json({
          success: false,
          message: 'Username can only contain letters, numbers, and underscores'
        }, { status: 400 });
      }

      const usernameOwner = await User.findOne({
        username: nextUsername,
        _id: { $ne: user._id },
      });

      if (usernameOwner) {
        return Response.json({
          success: false,
          message: 'Username is already taken'
        }, { status: 409 });
      }

      updates.username = nextUsername;
    }

    const avatar = typeof profile.avatar === 'string' ? profile.avatar.trim() : profile.avatar;
    if (avatar) {
      if (avatar.length > MAX_AVATAR_LENGTH || (!isHttpImageUrl(avatar) && !isAvatarDataUrl(avatar))) {
        return Response.json({
          success: false,
          message: 'Profile picture must be a valid image URL or uploaded PNG, JPG, WebP, or GIF'
        }, { status: 400 });
      }
    }

    const currentProfile = user.profile?.toObject?.() || user.profile || {};
    const nextProfile = {
      ...currentProfile,
      ...profile,
      firstName: firstName ?? profile.firstName ?? user.profile?.firstName,
      lastName: lastName ?? profile.lastName ?? user.profile?.lastName,
      avatar: avatar || null,
    };
    updates.profile = nextProfile;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updates,
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
