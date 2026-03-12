import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { username } = params;

    if (!username) {
      return Response.json({
        success: false,
        message: 'Username is required'
      }, { status: 400 });
    }

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return Response.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Return public profile
    return Response.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        profile: user.profile || {},
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch user profile'
    }, { status: 500 });
  }
}
