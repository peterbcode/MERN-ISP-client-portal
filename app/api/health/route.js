export const runtime = 'nodejs';

// GET /api/health - Health check endpoint
export async function GET(request) {
  return Response.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    message: 'Serverless functions are working correctly!'
  });
}
