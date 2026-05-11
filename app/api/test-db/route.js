import { connectDB } from "@/lib/mongoose";

export const runtime = "nodejs";

export async function GET() {
  if (process.env.NODE_ENV === "production" || process.env.DEBUG_API_ERRORS !== "true") {
    return Response.json({ success: false, message: "Not found" }, { status: 404 });
  }

  try {
    await connectDB();
    
    return Response.json({ 
      success: true, 
      message: "MongoDB connected successfully",
      database: process.env.MONGODB_DBNAME || "mern-isp-portal"
    }, { status: 200 });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return Response.json({ 
      success: false, 
      error: error?.message,
      stack: process.env.NODE_ENV !== "production" && process.env.DEBUG_API_ERRORS === "true" ? error?.stack : undefined
    }, { status: 500 });
  }
}
