import { getGoogleAuthURL } from '@/lib/google-auth';

export async function GET() {
  try {
    const authUrl = getGoogleAuthURL();
    return Response.redirect(authUrl);
  } catch (error) {
    console.error('Google auth error:', error);
    return Response.json(
      { error: 'Failed to initiate Google authentication' },
      { status: 500 }
    );
  }
}
