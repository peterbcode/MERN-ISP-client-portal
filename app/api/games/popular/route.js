import { connectDB } from '@/lib/mongoose';
import Game from '@/models/Game';

export const runtime = 'nodejs';

// GET /api/games/popular - Get popular games
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;

    await connectDB();
    const games = await Game.getPopularGames(limit);
    
    return Response.json({
      success: true,
      games
    });
  } catch (error) {
    console.error('Get popular games error:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch popular games'
    }, { status: 500 });
  }
}
