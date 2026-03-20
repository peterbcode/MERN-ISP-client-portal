# 🚀 Vercel Serverless Deployment Guide

## 📋 Overview
Your MERN + Next.js application has been converted from traditional Express backend to Vercel serverless API routes. This guide will help you deploy successfully.

## 🏗️ New Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js       │    │  Vercel API      │    │   MongoDB Atlas │
│   Frontend      │◄──►│  Routes (Lambda) │◄──►│   Database      │
│   (Static/SSR)  │    │  (Serverless)    │    │   (Cloud)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
mern-isp-client-portal/
├── app/
│   ├── api/               # 🆕 Vercel serverless routes
│   │   ├── auth/
│   │   │   ├── register/route.js
│   │   │   ├── login/route.js
│   │   │   └── me/route.js
│   │   ├── users/
│   │   │   ├── leaderboard/route.js
│   │   │   └── profile/[username]/route.js
│   │   ├── admin/
│   │   │   └── stats/route.js
│   │   └── router/
│   │       ├── status/route.js
│   │       ├── devices/route.js
│   │       └── reboot/route.js
│   └── ...               # Your existing pages
├── lib/
│   ├── mongodb.js         # 🆕 Database connection helper
│   ├── auth.js           # 🔄 Updated for production
│   └── tenda-router.js   # Existing router library
├── models/               # 🆕 Mongoose models
│   ├── User.js
│   └── Game.js
├── .env.local           # 🆕 Local development variables
├── .env.production      # 🆕 Production variables template
├── vercel.json          # 🆕 Vercel configuration
└── package.json         # 🔄 Updated dependencies
```

## 🔧 Environment Variables Setup

### 1. Local Development
Copy `.env.production` to `.env.local` and update values:

```bash
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5001/api

# Database
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@cluster0.cszm9.mongodb.net/?appName=Cluster0
# If your URI does not include a database name (ends with `.mongodb.net/?...`),
# set this (defaults to `mern-isp-portal` if omitted).
MONGODB_DBNAME=mern-isp-portal

# JWT
JWT_SECRET=your_local_secret_key
```

### 2. Vercel Production
Add these to Vercel Dashboard → Settings → Environment Variables:

```bash 
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@cluster0.cszm9.mongodb.net/?appName=Cluster0
MONGODB_DBNAME=mern-isp-portal
JWT_SECRET=your_production_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
```

### MongoDB Atlas quick setup (dev)
1. Atlas → **Database** → create a cluster (M0 is fine for dev).
2. Atlas → **Security** → **Database Access** → create a database user.
3. Atlas → **Security** → **Network Access** → allow your current IP (or `0.0.0.0/0` temporarily for testing).
4. Atlas → **Connect** → pick **Drivers** to copy the `mongodb+srv://...` URI and paste it into `MONGODB_URI`.

### Test Atlas with mongosh
```bash
mongosh "mongodb+srv://<db_username>:<db_password>@cluster0.cszm9.mongodb.net/?appName=Cluster0"
```

### Move your local data to Atlas (optional)
If you already have data locally, install MongoDB Database Tools (`mongodump`/`mongorestore`) and run:
```bash
mongodump --uri="mongodb://localhost:27017/mern-isp-portal" --out=./dump
mongorestore --uri="mongodb+srv://<db_username>:<db_password>@cluster0.cszm9.mongodb.net/?appName=Cluster0" ./dump/mern-isp-portal
```

## 🚀 Deployment Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Test Locally
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Deploy to Vercel

#### Option A: GitHub Integration (Recommended)
1. Push code to GitHub
2. Connect Vercel to your repository
3. Import environment variables
4. Deploy automatically

#### Option B: Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

## 🔄 API Route Mapping

| Express Route | Vercel Route | Method |
|---------------|---------------|---------|
| POST /api/auth/register | /api/auth/register | POST |
| POST /api/auth/login | /api/auth/login | POST |
| GET /api/auth/me | /api/auth/me | GET |
| PUT /api/auth/me | /api/auth/me | PUT |
| GET /api/users/leaderboard | /api/users/leaderboard | GET |
| GET /api/users/profile/:username | /api/users/profile/[username] | GET |
| GET /api/admin/stats | /api/admin/stats | GET |
| GET /api/router/status | /api/router/status | GET |
| GET /api/router/devices | /api/router/devices | GET |
| POST /api/router/reboot | /api/router/reboot | POST |

## 🛡️ Security Features

- ✅ JWT authentication with Bearer tokens
- ✅ Password hashing with bcrypt (cost 12)
- ✅ Input validation and sanitization
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configuration
- ✅ Error handling and logging
- ✅ Admin role protection

## 📊 Database Features

- ✅ Connection pooling for serverless
- ✅ Automatic reconnection
- ✅ Indexes for performance
- ✅ User and Game schemas
- ✅ Virtual fields and methods

## 🧪 Testing

### Test Authentication
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Protected Routes
```bash
# Get user profile
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔍 Debugging

### Check Vercel Functions
1. Go to Vercel Dashboard
2. Click on your project
3. View "Functions" tab
4. Check function logs

### Common Issues
- **MongoDB Connection**: Verify MONGODB_URI format
- **JWT Secret**: Must be same in all environments
- **CORS**: Automatically handled by Vercel
- **Timeouts**: Functions have 30-second limit

## 📈 Performance Optimizations

- ✅ Connection caching for MongoDB
- ✅ Minimal dependencies in functions
- ✅ Efficient error handling
- ✅ Proper HTTP status codes
- ✅ Response caching headers

## 🎯 Production Checklist

- [ ] Environment variables configured in Vercel
- [ ] MongoDB Atlas cluster created
- [ ] JWT secret is strong and unique
- [ ] All API routes tested locally
- [ ] Build completes without errors
- [ ] Deploy to staging first
- [ ] Test authentication flow
- [ ] Monitor function logs
- [ ] Set up monitoring/alerts

## 🆘 Support

### Vercel Documentation
- [Serverless Functions](https://vercel.com/docs/concepts/functions)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Database Integration](https://vercel.com/docs/storage/vercel-postgres)

### MongoDB Atlas
- [Connection Guide](https://docs.mongodb.com/manual/reference/connection-string/)
- [Best Practices](https://docs.mongodb.com/manual/administration/backup/)

Your application is now ready for production deployment on Vercel! 🎉
