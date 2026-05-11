export const runtime = 'nodejs';

// POST /api/test-login - Development-only endpoint to verify frontend-backend connection
export async function POST(request) {
  if (process.env.NODE_ENV === 'production' || process.env.DEBUG_API_ERRORS !== 'true') {
    return Response.json({ success: false, message: 'Not found' }, { status: 404 });
  }

  try {
    const body = await request.json().catch(() => ({}));

    return Response.json({
      success: true,
      message: 'Test endpoint working',
      receivedKeys: Object.keys(body || {}),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    console.error('Test login error:', error);
    return Response.json({
      success: false,
      message: 'Test endpoint failed',
      error: error.message,
    }, { status: 500 });
  }
}
