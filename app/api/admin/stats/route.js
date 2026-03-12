import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Game from '@/models/Game';

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
    
    if (!user || user.role !== 'admin') {
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
    
    // Check admin authentication
    const admin = await protect(request);
    
    if (!admin) {
      return Response.json({
        success: false,
        message: 'Not authorized. Admin access required.'
      }, { status: 401 });
    }

    // Get admin statistics
    const [
      totalUsers,
      activeUsers,
      totalGames,
      totalHighScores,
      recentUsers,
      topGames
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Game.countDocuments({ isActive: true }),
      User.aggregate([
        { $unwind: '$gaming.highScores' },
        { $count: 'total' }
      ]).then(result => result[0]?.total || 0),
      User.find({ isActive: true })
        .sort({ 'stats.accountCreated': -1 })
        .limit(5)
        .select('username email profile.firstName profile.lastName stats.accountCreated'),
      Game.find({ isActive: true })
        .sort({ 'stats.totalPlays': -1 })
        .limit(5)
        .select('name category stats.totalPlays stats.highestScore')
    ]);

    return Response.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalGames,
        totalHighScores,
        recentUsers,
        topGames
      }
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch admin statistics'
    }, { status: 500 });
  }
}
