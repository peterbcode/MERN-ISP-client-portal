import { connectDB } from '@/lib/mongoose';
import Game from '@/models/Game';

export const runtime = 'nodejs';

// GET /api/games/[slug]/leaderboard - Get game leaderboard
export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const difficulty = searchParams.get('difficulty');

    await connectDB();
    
    const game = await Game.findOne({ slug: params.slug, isActive: true });
    if (!game) {
      return Response.json({
        success: false,
        message: 'Game not found'
      }, { status: 404 });
    }

    const topScores = await game.getTopScores(limit, difficulty);
    
    return Response.json({
      success: true,
      game: {
        name: game.name,
        slug: game.slug
      },
      leaderboard: topScores
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch leaderboard'
    }, { status: 500 });
  }
}
