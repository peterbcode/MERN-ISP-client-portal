# Google OAuth Setup Guide

This guide explains how to configure Google OAuth authentication for the ISP Client Portal.

## Prerequisites

1. Google Cloud Console account
2. Your application's domain (for production)

## Steps to Configure Google OAuth

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API

### 2. Create OAuth 2.0 Credentials

1. In the Google Cloud Console, go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth 2.0 Client IDs**
3. Select **Web application** as the application type
4. Give it a name (e.g., "ISP Client Portal")
5. Add authorized redirect URIs:
   - **Development**: `http://localhost:3000/api/auth/google/callback`
   - **Production**: `https://your-domain.com/api/auth/google/callback`

### 3. Get Credentials

After creating the credentials, you'll receive:
- **Client ID** (starts with `...apps.googleusercontent.com`)
- **Client Secret** (a long string)

### 4. Environment Variables

Add these to your environment:

```env
# For local development (.env.local)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# For production (Vercel)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 5. Update User Model

Make sure your User model supports Google authentication fields:

```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  // ... existing fields
  googleId: String,
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  avatar: String,
  isEmailVerified: {
    type: Boolean,
    default: false
  }
});
```

## How It Works

1. User clicks "Continue with Google"
2. Redirects to `/api/auth/google` → Google OAuth consent screen
3. Google redirects to `/api/auth/google/callback` with authorization code
4. Server exchanges code for user info
5. Creates/updates user in database
6. Generates JWT token and redirects to dashboard

## Testing

1. Start your development server: `npm run dev`
2. Navigate to `/login`
3. Click "Continue with Google"
4. Complete Google authentication
5. Should redirect to dashboard with logged-in session

## Security Notes

- Never expose `GOOGLE_CLIENT_SECRET` in client-side code
- Always use HTTPS in production
- Add your production domain to authorized redirect URIs
- Regularly rotate your client secrets

## Troubleshooting

### Common Errors

1. **"redirect_uri_mismatch"**: Check that your redirect URI matches exactly what's configured in Google Cloud Console
2. **"invalid_client"**: Verify your client ID and secret are correct
3. **"access_denied"**: User denied access or scopes are too broad

### Debug Mode

Add this to your environment for debugging:
```env
DEBUG_API_ERRORS=true
```

This will provide more detailed error messages in the console.
