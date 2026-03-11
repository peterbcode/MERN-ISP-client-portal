const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profile: {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    avatar: { type: String },
    bio: { type: String, maxlength: [500, 'Bio cannot exceed 500 characters'] },
    dateOfBirth: { type: Date },
    location: { type: String },
    website: { type: String },
    socialLinks: {
      twitter: { type: String },
      linkedin: { type: String },
      github: { type: String }
    }
  },
  gaming: {
    highScores: [{
      game: { type: String, required: true },
      score: { type: Number, required: true },
      achievedAt: { type: Date, default: Date.now },
      difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
    }],
    totalGamesPlayed: { type: Number, default: 0 },
    favoriteGame: { type: String },
    achievements: [{
      name: { type: String, required: true },
      description: { type: String },
      unlockedAt: { type: Date, default: Date.now },
      icon: { type: String }
    }]
  },
  preferences: {
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      gameUpdates: { type: Boolean, default: true }
    },
    privacy: {
      profileVisible: { type: Boolean, default: true },
      scoresVisible: { type: Boolean, default: true },
      showOnlineStatus: { type: Boolean, default: true }
    }
  },
  stats: {
    loginCount: { type: Number, default: 0 },
    lastLogin: { type: Date },
    accountCreated: { type: Date, default: Date.now },
    timeSpent: { type: Number, default: 0 }, // in minutes
    achievementsUnlocked: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.username;
});

// Virtual for total high score
userSchema.virtual('totalHighScore').get(function() {
  return this.gaming.highScores.reduce((total, score) => total + score.score, 0);
});

// Indexes for better performance
// Note: Mongoose automatically creates indexes for fields with unique: true

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  
  if (!this.preferences.privacy.profileVisible) {
    user.profile = {
      firstName: user.profile.firstName,
      avatar: user.profile.avatar
    };
  }
  
  if (!this.preferences.privacy.scoresVisible) {
    user.gaming = {
      totalGamesPlayed: user.gaming.totalGamesPlayed,
      favoriteGame: user.gaming.favoriteGame
    };
  }
  
  return user;
};

// Static method to get leaderboard
userSchema.statics.getLeaderboard = async function(game = 'all', limit = 10) {
  const matchStage = game === 'all' 
    ? {} 
    : { 'gaming.highScores.game': game };
  
  return await this.aggregate([
    { $match: { isActive: true, 'preferences.privacy.scoresVisible': true, ...matchStage } },
    { $unwind: '$gaming.highScores' },
    ...(game !== 'all' ? [{ $match: { 'gaming.highScores.game': game } }] : []),
    { $sort: { 'gaming.highScores.score': -1 } },
    { 
      $group: {
        _id: '$_id',
        username: { $first: '$username' },
        profile: { $first: '$profile' },
        maxScore: { $max: '$gaming.highScores.score' },
        totalScore: { $sum: '$gaming.highScores.score' },
        gameCount: { $sum: 1 }
      }
    },
    { $sort: { maxScore: -1 } },
    { $limit: limit },
    { $project: {
      username: 1,
      'profile.avatar': 1,
      maxScore: 1,
      totalScore: 1,
      gameCount: 1
    }}
  ]);
};

module.exports = mongoose.model('User', userSchema);
