const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Game name is required'],
    trim: true,
    maxlength: [100, 'Game name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Game description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['action', 'puzzle', 'strategy', 'simulation', 'racing', 'sports', 'other'],
    default: 'other'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Thumbnail must be a valid URL'
    }
  },
  gameUrl: {
    type: String,
    required: [true, 'Game URL is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Game URL must be a valid URL'
    }
  },
  developer: {
    name: { type: String, required: true },
    website: { type: String },
    github: { type: String }
  },
  stats: {
    totalPlays: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    highestScore: { type: Number, default: 0 },
    averagePlaytime: { type: Number, default: 0 }
  },
  features: {
    hasMultiplayer: { type: Boolean, default: false },
    hasLeaderboard: { type: Boolean, default: true },
    hasAchievements: { type: Boolean, default: false },
    hasSaveStates: { type: Boolean, default: false }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
gameSchema.index({ category: 1 });
gameSchema.index({ difficulty: 1 });
gameSchema.index({ 'stats.totalPlays': -1 });
gameSchema.index({ 'stats.averageRating': -1 });
gameSchema.index({ isActive: 1 });

// Virtual for rating breakdown
gameSchema.virtual('ratingBreakdown').get(function() {
  return {
    average: this.stats.averageRating,
    totalRatings: this.stats.totalRatings,
    highestScore: this.stats.highestScore
  };
});

const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);

export default Game;
