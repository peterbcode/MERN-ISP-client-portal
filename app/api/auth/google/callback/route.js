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
    
    const token = generateJWTToken(user);

    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
    const escapedToken = JSON.stringify(token);
    const escapedDashboardUrl = JSON.stringify(dashboardUrl);

    return new Response(
      `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="robots" content="noindex" />
          <title>Signing in...</title>
        </head>
        <body>
          <script>
            localStorage.setItem("token", ${escapedToken});
            window.location.replace(${escapedDashboardUrl});
          </script>
          <noscript>JavaScript is required to finish signing in.</noscript>
        </body>
      </html>`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          "Referrer-Policy": "no-referrer",
        },
      }
    );

  } catch (error) {
    console.error('Google auth callback error:', error);
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?error=${encodeURIComponent('Authentication failed')}`
    );
  }
}
