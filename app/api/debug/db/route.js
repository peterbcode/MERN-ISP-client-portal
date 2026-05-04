import { connectDB } from '@/lib/mongoose';

export const runtime = 'nodejs';

// GET /api/debug/db - Test database connection
export async function GET(request) {
  if (process.env.DEBUG_API_ERRORS !== 'true') {
    return Response.json({ success: false, message: 'Not found' }, { status: 404 });
  }

  try {
    console.log("🔍 Testing database connection...");
    
    const envCheck = {
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriPrefix: process.env.MONGODB_URI?.substring(0, 30) + "..."
    };

    if (!process.env.MONGODB_URI) {
      return Response.json({
        success: false,
        error: "Missing MONGODB_URI environment variable",
        environment: envCheck
      }, { status: 500 });
    }

    const startTime = Date.now();
    await connectDB();
    const connectionTime = Date.now() - startTime;

    return Response.json({
      success: true,
      message: 'Database connection successful',
      connectionTime: `${connectionTime}ms`,
      environment: envCheck,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Database connection error:', error);
    return Response.json({
      success: false,
      error: error.message,
      errorType: error.constructor.name,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
