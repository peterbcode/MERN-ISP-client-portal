import { getGoogleUser, createOrUpdateGoogleUser, generateJWTToken } from '@/lib/google-auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=${encodeURIComponent(error)}`
      );
    }

    if (!code) {
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=${encodeURIComponent('No authorization code received')}`
      );
    }

    // Get Google user info
    const googleUser = await getGoogleUser(code);
    
    // Create or update user in database
    const user = await createOrUpdateGoogleUser(googleUser);
    
    // Generate JWT token
    const token = generateJWTToken(user);

    // Redirect to dashboard with token
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?token=${token}`;
    
    return Response.redirect(redirectUrl);

  } catch (error) {
    console.error('Google auth callback error:', error);
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?error=${encodeURIComponent('Authentication failed')}`
    );
  }
}
