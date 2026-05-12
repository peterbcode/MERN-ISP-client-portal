import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import { connectDB } from './mongoose';
import User from '../models/User';

// Check for required environment variables at runtime
const getOAuth2Client = () => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID environment variable is required');
  }
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('GOOGLE_CLIENT_SECRET environment variable is required');
  }
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error('NEXT_PUBLIC_APP_URL environment variable is required');
  }

  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_APP_URL + '/api/auth/google/callback'
  );
};

export function getGoogleAuthURL() {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];

  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });
}

export async function getGoogleUser(code) {
  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      picture: data.picture,
      verified: data.verified_email
    };
  } catch (error) {
    console.error('Error getting Google user:', error);
    throw new Error('Failed to authenticate with Google');
  }
}

export async function createOrUpdateGoogleUser(googleUser) {
  try {
    await connectDB();

    let user = await User.findOne({ email: googleUser.email });

    if (user) {
      // Update existing user with Google info
      if (!user.googleId) {
        user.googleId = googleUser.id;
      }
      if (!user.avatar && googleUser.picture) {
        user.avatar = googleUser.picture;
      }
      user.isEmailVerified = googleUser.verified;
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user from Google
      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.id,
        avatar: googleUser.picture,
        isEmailVerified: googleUser.verified,
        provider: 'google',
        lastLogin: new Date(),
      });
      await user.save();
    }

    return user;
  } catch (error) {
    console.error('Error creating/updating Google user:', error);
    throw new Error('Failed to create user account');
  }
}

export function generateJWTToken(user) {
  return jwt.sign(
    { 
      userId: user._id, 
      email: user.email,
      name: user.name 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
}
