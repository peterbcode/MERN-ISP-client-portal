const express = require('express');
const Game = require('../models/Game');
const User = require('../models/User');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/games
// @desc    Get all games with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = '',
      category = '',
      difficulty = '',
      sortBy = 'stats.totalPlays',
      sortOrder = 'desc',
      featured = false
    } = req.query;

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
        .limit(parseInt(limit))
        .select('name slug description category difficulty thumbnail stats tags'),
      Game.countDocuments(filter)
    ]);

    res.json({
      success: true,
      games,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch games'
    });
  }
});

// @route   GET /api/games/featured
// @desc    Get featured games
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const games = await Game.getFeaturedGames(limit);
    
    res.json({
      success: true,
      games
    });
  } catch (error) {
    console.error('Get featured games error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured games'
    });
  }
});

// @route   GET /api/games/popular
// @desc    Get popular games
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const games = await Game.getPopularGames(limit);
    
    res.json({
      success: true,
      games
    });
  } catch (error) {
    console.error('Get popular games error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular games'
    });
  }
});

// @route   GET /api/games/:slug
// @desc    Get single game by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const game = await Game.findOne({ slug: req.params.slug, isActive: true });
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    res.json({
      success: true,
      game
    });
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch game'
    });
  }
});

// @route   GET /api/games/:slug/leaderboard
// @desc    Get game leaderboard
// @access  Public
router.get('/:slug/leaderboard', async (req, res) => {
  try {
    const { limit = 10, difficulty } = req.query;
    
    const game = await Game.findOne({ slug: req.params.slug, isActive: true });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    const topScores = await game.getTopScores(parseInt(limit), difficulty);
    
    res.json({
      success: true,
      game: {
        name: game.name,
        slug: game.slug
      },
      leaderboard: topScores
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard'
    });
  }
});

// @route   POST /api/games/:slug/play
// @desc    Record game play and update stats
// @access  Private
router.post('/:slug/play', protect, async (req, res) => {
  try {
    const { score, difficulty = 'medium', playTime = 0 } = req.body;
    
    if (!score || score < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid score is required'
      });
    }

    const game = await Game.findOne({ slug: req.params.slug, isActive: true });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    const user = req.user;

    // Update game stats
    game.stats.totalPlays += 1;
    game.stats.totalPlayTime += Math.floor(playTime / 60); // Convert to minutes
    
    // Update unique players if this is user's first play
    const userPlayedBefore = user.gaming.highScores.some(hs => hs.game === game.name);
    if (!userPlayedBefore) {
      game.stats.uniquePlayers += 1;
    }

    await game.save();

    // Update user stats
    user.gaming.totalGamesPlayed += 1;
    user.stats.timeSpent += Math.floor(playTime / 60);

    // Add high score if it's better than existing
    const existingScoreIndex = user.gaming.highScores.findIndex(
      hs => hs.game === game.name && hs.difficulty === difficulty
    );

    const newHighScore = {
      game: game.name,
      score,
      difficulty,
      achievedAt: new Date()
    };

    if (existingScoreIndex >= 0) {
      if (score > user.gaming.highScores[existingScoreIndex].score) {
        user.gaming.highScores[existingScoreIndex] = newHighScore;
      }
    } else {
      user.gaming.highScores.push(newHighScore);
    }

    // Update favorite game if needed
    if (!user.gaming.favoriteGame || score > Math.max(...user.gaming.highScores.map(hs => hs.score))) {
      user.gaming.favoriteGame = game.name;
    }

    await user.save();

    // Update game leaderboard
    const rank = await game.updateLeaderboard(user._id, user.username, score, difficulty, playTime);

    res.json({
      success: true,
      message: 'Game session recorded successfully',
      data: {
        score,
        rank: rank + 1, // Convert 0-index to 1-index
        isNewHighScore: existingScoreIndex === -1 || score > user.gaming.highScores[existingScoreIndex].score,
        totalGamesPlayed: user.gaming.totalGamesPlayed
      }
    });
  } catch (error) {
    console.error('Record play error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record game session'
    });
  }
});

// @route   POST /api/games/:slug/rate
// @desc    Rate a game
// @access  Private
router.post('/:slug/rate', protect, async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const game = await Game.findOne({ slug: req.params.slug, isActive: true });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    // In a real implementation, you'd store individual user ratings
    // For now, we'll just update the average rating (this is simplified)
    const newRatingCount = game.stats.ratingCount + 1;
    const newAverageRating = ((game.stats.rating * game.stats.ratingCount) + rating) / newRatingCount;

    game.stats.rating = newAverageRating;
    game.stats.ratingCount = newRatingCount;
    await game.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      data: {
        averageRating: game.stats.rating,
        totalRatings: game.stats.ratingCount
      }
    });
  } catch (error) {
    console.error('Rate game error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to rate game'
    });
  }
});

// @route   GET /api/games/categories
// @desc    Get all game categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Game.distinct('category', { isActive: true });
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

module.exports = router;
