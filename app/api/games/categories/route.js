import { connectDB } from '@/lib/mongoose';
import Game from '@/models/Game';

export const runtime = 'nodejs';

// GET /api/games/categories - Get all game categories
export async function GET(request) {
  try {
    await connectDB();
    const categories = await Game.distinct('category', { isActive: true });
    
    return Response.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch categories'
    }, { status: 500 });
  }
}
