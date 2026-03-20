const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Game name is required'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Game description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['puzzle', 'action', 'strategy', 'arcade', 'racing', 'sports', 'other']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  thumbnail: {
    type: String,
    required: true
  },
  screenshots: [{
    type: String
  }],
  gameUrl: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  controls: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  tags: [{
    type: String,
    lowercase: true
  }],
  stats: {
    totalPlays: { type: Number, default: 0 },
    uniquePlayers: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    highestScore: { type: Number, default: 0 },
    totalPlayTime: { type: Number, default: 0 }, // in minutes
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 }
  },
  leaderboard: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String, required: true },
    score: { type: Number, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    achievedAt: { type: Date, default: Date.now },
    playTime: { type: Number }, // in seconds
    achievements: [String]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  developer: {
    name: { type: String, required: true },
    website: { type: String },
    contact: { type: String }
  },
  version: {
    type: String,
    default: '1.0.0'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for rating count
gameSchema.virtual('ratingDistribution').get(function() {
  // This would be calculated based on actual ratings
  return {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };
});

// Indexes for better performance
// Note: Mongoose automatically creates indexes for fields with unique: true

// Pre-save middleware to generate slug
gameSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

// Static method to get popular games
gameSchema.statics.getPopularGames = async function(limit = 10) {
  return await this.find({ isActive: true })
    .sort({ 'stats.totalPlays': -1 })
    .limit(limit)
    .select('name slug thumbnail category stats');
};

// Static method to get featured games
gameSchema.statics.getFeaturedGames = async function(limit = 6) {
  return await this.find({ isActive: true, isFeatured: true })
    .sort({ 'stats.rating': -1 })
    .limit(limit)
    .select('name slug thumbnail category description stats');
};

// Instance method to update leaderboard
gameSchema.methods.updateLeaderboard = async function(userId, username, score, difficulty = 'medium', playTime = 0) {
  // Remove existing lower score for this user
  this.leaderboard = this.leaderboard.filter(entry => 
    entry.user.toString() !== userId || entry.score >= score
  );
  
  // Add new score
  this.leaderboard.push({
    user: userId,
    username,
    score,
    difficulty,
    achievedAt: new Date(),
    playTime
  });
  
  // Keep only top 100 scores
  this.leaderboard.sort((a, b) => b.score - a.score);
  this.leaderboard = this.leaderboard.slice(0, 100);
  
  // Update game stats
  this.stats.highestScore = Math.max(this.stats.highestScore, score);
  this.stats.totalPlays += 1;
  
  await this.save();
  
  return this.leaderboard.findIndex(entry => 
    entry.user.toString() === userId && entry.score === score
  );
};

// Instance method to get top scores
gameSchema.methods.getTopScores = async function(limit = 10, difficulty = null) {
  let query = {};
  if (difficulty) {
    query.difficulty = difficulty;
  }
  
  return this.leaderboard
    .filter(entry => !difficulty || entry.difficulty === difficulty)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(entry => ({
      username: entry.username,
      score: entry.score,
      difficulty: entry.difficulty,
      achievedAt: entry.achievedAt,
      rank: this.leaderboard.indexOf(entry) + 1
    }));
};

const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);

export default Game;
