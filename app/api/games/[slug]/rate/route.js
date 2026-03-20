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

// POST /api/games/[slug]/rate - Rate a game
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

    const { rating } = await request.json();
    
    if (!rating || rating < 1 || rating > 5) {
      return Response.json({
        success: false,
        message: 'Rating must be between 1 and 5'
      }, { status: 400 });
    }

    const game = await Game.findOne({ slug: params.slug, isActive: true });
    if (!game) {
      return Response.json({
        success: false,
        message: 'Game not found'
      }, { status: 404 });
    }

    // In a real implementation, you'd store individual user ratings
    // For now, we'll just update the average rating (this is simplified)
    const newRatingCount = game.stats.ratingCount + 1;
    const newAverageRating = ((game.stats.rating * game.stats.ratingCount) + rating) / newRatingCount;

    game.stats.rating = newAverageRating;
    game.stats.ratingCount = newRatingCount;
    await game.save();

    return Response.json({
      success: true,
      message: 'Rating submitted successfully',
      data: {
        averageRating: game.stats.rating,
        totalRatings: game.stats.ratingCount
      }
    });
  } catch (error) {
    console.error('Rate game error:', error);
    return Response.json({
      success: false,
      message: 'Failed to rate game'
    }, { status: 500 });
  }
}
