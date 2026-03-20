import { connectDB } from '@/lib/mongoose';
import Game from '@/models/Game';

export const runtime = 'nodejs';

// GET /api/games - Get all games with filtering and pagination
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const sortBy = searchParams.get('sortBy') || 'stats.totalPlays';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const featured = searchParams.get('featured') || false;

    await connectDB();

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Build filter
    const filter = { isActive: true };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (featured === 'true') filter.isFeatured = true;

    const [games, total] = await Promise.all([
      Game.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('name slug description category difficulty thumbnail stats tags'),
      Game.countDocuments(filter)
    ]);

    return Response.json({
      success: true,
      games,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get games error:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch games'
    }, { status: 500 });
  }
}
