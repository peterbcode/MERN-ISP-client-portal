export async function GET() {
  try {
    const envVars = {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'MISSING',
      NODE_ENV: process.env.NODE_ENV,
      // Show first few chars of client ID for verification (never show full secret)
      GOOGLE_CLIENT_ID_PREVIEW: process.env.GOOGLE_CLIENT_ID ? 
        process.env.GOOGLE_CLIENT_ID.substring(0, 10) + '...' : 'MISSING'
    };

    return Response.json({
      success: true,
      message: 'Google OAuth environment variables check',
      env: envVars,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
