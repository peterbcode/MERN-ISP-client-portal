# Environment Variables Documentation

## Required Environment Variables for Vercel Deployment

### 1. MONGODB_URI (Required)
**Purpose**: MongoDB Atlas connection string for database connectivity
**Format**: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`
**Example**:
```
mongodb+srv://<dbUser>:<dbPassword>@<clusterHost>/<dbName>?retryWrites=true&w=majority&appName=mern-isp-client-portal
```
**Note**: If your password contains special characters (like `@`, `:` or `/`), URL-encode it in the connection string.
**How to set in Vercel**:
1. Go to Vercel Project Dashboard → Settings → Environment Variables
2. Add Variable Name: `MONGODB_URI`
3. Add your MongoDB Atlas connection string as the Value
4. Select Environment: Production (and Preview if needed)

### 2. JWT_SECRET (Required)
**Purpose**: Secret key for JWT token signing and verification
**Format**: Any long, random string (at least 32 characters recommended)
**Example**: `your_super_secret_jwt_key_here_change_in_production`
**How to set in Vercel**:
1. Add Variable Name: `JWT_SECRET`
2. Add your secret key as the Value

### 3. JWT_EXPIRE (Optional)
**Purpose**: JWT token expiration time
**Default**: `7d` (7 days)
**Format**: Time string like `7d`, `24h`, `30m`

## Setup Instructions

### Step 1: Get MongoDB Atlas Connection String
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster or use existing one
3. Go to Database → Connect → Connect your application
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<database>` with your database name

### Step 2: Set Environment Variables in Vercel
1. Go to your Vercel project dashboard
2. Click "Settings" tab
3. Click "Environment Variables" in the sidebar
4. Add the required variables listed above

### Step 3: Deploy
After setting the environment variables, push your changes and Vercel will automatically redeploy with the new environment variables.

## Local Development
For local development, create a `.env.local` file in the project root:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your_database?retryWrites=true&w=majority
JWT_SECRET=your_local_development_secret_key
JWT_EXPIRE=7d
```

## Security Notes
- Never commit `.env.local` to version control
- Use different secrets for development and production
- Make sure your MongoDB Atlas allows access from Vercel's IP ranges
- Use strong, random secrets for JWT_SECRET
