import { connectDB } from '@/lib/mongoose';
import Game from '@/models/Game';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

export const runtime = 'nodejs';

// Authentication middleware
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

// GET /api/games/[slug] - Get single game by slug
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const game = await Game.findOne({ slug: params.slug, isActive: true });
    
    if (!game) {
      return Response.json({
        success: false,
        message: 'Game not found'
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      game
    });
  } catch (error) {
    console.error('Get game error:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch game'
    }, { status: 500 });
  }
}

// POST /api/games/[slug]/play - Record game play and update stats
export async function POST(request, { params }) {
  try {
    await connectDB();
    
    const user = await protect(request);
    if (!user) {
      return Response.json({
        success: false,
        message: 'Not authorized'
      }, { status: 401 });
    }

    const { score, difficulty = 'medium', playTime = 0 } = await request.json();
    
    if (!score || score < 0) {
      return Response.json({
        success: false,
        message: 'Valid score is required'
      }, { status: 400 });
    }

    const game = await Game.findOne({ slug: params.slug, isActive: true });
    if (!game) {
      return Response.json({
        success: false,
        message: 'Game not found'
      }, { status: 404 });
    }

    // Update game stats
    game.stats.totalPlays += 1;
    game.stats.totalPlayTime += Math.floor(playTime / 60); // Convert to minutes
    
    // Update unique players if this is user's first play
    const userPlayedBefore = user.profile?.gaming?.highScores?.some(hs => hs.game === game.name);
    if (!userPlayedBefore) {
      game.stats.uniquePlayers += 1;
    }

    await game.save();

    // Update user stats
    if (!user.profile) user.profile = {};
    if (!user.profile.gaming) user.profile.gaming = {};
    
    user.profile.gaming.totalGamesPlayed = (user.profile.gaming.totalGamesPlayed || 0) + 1;
    user.stats.timeSpent = (user.stats.timeSpent || 0) + Math.floor(playTime / 60);

    // Add high score if it's better than existing
    const existingScoreIndex = user.profile.gaming.highScores?.findIndex(
      hs => hs.game === game.name && hs.difficulty === difficulty
    ) ?? -1;

    const newHighScore = {
      game: game.name,
      score,
      difficulty,
      date: new Date()
    };

    if (!user.profile.gaming.highScores) user.profile.gaming.highScores = [];

    if (existingScoreIndex >= 0) {
      if (score > user.profile.gaming.highScores[existingScoreIndex].score) {
        user.profile.gaming.highScores[existingScoreIndex] = newHighScore;
      }
    } else {
      user.profile.gaming.highScores.push(newHighScore);
    }

    // Update favorite game if needed
    if (!user.profile.gaming.favoriteGame || score > Math.max(...user.profile.gaming.highScores.map(hs => hs.score))) {
      user.profile.gaming.favoriteGame = game.name;
    }

    await user.save();

    // Update game leaderboard
    const rank = await game.updateLeaderboard(user._id, user.username, score, difficulty, playTime);

    return Response.json({
      success: true,
      message: 'Game session recorded successfully',
      data: {
        score,
        rank: rank + 1, // Convert 0-index to 1-index
        isNewHighScore: existingScoreIndex === -1 || score > user.profile.gaming.highScores[existingScoreIndex].score,
        totalGamesPlayed: user.profile.gaming.totalGamesPlayed
      }
    });
  } catch (error) {
    console.error('Record play error:', error);
    return Response.json({
      success: false,
      message: 'Failed to record game session'
    }, { status: 500 });
  }
}
