# MERN ISP Portal - Backend API

This is the backend API server for the MERN ISP Client Portal, providing authentication, user management, game scoring, and admin functionality.

## Features

- **JWT Authentication** with secure token management
- **Role-based Access Control** (User/Admin)
- **User Management** with profiles and preferences
- **Game Scoring System** with global leaderboards
- **Admin Dashboard** for user and game management
- **Security Features** including rate limiting and input validation
- **MongoDB Integration** with Mongoose ODM

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/mern-isp-portal
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
PORT=5000
```

4. Start MongoDB server (if not running)

5. Start the API server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users/leaderboard` - Global leaderboard
- `GET /api/users/profile/:username` - Public profile
- `GET /api/users/search` - Search users
- `GET /api/users/stats` - User statistics (private)
- `PUT /api/users/preferences` - Update preferences
- `POST /api/users/achievements` - Add achievement
- `DELETE /api/users/account` - Delete account

### Games
- `GET /api/games` - List games with filtering
- `GET /api/games/featured` - Featured games
- `GET /api/games/popular` - Popular games
- `GET /api/games/:slug` - Game details
- `GET /api/games/:slug/leaderboard` - Game leaderboard
- `POST /api/games/:slug/play` - Record game session
- `POST /api/games/:slug/rate` - Rate game
- `GET /api/games/categories/list` - All categories

### Admin (requires admin role)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - Manage users
- `GET /api/admin/users/:id` - User details
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Deactivate user
- `GET /api/admin/games` - Manage games
- `POST /api/admin/games` - Create game
- `PUT /api/admin/games/:id` - Update game
- `DELETE /api/admin/games/:id` - Delete game
- `GET /api/admin/leaderboard` - Global leaderboard

## Security Features

- **JWT Authentication** with expiration
- **Rate Limiting** on sensitive endpoints
- **Input Validation** using validator library
- **Password Hashing** with bcrypt
- **CORS Protection** configured for frontend
- **Helmet.js** for security headers
- **Role-based Authorization** middleware

## Database Schema

### User Model
- Authentication fields (email, password, username)
- Profile information (name, avatar, bio)
- Gaming data (high scores, achievements, stats)
- Preferences (theme, notifications, privacy)
- Account status and timestamps

### Game Model
- Basic information (name, description, category)
- Media assets (thumbnail, screenshots)
- Game URL and instructions
- Statistics tracking (plays, ratings, scores)
- Leaderboard data

## Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/mern-isp-portal

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
FRONTEND_URL=http://localhost:3000
```

## Development

The API server includes:
- Comprehensive error handling
- Request/response logging
- Validation middleware
- Security headers
- CORS configuration

## Testing

```bash
npm test
```

## Deployment

1. Set environment variables for production
2. Ensure MongoDB is accessible
3. Use a process manager like PM2
4. Configure reverse proxy (nginx/Apache)
5. Set up SSL certificates

## License

MIT License
