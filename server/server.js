// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const gameRoutes = require('./routes/games');
const adminRoutes = require('./routes/admin');
const routerRoutes = require('./routes/router');
const testLoginRoutes = require('./routes/test-login');

const app = express();

// ----------------- Security Middleware -----------------
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ----------------- Database Connection -----------------
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-isp-portal';

// Function to redact credentials in logs
const redactMongoUri = uri => uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@)/, '$1***$3');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  const target = MONGODB_URI.startsWith('mongodb+srv://') ? 'MongoDB Atlas' : 'local MongoDB';
  console.log(`[OK] Connected to ${target}: ${redactMongoUri(MONGODB_URI)}`);
})
.catch(err => console.error('❌ MongoDB connection error:', err));

// ----------------- Local -> Atlas Migration -----------------
/*
To migrate local data to Atlas:

# 1. Dump local DB
mongodump --uri="mongodb://localhost:27017/mern-isp-portal" --out=./dump

# 2. Restore to Atlas
# Bash:
mongorestore --uri="$MONGODB_URI" ./dump/mern-isp-portal
# PowerShell:
mongorestore --uri="$env:MONGODB_URI" .\dump\mern-isp-portal

# Notes:
# - Ensure your Atlas user has write permissions
# - Whitelist your IP: Atlas -> Security -> Network Access
# - Rotate credentials regularly
*/

// ----------------- Routes -----------------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/router', routerRoutes);
app.use('/api/test-login', testLoginRoutes);

// Health check endpoint
app.get('/api/health', (req,res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req,res) => {
  res.status(200).json({
    success: true,
    message: 'MERN ISP Client Portal API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      users: '/api/users',
      games: '/api/games',
      admin: '/api/admin'
    }
  });
});

// 404 handler (no path pattern so it works across express/router versions)
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err,req,res,next) => {
  console.error(err.stack);

  if(err.name==='ValidationError'){
    const errors = Object.values(err.errors).map(e=>e.message);
    return res.status(400).json({ success:false, message:'Validation Error', errors });
  }

  if(err.code===11000){
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success:false, message:`${field} already exists` });
  }

  if(err.name==='JsonWebTokenError'){
    return res.status(401).json({ success:false, message:'Invalid token' });
  }

  res.status(err.status||500).json({ success:false, message:err.message||'Internal server error' });
});

// ----------------- Start Server -----------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
