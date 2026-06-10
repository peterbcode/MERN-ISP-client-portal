import { NextRequest, NextResponse } from "next/server";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CoverageRequest {
  lat: number;
  lng: number;
  address: string;
  suburb?: string;
  postalCode?: string;
}

interface CoverageResponse {
  result: "high" | "wireless-only" | "no-coverage";
  message?: string;
}

// ─── Coverage Zones (Example Data) ──────────────────────────────────────────────
// In production, this would come from a database or GeoJSON file
// These are simplified polygon coordinates for demonstration

const COVERAGE_ZONES = {
  // High coverage zones (both Fibre and Wireless)
  highCoverage: [
    {
      name: "Riebeek Valley Central",
      // Simplified polygon coordinates for Riebeek Valley area
      // In production, use proper GeoJSON with many more points
      polygon: [
        { lat: -33.38, lng: 18.85 },
        { lat: -33.38, lng: 18.95 },
        { lat: -33.42, lng: 18.95 },
        { lat: -33.42, lng: 18.85 },
      ],
    },
    {
      name: "Malmesbury Central",
      polygon: [
        { lat: -33.45, lng: 18.70 },
        { lat: -33.45, lng: 18.80 },
        { lat: -33.50, lng: 18.80 },
        { lat: -33.50, lng: 18.70 },
      ],
    },
  ],
  // Wireless only zones
  wirelessOnly: [
    {
      name: "Riebeek Valley Outskirts",
      polygon: [
        { lat: -33.35, lng: 18.80 },
        { lat: -33.35, lng: 19.00 },
        { lat: -33.45, lng: 19.00 },
        { lat: -33.45, lng: 18.80 },
      ],
    },
    {
      name: "Moorreesburg Area",
      polygon: [
        { lat: -33.05, lng: 18.45 },
        { lat: -33.05, lng: 18.55 },
        { lat: -33.10, lng: 18.55 },
        { lat: -33.10, lng: 18.45 },
      ],
    },
  ],
};

// ─── Helper: Point in Polygon Algorithm ─────────────────────────────────────────
// Uses ray casting algorithm to check if a point is inside a polygon

function isPointInPolygon(point: { lat: number; lng: number }, polygon: { lat: number; lng: number }[]): boolean {
  let inside = false;
  const x = point.lng;
  const y = point.lat;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

// ─── Helper: Check Coverage for Coordinates ──────────────────────────────────────

function checkCoverage(lat: number, lng: number): "high" | "wireless-only" | "no-coverage" {
  // Check high coverage zones first
  for (const zone of COVERAGE_ZONES.highCoverage) {
    if (isPointInPolygon({ lat, lng }, zone.polygon)) {
      return "high";
    }
  }

  // Check wireless only zones
  for (const zone of COVERAGE_ZONES.wirelessOnly) {
    if (isPointInPolygon({ lat, lng }, zone.polygon)) {
      return "wireless-only";
    }
  }

  // No coverage
  return "no-coverage";
}

// ─── API Route Handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body: CoverageRequest = await request.json();
    const { lat, lng, address, suburb, postalCode } = body;

    // Validate input
    if (!lat || !lng || !address) {
      return NextResponse.json(
        { error: "Missing required fields: lat, lng, or address" },
        { status: 400 }
      );
    }

    // Validate coordinates
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 }
      );
    }

    // Check coverage
    const result = checkCoverage(lat, lng);

    const response: CoverageResponse = {
      result,
      message: result === "high" 
        ? "High-speed Wireless and Fibre available" 
        : result === "wireless-only" 
        ? "High-speed Wireless available" 
        : "No coverage at this location",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error checking coverage:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── GET Handler (Optional - for testing) ─────────────────────────────────────────

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lng = parseFloat(searchParams.get("lng") || "0");

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Missing lat or lng parameters" },
      { status: 400 }
    );
  }

  const result = checkCoverage(lat, lng);

  return NextResponse.json({
    result,
    lat,
    lng,
  });
}
