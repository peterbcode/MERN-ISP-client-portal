import { connectDB } from "@/lib/mongoose";

export async function GET() {
  try {
    if (process.env.NODE_ENV === 'production' || process.env.DEBUG_API_ERRORS !== 'true') {
      return Response.json(
        { success: false, message: 'Debug endpoint disabled' },
        { status: 404 }
      );
    }

    // Test MongoDB connection
    await connectDB();
    
    return Response.json({
      success: true,
      message: "API and MongoDB are working correctly",
      timestamp: new Date().toISOString(),
      database: "connected"
    });
  } catch (error) {
    console.error("Test API error:", error);
    return Response.json({
      success: false,
      message: "API or MongoDB connection failed",
      error: error.message,
      timestamp: new Date().toISOString(),
      database: "disconnected"
    }, { status: 500 });
  }
}
