# Internet Coverage Checker - Implementation Guide

## Overview
This is a modern, high-converting "Check Internet Coverage" tool for Valley Computers ISP. It features Google Maps Autocomplete, three result scenarios, and a waitlist system for areas not yet covered.

## Files Created

### Frontend Components
- `app/components/coverage-checker.tsx` - Main React component with Google Maps Autocomplete

### Backend API Routes
- `app/api/check-coverage/route.ts` - API endpoint for checking coverage based on coordinates
- `app/api/waitlist/route.ts` - API endpoint for waitlist signups

---

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
4. Create credentials (API Key)
5. Restrict the key:
   - Application restrictions: HTTP referrers (your domain)
   - API restrictions: Only allow Maps JavaScript API and Places API

### 2. Add API Key to Component

Open `app/components/coverage-checker.tsx` and replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key in TWO places:

**Line 83 (Script loading):**
```typescript
script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
```

### 3. Install Dependencies

```bash
npm install lucide-react @types/google.maps
```

### 4. Add Component to Your Page

Add the CoverageChecker component to any page in your app:

```tsx
import CoverageChecker from "@/app/components/coverage-checker";

export default function YourPage() {
  return (
    <div>
      {/* Your existing content */}
      
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">Check Your Coverage</h2>
          <p className="text-gray-400">Enter your address to see if high-speed internet is available in your area</p>
        </div>
        <CoverageChecker />
      </section>
      
      {/* More content */}
    </div>
  );
}
```

---

## Backend Strategy & Data Management

### Option 1: GeoJSON File (Recommended for Small ISPs)

**Pros:** Simple, no database needed, easy to update
**Cons:** Requires redeployment to update coverage zones

**Implementation:**

1. Create a `coverage-zones.json` file in your project:

```json
{
  "highCoverage": [
    {
      "name": "Riebeek Valley Central",
      "polygon": [
        [-33.38, 18.85],
        [-33.38, 18.95],
        [-33.42, 18.95],
        [-33.42, 18.85]
      ]
    }
  ],
  "wirelessOnly": [
    {
      "name": "Riebeek Valley Outskirts",
      "polygon": [
        [-33.35, 18.80],
        [-33.35, 19.00],
        [-33.45, 19.00],
        [-33.45, 18.80]
      ]
    }
  ]
}
```

2. Update `app/api/check-coverage/route.ts` to read from the JSON file:

```typescript
import coverageZones from '@/coverage-zones.json';

// Replace the COVERAGE_ZONES constant with:
const COVERAGE_ZONES = coverageZones;
```

**How to Get Polygon Coordinates:**

Use [Google My Maps](https://www.google.com/mymaps) or [geojson.io](https://geojson.io/):
1. Draw your coverage area on the map
2. Export as GeoJSON
3. Extract the polygon coordinates

---

### Option 2: PostgreSQL with PostGIS (Recommended for Growing ISPs)

**Pros:** Fast spatial queries, scalable, can update without redeployment
**Cons:** Requires database setup

**Implementation:**

1. Install PostGIS extension in PostgreSQL:
```sql
CREATE EXTENSION postgis;
```

2. Create coverage zones table:
```sql
CREATE TABLE coverage_zones (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  coverage_type VARCHAR(50), -- 'high' or 'wireless-only'
  polygon GEOMETRY(POLYGON, 4326)
);

-- Insert coverage zones
INSERT INTO coverage_zones (name, coverage_type, polygon) VALUES
('Riebeek Valley Central', 'high', 
 ST_GeomFromText('POLYGON((-33.38 18.85, -33.38 18.95, -33.42 18.95, -33.42 18.85, -33.38 18.85))', 4326)
);
```

3. Update the API route to query the database:

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkCoverage(lat: number, lng: number): Promise<string> {
  const point = `POINT(${lng} ${lat})`;
  
  // Check high coverage first
  const highResult = await pool.query(
    `SELECT name FROM coverage_zones 
     WHERE coverage_type = 'high' 
     AND ST_Contains(polygon, ST_GeomFromText($1, 4326))`,
    [point]
  );
  
  if (highResult.rows.length > 0) return 'high';
  
  // Check wireless only
  const wirelessResult = await pool.query(
    `SELECT name FROM coverage_zones 
     WHERE coverage_type = 'wireless-only' 
     AND ST_Contains(polygon, ST_GeomFromText($1, 4326))`,
    [point]
  );
  
  if (wirelessResult.rows.length > 0) return 'wireless-only';
  
  return 'no-coverage';
}
```

---

### Option 3: Integrate with Upstream Provider APIs

**Providers:** Frogfoot, Vumatel, Openserve, Liquid Telecom

**Pros:** Always up-to-date coverage data
**Cons:** May require API access agreements, costs

**Implementation Example (Frogfoot):**

```typescript
async function checkFrogfootCoverage(lat: number, lng: number) {
  const response = await fetch('https://api.frogfoot.com/coverage/check', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.FROGFOOT_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ latitude: lat, longitude: lng })
  });
  
  const data = await response.json();
  return data.coverage; // 'fibre', 'wireless', or 'none'
}
```

---

## Database Setup for Waitlist

### PostgreSQL Example

```sql
CREATE TABLE waitlist (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notified_at TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_address ON waitlist(address);
```

### Update Waitlist API Route

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, address } = body;

  try {
    await pool.query(
      'INSERT INTO waitlist (name, email, phone, address) VALUES ($1, $2, $3, $4)',
      [name, email, phone, address]
    );

    // Optional: Send confirmation email
    // await sendConfirmationEmail(email, name);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }
    throw error;
  }
}
```

---

## Environment Variables

Add these to your `.env.local` file:

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here

# Database (if using PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/valley_computers

# Upstream Provider APIs (if integrating)
FROGFOOT_API_KEY=your_frogfoot_key
VUMATEL_API_KEY=your_vumatel_key
```

---

## Testing the Coverage Checker

### Manual Testing

1. Start your development server:
```bash
npm run dev
```

2. Navigate to the page with the CoverageChecker component

3. Test addresses:
   - **High Coverage:** "Riebeek Valley, Western Cape"
   - **Wireless Only:** "Moorreesburg, Western Cape"
   - **No Coverage:** Any address outside defined zones

### API Testing

Test the coverage API directly:

```bash
# Test with coordinates
curl "http://localhost:3000/api/check-coverage?lat=-33.4&lng=18.9"

# Test with POST
curl -X POST http://localhost:3000/api/check-coverage \
  -H "Content-Type: application/json" \
  -d '{"lat": -33.4, "lng": 18.9, "address": "Test Address"}'
```

---

## Customization

### Styling

The component uses inline styles for easy customization. Modify the CSS in the `<style>` tag within `coverage-checker.tsx`:

- Change colors: Update the `#ff7e26` (orange) to your brand color
- Adjust spacing: Modify padding/margin values
- Change animations: Update the `@keyframes` definitions

### Coverage Zones

Update the polygon coordinates in `app/api/check-coverage/route.ts` to match your actual coverage areas.

### Result Messages

Customize the result text in the component JSX to match your brand voice.

---

## Production Deployment

### Vercel Deployment

1. Add environment variables in Vercel dashboard
2. Deploy as usual - the API routes will work automatically

### Database Setup

If using PostgreSQL:
1. Set up a managed PostgreSQL database (Supabase, Neon, Railway)
2. Add the connection string to environment variables
3. Run the schema creation scripts

### Google Maps API

1. Add your production domain to API key restrictions
2. Enable billing (required for production use)
3. Monitor usage in Google Cloud Console

---

## Troubleshooting

### Google Maps Not Loading

- Check browser console for API key errors
- Verify API key has Places API enabled
- Ensure domain is added to referrer restrictions

### Coverage Not Working

- Verify polygon coordinates are correct
- Check if coordinates are being passed correctly
- Test the API endpoint directly

### TypeScript Errors

- Ensure `@types/google.maps` is installed
- Restart your development server after installing

---

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify API keys and environment variables
3. Test API endpoints directly
4. Review the implementation code comments

---

## License

This component is part of the Valley Computers ISP client portal project.
