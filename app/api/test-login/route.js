export const runtime = 'nodejs';

// POST /api/test-login - Test endpoint to verify frontend-backend connection
export async function POST(request) {
  try {
    console.log('🧪 Test login request received');
    const body = await request.json();
    console.log('🧪 Request body:', body);
    
    return Response.json({
      success: true,
      message: 'Test endpoint working',
      received: body,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Test login error:', error);
    return Response.json({
      success: false,
      message: 'Test endpoint failed',
      error: error.message
    }, { status: 500 });
  }
}
