import { connectDB } from '@/lib/mongoose';
import Game from '@/models/Game';

export const runtime = 'nodejs';

// GET /api/games/featured - Get featured games
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 6;

    await connectDB();
    const games = await Game.getFeaturedGames(limit);
    
    return Response.json({
      success: true,
      games
    });
  } catch (error) {
    console.error('Get featured games error:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch featured games'
    }, { status: 500 });
  }
}
