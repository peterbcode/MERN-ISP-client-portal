import { NextRequest, NextResponse } from "next/server";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WaitlistRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
}

// ─── API Route Handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body: WaitlistRequest = await request.json();
    const { name, email, phone, address } = body;

    // Validate input
    if (!name || !email || !address) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, or address" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // In production, you would:
    // 1. Store this in a database (MySQL, PostgreSQL, MongoDB, etc.)
    // 2. Send a confirmation email
    // 3. Add to your CRM or marketing tool (Mailchimp, etc.)
    
    // Example database insertion (pseudo-code):
    /*
    const db = await getDatabaseConnection();
    await db.query(
      'INSERT INTO waitlist (name, email, phone, address, created_at) VALUES (?, ?, ?, ?, NOW())',
      [name, email, phone, address]
    );
    */

    // For now, just log the data (remove this in production)
    console.log("Waitlist signup:", { name, email, phone, address });

    return NextResponse.json({
      success: true,
      message: "Successfully added to waitlist",
    });
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
