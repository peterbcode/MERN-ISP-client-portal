import { connectDB } from "@/lib/mongoose";

export async function GET() {
  try {
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
