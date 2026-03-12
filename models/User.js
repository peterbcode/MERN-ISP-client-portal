import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

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
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    location: {
      type: String,
      maxlength: [100, 'Location cannot exceed 100 characters']
    },
    website: {
      type: String,
      validate: [validator.isURL, 'Please provide a valid website URL']
    },
    social: {
      twitter: String,
      github: String,
      linkedin: String
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'auto'
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false }
      },
      privacy: {
        showEmail: { type: Boolean, default: false },
        showProfile: { type: Boolean, default: true }
      }
    },
    gaming: {
      level: { type: Number, default: 1 },
      experience: { type: Number, default: 0 },
      achievements: [String],
      highScores: [{
        game: String,
        score: Number,
        difficulty: String,
        date: { type: Date, default: Date.now }
      }],
      gameStats: {
        totalPlays: { type: Number, default: 0 },
        totalTime: { type: Number, default: 0 },
        favoriteGame: String
      }
    }
  },
  stats: {
    lastLogin: Date,
    accountCreated: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    loginCount: { type: Number, default: 0 }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled'],
      default: 'active'
    },
    expiresAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'profile.gaming.experience': -1 });
userSchema.index({ 'stats.isActive': 1 });

// Virtual for public profile
userSchema.virtual('getPublicProfile').get(function() {
  return {
    id: this._id,
    username: this.username,
    profile: this.profile,
    stats: {
      level: this.profile?.gaming?.level || 1,
      experience: this.profile?.gaming?.experience || 0,
      achievements: this.profile?.gaming?.achievements || []
    }
  };
});

// Pre-save middleware for password hashing
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Static methods
userSchema.statics.getLeaderboard = function(game = 'all', limit = 50) {
  const query = game === 'all' 
    ? {} 
    : { [`profile.gaming.gameStats.${game}`]: { $exists: true } };
    
  return this.find(query)
    .select('username profile.firstName profile.lastName profile.avatar profile.gaming.level profile.gaming.experience profile.gaming.achievements')
    .sort(game === 'all' ? { 'profile.gaming.experience': -1 } : { [`profile.gaming.gameStats.${game}.score`]: -1 })
    .limit(limit);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
