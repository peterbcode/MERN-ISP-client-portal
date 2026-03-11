const express = require('express');
const User = require('../models/User');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/leaderboard
// @desc    Get global leaderboard
// @access  Public
router.get('/leaderboard', optionalAuth, async (req, res) => {
  try {
    const { game = 'all', limit = 50, difficulty } = req.query;
    
    const leaderboard = await User.getLeaderboard(game, parseInt(limit));
    
    // Add current user's rank if authenticated
    let currentUserRank = null;
    if (req.user) {
      const userEntry = leaderboard.find(entry => entry._id.toString() === req.user._id.toString());
      if (userEntry) {
        currentUserRank = leaderboard.indexOf(userEntry) + 1;
      }
    }
    
    res.json({
      success: true,
      leaderboard,
      currentUserRank,
      filters: {
        game,
        limit: parseInt(limit),
        difficulty
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard'
    });
  }
});

// @route   GET /api/users/profile/:username
// @desc    Get public user profile
// @access  Public
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ 
      username: req.params.username, 
      isActive: true 
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const publicProfile = user.getPublicProfile();
    
    res.json({
      success: true,
      user: publicProfile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// @route   GET /api/users/search
// @desc    Search users by username
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q = '', limit = 10 } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        users: []
      });
    }

    const users = await User.find({
      username: { $regex: q, $options: 'i' },
      isActive: true,
      'preferences.privacy.profileVisible': true
    })
    .limit(parseInt(limit))
    .select('username profile.firstName profile.lastName profile.avatar gaming.totalGamesPlayed')
    .lean();

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search users'
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get current user's detailed stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const user = req.user;
    
    // Calculate additional stats
    const stats = {
      profile: {
        username: user.username,
        fullName: user.fullName,
        memberSince: user.stats.accountCreated,
        lastLogin: user.stats.lastLogin,
        loginCount: user.stats.loginCount
      },
      gaming: {
        totalGamesPlayed: user.gaming.totalGamesPlayed,
        totalHighScores: user.gaming.highScores.length,
        favoriteGame: user.gaming.favoriteGame,
        achievementsUnlocked: user.stats.achievementsUnlocked,
        totalTimeSpent: user.stats.timeSpent
      },
      highScores: user.gaming.highScores.sort((a, b) => b.score - a.score).slice(0, 10),
      achievements: user.gaming.achievements || []
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user stats'
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', protect, async (req, res) => {
  try {
    const { preferences } = req.body;
    const user = req.user;

    // Validate preferences structure
    const allowedPreferences = ['theme', 'notifications', 'privacy'];
    const updateData = {};

    allowedPreferences.forEach(key => {
      if (preferences[key] !== undefined) {
        updateData[`preferences.${key}`] = preferences[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      user: updatedUser.getPublicProfile()
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences'
    });
  }
});

// @route   POST /api/users/achievements
// @desc    Add achievement to user profile
// @access  Private
router.post('/achievements', protect, async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    const user = req.user;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Achievement name is required'
      });
    }

    // Check if achievement already exists
    const existingAchievement = user.gaming.achievements.find(
      ach => ach.name.toLowerCase() === name.toLowerCase()
    );

    if (existingAchievement) {
      return res.status(400).json({
        success: false,
        message: 'Achievement already unlocked'
      });
    }

    // Add new achievement
    user.gaming.achievements.push({
      name,
      description: description || '',
      icon: icon || '🏆',
      unlockedAt: new Date()
    });

    user.stats.achievementsUnlocked += 1;
    await user.save();

    res.json({
      success: true,
      message: 'Achievement unlocked successfully',
      achievement: user.gaming.achievements[user.gaming.achievements.length - 1]
    });
  } catch (error) {
    console.error('Add achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add achievement'
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account (soft delete)
// @access  Private
router.delete('/account', protect, async (req, res) => {
  try {
    const { password } = req.body;
    const user = req.user;

    // Verify password
    const userWithPassword = await User.findById(user._id).select('+password');
    if (!(await userWithPassword.comparePassword(password))) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    // Soft delete account
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
});

module.exports = router;
