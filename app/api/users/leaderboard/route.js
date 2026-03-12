import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

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
    
    const { searchParams } = new URL(request.url);
    const game = searchParams.get('game') || 'all';
    const limit = parseInt(searchParams.get('limit')) || 50;
    const difficulty = searchParams.get('difficulty');

    // Get authentication (optional)
    const user = await protect(request);
    
    // Get leaderboard
    let leaderboard = [];
    
    if (game === 'all') {
      leaderboard = await User
        .find({})
        .select('username profile.firstName profile.lastName profile.avatar profile.level profile.experience profile.achievements')
        .sort({ 'profile.experience': -1 })
        .limit(limit);
    } else {
      // Specific game leaderboard
      leaderboard = await User
        .find({ [`profile.gameStats.${game}`]: { $exists: true } })
        .select('username profile.firstName profile.lastName profile.avatar profile.level profile.experience profile.achievements')
        .sort({ [`profile.gameStats.${game}.score`]: -1 })
        .limit(limit);
    }

    // Add current user's rank if authenticated
    let currentUserRank = null;
    if (user) {
      const userEntry = leaderboard.find(entry => entry._id.toString() === user._id.toString());
      if (userEntry) {
        currentUserRank = leaderboard.indexOf(userEntry) + 1;
      }
    }

    return Response.json({
      success: true,
      leaderboard,
      currentUserRank,
      filters: {
        game,
        limit,
        difficulty
      }
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch leaderboard'
    }, { status: 500 });
  }
}
