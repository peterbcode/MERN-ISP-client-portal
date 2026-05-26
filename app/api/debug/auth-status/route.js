export async function POST() {
  try {
    if (process.env.NODE_ENV === 'production' || process.env.DEBUG_API_ERRORS !== 'true') {
      return Response.json(
        { success: false, message: 'Debug endpoint disabled' },
        { status: 404 }
      );
    }

    // Test basic auth functionality
    const testData = {
      email: 'test@example.com',
      password: 'test123'
    };

    // Make internal request to login API
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    return Response.json({
      success: true,
      message: 'Auth API test completed',
      loginResponse: result,
      responseStatus: response.status,
      environment: {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'MISSING',
        JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'MISSING',
        MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'MISSING'
      },
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
