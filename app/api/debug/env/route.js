export const runtime = 'nodejs';

// GET /api/debug/env - Debug environment variables (remove in production)
export async function GET(request) {
  if (process.env.NODE_ENV === 'production' || process.env.DEBUG_API_ERRORS !== 'true') {
    return Response.json({ success: false, message: 'Not found' }, { status: 404 });
  }

  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    hasMongoUri: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasDbName: !!process.env.MONGODB_DBNAME,
    dbName: process.env.MONGODB_DBNAME,
    debugMode: process.env.DEBUG_API_ERRORS === 'true'
  };

  return Response.json({
    success: true,
    message: 'Environment variables debug info',
    environment: envVars,
    timestamp: new Date().toISOString()
  });
}
