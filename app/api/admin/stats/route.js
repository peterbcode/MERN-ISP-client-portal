import { connectDB } from '@/lib/mongoose';
import User from '@/models/User';
import Game from '@/models/Game';
import { requireAdmin } from '../_auth'

export const runtime = 'nodejs'

export async function GET(request) {
  try {
    await connectDB();
    
    // Check admin authentication
    const admin = await requireAdmin(request);
    
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
      User.countDocuments({ $or: [{ isActive: true }, { 'stats.isActive': true }] }),
      Game.countDocuments({ isActive: true }),
      User.aggregate([
        {
          $project: {
            allHighScores: {
              $concatArrays: [
                { $ifNull: ['$gaming.highScores', []] },
                { $ifNull: ['$profile.gaming.highScores', []] }
              ]
            }
          }
        },
        { $unwind: '$allHighScores' },
        { $count: 'total' }
      ]).then(result => result[0]?.total || 0),
      User.find({ $or: [{ isActive: true }, { 'stats.isActive': true }] })
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
